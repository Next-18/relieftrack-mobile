import React from 'react';
import { Stack } from 'expo-router';
import LoadingScreen from '../screens/LoadingScreen';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BeneficiaryDataProvider } from '../contexts/BeneficiaryDataContext';

function RootNavigator() {
  const { session, isRestoringSession } = useAuth();

  if (isRestoringSession) {
    return <LoadingScreen />;
  }

  return (
    <BeneficiaryDataProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={!session}>
          <Stack.Screen name="login" />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(session) && !session.passwordChanged}>
          <Stack.Screen name="change-password" />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(session) && Boolean(session.passwordChanged)}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notifications" options={{ animation: 'none' }} />
          <Stack.Screen name="update-password" options={{ animation: 'none' }} />
          <Stack.Screen name="edit-profile" options={{ animation: 'none' }} />
          <Stack.Screen name="support" options={{ animation: 'none' }} />
        </Stack.Protected>
      </Stack>
    </BeneficiaryDataProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
