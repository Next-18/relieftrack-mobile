import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_SESSION_KEY = 'relieftrack.auth.session';
const REMEMBERED_BENEFICIARY_KEY = 'relieftrack.auth.remembered_beneficiary';

export async function getSavedSession() {
  const value = Platform.OS === 'web'
    ? globalThis.localStorage?.getItem(AUTH_SESSION_KEY) ?? null
    : await SecureStore.getItemAsync(AUTH_SESSION_KEY);
  return value ? JSON.parse(value) : null;
}

export async function saveSession(session) {
  const value = JSON.stringify(session);
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(AUTH_SESSION_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(AUTH_SESSION_KEY, value);
}

export async function clearSavedSession() {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(AUTH_SESSION_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
}

export async function getRememberedBeneficiary() {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(REMEMBERED_BENEFICIARY_KEY) ?? null;
  }
  return await SecureStore.getItemAsync(REMEMBERED_BENEFICIARY_KEY);
}

export async function saveRememberedBeneficiary(beneficiaryNo) {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(REMEMBERED_BENEFICIARY_KEY, beneficiaryNo);
    return;
  }
  await SecureStore.setItemAsync(REMEMBERED_BENEFICIARY_KEY, beneficiaryNo);
}

export async function clearRememberedBeneficiary() {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(REMEMBERED_BENEFICIARY_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(REMEMBERED_BENEFICIARY_KEY);
}
