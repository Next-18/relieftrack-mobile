import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

export default function ChangePasswordRoute() {
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    await updatePassword({ currentPassword, newPassword });
    // Let the root index choose an available screen after the auth guard updates.
    router.replace('/');
  };

  return <ChangePasswordScreen onChangePassword={handleChangePassword} />;
}
