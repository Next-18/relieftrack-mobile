import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  getAvailablePackages,
  getBeneficiaryDistributions,
  getBeneficiaryProfile,
} from '../services/api';

const RESOURCE_KEYS = ['profile', 'distributions', 'packages'];
const BeneficiaryDataContext = createContext(null);

function makeResourceState(initialValue) {
  return Object.fromEntries(RESOURCE_KEYS.map((key) => [key, initialValue]));
}

export function BeneficiaryDataProvider({ children }) {
  const { session } = useAuth();
  const [data, setData] = useState(() => makeResourceState(null));
  const dataRef = useRef(data);
  const requestIds = useRef(makeResourceState(0));
  const [loading, setLoading] = useState(() => makeResourceState(true));
  const [refreshing, setRefreshing] = useState(() => makeResourceState(false));
  const [errors, setErrors] = useState(() => makeResourceState(''));

  const loadResources = useCallback(async (resourceKeys, showRefreshing = false) => {
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
      profile: () => getBeneficiaryProfile(session.token, session.beneficiaryId),
      distributions: () => getBeneficiaryDistributions(session.token, session.beneficiaryId),
      packages: () => getAvailablePackages(session.token),
    };

    await Promise.all(requests.map(async ({ key, requestId }) => {
      try {
        const nextValue = await loaders[key]();
        if (requestIds.current[key] !== requestId) return;

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
  }, [session.token, session.beneficiaryId]);

  useEffect(() => {
    loadResources(RESOURCE_KEYS);
    const ids = requestIds.current;
    return () => {
      RESOURCE_KEYS.forEach((key) => {
        ids[key] += 1;
      });
    };
  }, [loadResources]);

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

  const value = useMemo(() => ({ data, loading, refreshing, errors, refresh, setProfileData }), [
    data,
    loading,
    refreshing,
    errors,
    refresh,
    setProfileData,
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
