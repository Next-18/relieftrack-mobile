import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  getAvailablePackages,
  getBeneficiaryDistributions,
  getBeneficiaryProfile,
  getBeneficiaryNotifications,
  markBeneficiaryNotificationRead,
} from '../services/api';

const RESOURCE_KEYS = ['profile', 'distributions', 'packages', 'notifications'];
const BeneficiaryDataContext = createContext(null);

function makeResourceState(initialValue) {
  return Object.fromEntries(RESOURCE_KEYS.map((key) => [key, initialValue]));
}

export function BeneficiaryDataProvider({ children }) {
  const { session } = useAuth();
  const token = session?.token;
  const beneficiaryId = session?.beneficiaryId;
  const [data, setData] = useState(() => makeResourceState(null));
  const dataRef = useRef(data);
  const activeSessionKey = useRef(null);
  const requestIds = useRef(makeResourceState(0));
  const [loading, setLoading] = useState(() => makeResourceState(true));
  const [refreshing, setRefreshing] = useState(() => makeResourceState(false));
  const [errors, setErrors] = useState(() => makeResourceState(''));
  const [releasedItems, setReleasedItems] = useState(null);

  const dismissReleasedAlert = useCallback(() => {
    setReleasedItems(null);
  }, []);

  const loadResources = useCallback(async (resourceKeys, showRefreshing = false) => {
    if (!token || !beneficiaryId) return;

    const requests = resourceKeys.map((key) => {
      requestIds.current[key] += 1;
      return { key, requestId: requestIds.current[key] };
    });

    setErrors((current) => ({
      ...current,
      ...Object.fromEntries(resourceKeys.map((key) => [key, ''])),
    }));
    setLoading((current) => ({
      ...current,
      ...Object.fromEntries(resourceKeys.map((key) => [key, dataRef.current[key] === null])),
    }));
    if (showRefreshing) {
      setRefreshing((current) => ({
        ...current,
        ...Object.fromEntries(resourceKeys.map((key) => [key, true])),
      }));
    }

    const loaders = {
      profile: () => getBeneficiaryProfile(token, beneficiaryId),
      distributions: () => getBeneficiaryDistributions(token, beneficiaryId),
      packages: () => getAvailablePackages(token),
      notifications: () => getBeneficiaryNotifications(token),
    };

    await Promise.all(requests.map(async ({ key, requestId }) => {
      try {
        const nextValue = await loaders[key]();
        if (requestIds.current[key] !== requestId) return;

        if (key === 'distributions' && Array.isArray(nextValue) && Array.isArray(dataRef.current.distributions)) {
          const isReleased = (item) => String(item.status).toLowerCase() === 'released';
          const releasedIds = new Set(
            dataRef.current.distributions.filter(isReleased).map((item) => String(item.id))
          );
          const newlyReleased = nextValue.filter((item) => isReleased(item) && !releasedIds.has(String(item.id)));
          if (newlyReleased.length > 0) {
            setReleasedItems(newlyReleased);
          }
        }

        setData((current) => {
          const next = { ...current, [key]: nextValue };
          dataRef.current = next;
          return next;
        });
      } catch (error) {
        if (requestIds.current[key] !== requestId) return;
        setErrors((current) => ({
          ...current,
          [key]: error.message || 'Please try again in a moment.',
        }));
      } finally {
        if (requestIds.current[key] === requestId) {
          setLoading((current) => ({ ...current, [key]: false }));
          setRefreshing((current) => ({ ...current, [key]: false }));
        }
      }
    }));
  }, [token, beneficiaryId]);

  useEffect(() => {
    if (!token || !beneficiaryId) {
      activeSessionKey.current = null;
      const emptyData = makeResourceState(null);
      dataRef.current = emptyData;
      setData(emptyData);
      setLoading(makeResourceState(false));
      setRefreshing(makeResourceState(false));
      setErrors(makeResourceState(''));
      setReleasedItems(null);
      return undefined;
    }

    const sessionKey = `${beneficiaryId}:${token}`;
    if (activeSessionKey.current !== sessionKey) {
      activeSessionKey.current = sessionKey;
      const emptyData = makeResourceState(null);
      dataRef.current = emptyData;
      setData(emptyData);
      setLoading(makeResourceState(true));
      setRefreshing(makeResourceState(false));
      setErrors(makeResourceState(''));
      setReleasedItems(null);
    }

    loadResources(RESOURCE_KEYS);
    const pendingAssignmentPoll = setInterval(() => loadResources(['distributions', 'packages', 'notifications'], true), 30000);
    const ids = requestIds.current;
    return () => {
      clearInterval(pendingAssignmentPoll);
      RESOURCE_KEYS.forEach((key) => {
        ids[key] += 1;
      });
    };
  }, [loadResources, token, beneficiaryId]);

  const refresh = useCallback((resourceKey) => {
    const requestedKeys = RESOURCE_KEYS.includes(resourceKey) ? [resourceKey] : RESOURCE_KEYS;
    return loadResources(requestedKeys, true);
  }, [loadResources]);

  const setProfileData = useCallback((nextProfile) => {
    setData((current) => {
      const next = { ...current, profile: nextProfile };
      dataRef.current = next;
      return next;
    });
  }, []);

  const markNotificationRead = useCallback(async (notificationId) => {
    if (!token) return;

    await markBeneficiaryNotificationRead(token, notificationId);
    const readAt = new Date().toISOString();
    setData((current) => {
      const next = {
        ...current,
        notifications: (current.notifications || []).map((notification) => (
          notification.id === notificationId ? { ...notification, read_at: readAt } : notification
        )),
      };
      dataRef.current = next;
      return next;
    });
  }, [token]);

  const visibleData = useMemo(() => {
    // Do not briefly expose the unfiltered inventory while personal history is
    // still loading. Screens can show a loader or the distribution error.
    if (!data.packages || !data.distributions) {
      return { ...data, packages: null };
    }

    const assignedPackageIds = new Set(
      data.distributions
        .filter((distribution) => ['pending', 'released'].includes(String(distribution.status).toLowerCase()))
        .map((distribution) => String(distribution.package_id))
    );

    return {
      ...data,
      packages: data.packages.filter((packageItem) => !assignedPackageIds.has(String(packageItem.id))),
    };
  }, [data]);

  const value = useMemo(() => ({ data: visibleData, loading, refreshing, errors, refresh, setProfileData, markNotificationRead, releasedItems, dismissReleasedAlert }), [
    visibleData,
    loading,
    refreshing,
    errors,
    refresh,
    setProfileData,
    markNotificationRead,
    releasedItems,
    dismissReleasedAlert,
  ]);

  return (
    <BeneficiaryDataContext.Provider value={value}>
      {children}
    </BeneficiaryDataContext.Provider>
  );
}

export function useBeneficiaryData() {
  const value = useContext(BeneficiaryDataContext);
  if (!value) {
    throw new Error('useBeneficiaryData must be used inside BeneficiaryDataProvider.');
  }
  return value;
}
