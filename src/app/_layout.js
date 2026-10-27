import React from 'react';
import { Stack } from 'expo-router';
import LoadingScreen from '../screens/LoadingScreen';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function RootNavigator() {
  const { session, isRestoringSession } = useAuth();

  if (isRestoringSession) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(session) && !session?.passwordChanged}>
        <Stack.Screen name="change-password" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(session) && session?.passwordChanged}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="update-password" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
