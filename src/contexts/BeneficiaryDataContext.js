import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  getAvailablePackages,
  getBeneficiaryAnnouncements,
  getBeneficiaryDistributions,
  getBeneficiaryProfile,
  getBeneficiaryNotifications,
  markBeneficiaryNotificationRead,
  submitSupportTicket,
} from '../services/api';
import {
  createOfflineActionId,
  enqueueOfflineAction,
  getCachedResource,
  getOfflineActions,
  removeOfflineAction,
  saveCachedResource,
} from '../services/offlineStore';

const RESOURCE_KEYS = ['profile', 'distributions', 'packages', 'notifications', 'announcements'];
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
  const [alreadyReceivedAlert, setAlreadyReceivedAlert] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [offline, setOffline] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [pendingActions, setPendingActions] = useState([]);
  const syncingActions = useRef(false);

  const refreshPendingActions = useCallback(async () => {
    if (!beneficiaryId) return;
    setPendingActions(await getOfflineActions(beneficiaryId));
  }, [beneficiaryId]);

  const syncPendingActions = useCallback(async () => {
    if (!token || !beneficiaryId || syncingActions.current) return;
    syncingActions.current = true;
    try {
      let actions;
      try {
        actions = await getOfflineActions(beneficiaryId);
      } catch {
        return;
      }
      for (const action of actions) {
        try {
          if (action.kind === 'support_ticket') {
            await submitSupportTicket(token, { ...action.payload, offline_request_id: action.id });
          } else if (action.kind === 'notification_read') {
            await markBeneficiaryNotificationRead(token, action.payload.notificationId);
          } else {
            continue;
          }
          await removeOfflineAction(beneficiaryId, action.id);
        } catch (error) {
          if (error.status === 0) setOffline(true);
          break;
        }
      }
    } finally {
      syncingActions.current = false;
      await refreshPendingActions().catch(() => {});
    }
  }, [token, beneficiaryId, refreshPendingActions]);

  const queueSupportTicket = useCallback(async (payload) => {
    if (!token || !beneficiaryId) throw new Error('Sign in to send a support request.');
    const action = {
      id: createOfflineActionId(),
      beneficiaryId,
      kind: 'support_ticket',
      payload,
    };
    try {
      const ticket = await submitSupportTicket(token, { ...payload, offline_request_id: action.id });
      return { queued: false, ticket };
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      await enqueueOfflineAction(action);
      setOffline(true);
      await refreshPendingActions();
      return { queued: true };
    }
  }, [token, beneficiaryId, refreshPendingActions]);

  const dismissReleasedAlert = useCallback(() => {
    setReleasedItems(null);
  }, []);

  const dismissAlreadyReceivedAlert = useCallback(() => {
    setAlreadyReceivedAlert(null);
  }, []);

  const simulateAlreadyReceivedScan = useCallback((packageName) => {
    let name = packageName;
    if (!name && Array.isArray(dataRef.current.distributions)) {
      const released = dataRef.current.distributions.find(
        (item) => String(item.status).toLowerCase() === 'released'
      );
      if (released) {
        name = released.relief_package?.package_name || released.package_name;
      }
    }
    const finalName = name || 'Relief Family Food Pack';

    setAlreadyReceivedAlert({
      id: Date.now(),
      packageName: finalName,
      title: 'Already received!',
      message: `${finalName} has already been claimed and released. Each beneficiary is only eligible to receive once.`,
    });
    setShowQrModal(false);
  }, []);

  const simulateQrScan = useCallback((packageName = 'Family Food Pack') => {
    setReleasedItems([
      {
        id: Date.now(),
        status: 'Released',
        package_name: packageName,
        relief_package: { package_name: packageName },
      },
    ]);
    setShowQrModal(false);
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
      announcements: () => getBeneficiaryAnnouncements(token),
    };

    await Promise.all(requests.map(async ({ key, requestId }) => {
      try {
        const nextValue = await loaders[key]();
        if (requestIds.current[key] !== requestId) return;
        let cachedAt = new Date().toISOString();
        try {
          cachedAt = await saveCachedResource(beneficiaryId, key, nextValue);
        } catch {
          // Keep online use working when this app binary has not enabled SQLCipher yet.
        }
        setLastSyncedAt((current) => !current || cachedAt > current ? cachedAt : current);
        setOffline(false);
        syncPendingActions().catch(() => {});

        if (key === 'distributions' && Array.isArray(nextValue) && Array.isArray(dataRef.current.distributions)) {
          const isReleased = (item) => String(item.status).toLowerCase() === 'released';
          const releasedIds = new Set(
            dataRef.current.distributions.filter(isReleased).map((item) => String(item.id))
          );
          const newlyReleased = nextValue.filter((item) => isReleased(item) && !releasedIds.has(String(item.id)));
          if (newlyReleased.length > 0) {
            // Immediate transition: close QR modal and display sweet alert
            setReleasedItems(newlyReleased);
            setShowQrModal(false);
          }
        }

        setData((current) => {
          const next = { ...current, [key]: nextValue };
          dataRef.current = next;
          return next;
        });
      } catch (error) {
        if (requestIds.current[key] !== requestId) return;
        if (error.status === 0) setOffline(true);
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
  }, [token, beneficiaryId, syncPendingActions]);

  // Initial data load when session changes
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
      setAlreadyReceivedAlert(null);
      setShowQrModal(false);
      setPendingActions([]);
      setLastSyncedAt(null);
      setOffline(false);
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
      setAlreadyReceivedAlert(null);
      setShowQrModal(false);
      setPendingActions([]);
      setLastSyncedAt(null);
      setOffline(false);
      (async () => {
        const cached = await Promise.all(RESOURCE_KEYS.map(async (key) => [key, await getCachedResource(beneficiaryId, key).catch(() => null)]));
        if (activeSessionKey.current !== sessionKey) return;
        const restoredData = makeResourceState(null);
        let newestUpdate = null;
        for (const [key, entry] of cached) {
          if (entry) {
            restoredData[key] = entry.value;
            if (!newestUpdate || entry.updatedAt > newestUpdate) newestUpdate = entry.updatedAt;
          }
        }
        dataRef.current = restoredData;
        setData(restoredData);
        setLastSyncedAt(newestUpdate);
        setLoading((current) => Object.fromEntries(RESOURCE_KEYS.map((key) => [key, restoredData[key] === null])));
        await refreshPendingActions().catch(() => {});
        await loadResources(RESOURCE_KEYS);
      })();
      return undefined;
    }

    loadResources(RESOURCE_KEYS);
  }, [loadResources, token, beneficiaryId, refreshPendingActions]);

  // Fast adaptive polling for instant QR release detection
  const hasPending = useMemo(() => {
    return (
      Array.isArray(data.distributions) &&
      data.distributions.some((item) =>
        ['pending', 'assigned'].includes(String(item.status).toLowerCase())
      )
    );
  }, [data.distributions]);

  useEffect(() => {
    if (!token || !beneficiaryId) return undefined;

    // When showing QR code at distribution counter: poll every 1.5s for immediate alert
    // When pending assignment exists: poll every 3.5s
    // When idle: poll every 30s
    const pollInterval = showQrModal ? 1500 : hasPending ? 3500 : 30000;

    const intervalId = setInterval(() => {
      loadResources(['distributions', 'packages', 'notifications', 'announcements'], false);
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [token, beneficiaryId, showQrModal, hasPending, loadResources]);

  const refresh = useCallback((resourceKey) => {
    const requestedKeys = RESOURCE_KEYS.includes(resourceKey) ? [resourceKey] : RESOURCE_KEYS;
    return loadResources(requestedKeys, true);
  }, [loadResources]);

  const setProfileData = useCallback((nextProfile) => {
    setData((current) => {
      const next = { ...current, profile: nextProfile };
      dataRef.current = next;
      saveCachedResource(beneficiaryId, 'profile', nextProfile).then(setLastSyncedAt).catch(() => {});
      return next;
    });
  }, [beneficiaryId]);

  const markNotificationRead = useCallback(async (notificationId) => {
    if (!token) return;

    const readAt = new Date().toISOString();
    try {
      await markBeneficiaryNotificationRead(token, notificationId);
    } catch (error) {
      if (error.status !== 0) throw error;
      await enqueueOfflineAction({
        id: createOfflineActionId(),
        beneficiaryId,
        kind: 'notification_read',
        payload: { notificationId },
      });
      setOffline(true);
      await refreshPendingActions();
    }
    setData((current) => {
      const next = {
        ...current,
        notifications: (current.notifications || []).map((notification) => (
          notification.id === notificationId ? { ...notification, read_at: readAt } : notification
        )),
      };
      dataRef.current = next;
      saveCachedResource(beneficiaryId, 'notifications', next.notifications || []).catch(() => {});
      return next;
    });
  }, [token, beneficiaryId, refreshPendingActions]);

  const visibleData = useMemo(() => {
    const announcementUpdates = (data.announcements || []).map((announcement) => ({
      ...announcement,
      message: announcement.body,
      created_at: announcement.published_at,
      is_announcement: true,
    }));
    const updates = [...announcementUpdates, ...(data.notifications || [])]
      .sort((a, b) => new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0));

    if (!data.packages || !data.distributions) {
      return { ...data, packages: null, updates };
    }

    const assignedPackageIds = new Set(
      data.distributions
        .filter((distribution) => ['pending', 'assigned', 'released'].includes(String(distribution.status).toLowerCase()))
        .map((distribution) => String(distribution.package_id))
    );

    return {
      ...data,
      updates,
      packages: data.packages.filter((packageItem) => !assignedPackageIds.has(String(packageItem.id))),
    };
  }, [data]);

  const value = useMemo(() => ({
    data: visibleData,
    loading,
    refreshing,
    errors,
    offline,
    lastSyncedAt,
    pendingActions,
    refresh,
    syncPendingActions,
    queueSupportTicket,
    setProfileData,
    markNotificationRead,
    releasedItems,
    dismissReleasedAlert,
    alreadyReceivedAlert,
    dismissAlreadyReceivedAlert,
    showQrModal,
    setShowQrModal,
    simulateQrScan,
    simulateAlreadyReceivedScan,
  }), [
    visibleData,
    loading,
    refreshing,
    errors,
    offline,
    lastSyncedAt,
    pendingActions,
    refresh,
    syncPendingActions,
    queueSupportTicket,
    setProfileData,
    markNotificationRead,
    releasedItems,
    dismissReleasedAlert,
    alreadyReceivedAlert,
    dismissAlreadyReceivedAlert,
    showQrModal,
    simulateQrScan,
    simulateAlreadyReceivedScan,
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
