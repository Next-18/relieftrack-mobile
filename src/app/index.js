import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function IndexRoute() {
  const { session } = useAuth();
  const destination = !session
    ? '/login'
    : session.passwordChanged
      ? '/(tabs)/home'
      : '/change-password';

  return <Redirect href={destination} />;
}
