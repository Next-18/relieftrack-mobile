import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getAuthenticatedUser,
  loginBeneficiary,
  logoutBeneficiary,
  changePassword,
} from '../services/api';
import {
  clearSavedSession,
  getSavedSession,
  saveSession,
} from '../services/authStorage';

const AuthContext = createContext(null);

function makeSession(token, account, fallbackUser, fallbackNumber) {
  const beneficiaryId = account?.beneficiary_id;
  const beneficiaryNo = account?.email || fallbackUser?.beneficiary_no || fallbackNumber;
  const name = account?.name || fallbackUser?.name;
  const passwordChanged = account?.password_changed ?? fallbackUser?.password_changed ?? true;

  if (!token || !beneficiaryId || !beneficiaryNo || !name) {
    throw new Error('ReliefTrack did not return a complete beneficiary account. Please contact your Barangay Administrator.');
  }

  return {
    token,
    beneficiaryId,
    beneficiaryNo,
    passwordChanged,
    user: {
      id: account.id || fallbackUser?.id,
      name,
    },
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      let savedSession;
      try {
        savedSession = await getSavedSession();
      } catch {
        savedSession = null;
      }

      if (!savedSession?.token) {
        if (isMounted) setIsRestoringSession(false);
        return;
      }

      try {
        const account = await getAuthenticatedUser(savedSession.token);
        const restoredSession = makeSession(
          savedSession.token,
          account,
          savedSession.user,
          savedSession.beneficiaryNo
        );
        if (isMounted) setSession(restoredSession);
        await saveSession(restoredSession);
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          await clearSavedSession().catch(() => {});
        } else if (savedSession.beneficiaryId && savedSession.beneficiaryNo && savedSession.user?.name && isMounted) {
          setSession(savedSession);
        }
      } finally {
        if (isMounted) setIsRestoringSession(false);
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async ({ beneficiaryNo, password }) => {
    const result = await loginBeneficiary({ beneficiaryNo, password });
    const token = result?.token;
    let nextSession;
    try {
      const account = token ? await getAuthenticatedUser(token) : null;
      nextSession = makeSession(token, account, result?.user, beneficiaryNo.trim().toUpperCase());
    } catch (error) {
      if (token) await logoutBeneficiary(token).catch(() => {});
      throw error;
    }

    setSession(nextSession);
    setStorageWarning(false);
    try {
      await saveSession(nextSession);
    } catch {
      setStorageWarning(true);
    }
  }, []);

  const updatePassword = useCallback(async ({ currentPassword, newPassword }) => {
    if (!session?.token) {
      throw new Error('You must be signed in to change your password.');
    }

    await changePassword(session.token, currentPassword, newPassword);

    setSession((current) => ({
      ...current,
      passwordChanged: true,
    }));

    try {
      await saveSession({ ...session, passwordChanged: true });
    } catch {
      setStorageWarning(true);
    }
  }, [session]);

  const signOut = useCallback(async () => {
    const currentSession = session;
    setSession(null);
    setStorageWarning(false);
    await clearSavedSession().catch(() => {});
    if (currentSession?.token) {
      await logoutBeneficiary(currentSession.token).catch(() => {});
    }
  }, [session]);

  const updateSessionUser = useCallback(async (updates) => {
    setSession((current) => {
      if (!current) return current;
      const nextSession = {
        ...current,
        user: {
          ...current.user,
          ...updates,
        },
      };
      saveSession(nextSession).catch(() => {});
      return nextSession;
    });
  }, []);

  const value = useMemo(() => ({
    session,
    isRestoringSession,
    storageWarning,
    signIn,
    signOut,
    updateSessionUser,
    updatePassword,
  }), [session, isRestoringSession, storageWarning, signIn, signOut, updateSessionUser, updatePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return value;
}
