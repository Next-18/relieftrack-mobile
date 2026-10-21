import Constants from 'expo-constants';
import { Platform } from 'react-native';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const defaultHost = expoHost || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const API_BASE_URL = (configuredApiUrl || 'http://' + defaultHost + ':8000/api').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function sendRequest(path, { token, ...options } = {}, fallbackMessage = 'Something went wrong. Please try again.') {
  if (!configuredApiUrl && !__DEV__) {
    throw new ApiError('The ReliefTrack server address has not been configured for this app.');
  }

  const headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  let response;
  try {
    response = await fetch(API_BASE_URL + path, { ...options, headers });
  } catch {
    throw new ApiError('Could not connect to ReliefTrack. Check your internet connection and try again.');
  }

  const responseText = await response.text().catch(() => '');
  let result = {};
  try {
    result = responseText ? JSON.parse(responseText) : {};
  } catch {
    result = {};
  }

  if (!response.ok) {
    const validationMessages = Object.values(result.errors || {}).flat();
    const firstValidationMessage = validationMessages.find((message) => typeof message === 'string');
    throw new ApiError(firstValidationMessage || result.message || fallbackMessage, response.status);
  }

  return result;
}

function unwrapRecord(result) {
  let record = result?.data ?? result;
  if (record && !Array.isArray(record) && record.data && !Array.isArray(record.data)) {
    record = record.data;
  }
  return record;
}

function unwrapCollection(result) {
  let collection = result?.data ?? result;
  while (collection && !Array.isArray(collection) && collection.data) {
    collection = collection.data;
  }
  return Array.isArray(collection) ? collection : [];
}

export async function loginBeneficiary({ beneficiaryNo, password }) {
  const result = await sendRequest(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({
        beneficiary_no: beneficiaryNo.trim().toUpperCase(),
        password,
      }),
    },
    'Sign-in failed. Check your beneficiary number and password.'
  );

  return result.data;
}

export async function getAuthenticatedUser(token) {
  const result = await sendRequest(
    '/user',
    { token },
    'Your sign-in has expired. Please sign in again.'
  );

  return result.user || result.data?.user || result.data || result;
}

export async function getBeneficiaryProfile(token, beneficiaryId) {
  const result = await sendRequest(
    '/beneficiaries/' + encodeURIComponent(beneficiaryId),
    { token },
    'Your beneficiary profile could not be loaded.'
  );

  return unwrapRecord(result);
}

export async function updateBeneficiaryProfile(token, beneficiaryId, payload) {
  const result = await sendRequest(
    '/beneficiaries/' + encodeURIComponent(beneficiaryId),
    {
      method: 'PUT',
      token,
      body: JSON.stringify(payload),
    },
    'Your beneficiary profile could not be updated.'
  );

  return unwrapRecord(result);
}

export async function getBeneficiaryDistributions(token, beneficiaryId) {
  const result = await sendRequest(
    '/distributions/beneficiary/' + encodeURIComponent(beneficiaryId),
    { token },
    'Your relief distribution history could not be loaded.'
  );

  return unwrapCollection(result);
}

export async function getAvailablePackages(token) {
  const result = await sendRequest(
    '/packages/available',
    { token },
    'Available relief packages could not be loaded.'
  );

  return unwrapCollection(result);
}

export async function recordDistribution(token, payload) {
  const result = await sendRequest(
    '/distributions',
    {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    },
    'The distribution could not be recorded. Please try again.'
  );

  return unwrapRecord(result);
}

export async function logoutBeneficiary(token) {
  return sendRequest(
    '/auth/logout',
    {
      method: 'POST',
      token,
    },
    'Sign-out could not be completed.'
  );
}

export async function changePassword(token, currentPassword, newPassword) {
  return sendRequest(
    '/auth/change-password',
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword,
      }),
    },
    'Password could not be changed.'
  );
}
