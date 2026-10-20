import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

export default function ChangePasswordRoute() {
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    await updatePassword({ currentPassword, newPassword });
    router.replace('/(tabs)');
  };

  return <ChangePasswordScreen onChangePassword={handleChangePassword} />;
}
