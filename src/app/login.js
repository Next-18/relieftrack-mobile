import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';

export default function LoginRoute() {
  const { signIn } = useAuth();
  const params = useLocalSearchParams();
  const beneficiaryNo = typeof params.beneficiaryNo === 'string' ? params.beneficiaryNo : '';

  return <LoginScreen key={beneficiaryNo || 'login'} initialBeneficiaryNo={beneficiaryNo} onLogin={signIn} />;
}
