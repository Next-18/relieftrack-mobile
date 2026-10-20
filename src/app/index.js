import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function IndexRoute() {
  const { session } = useAuth();
  return <Redirect href={session ? '/(tabs)/home' : '/login'} />;
}
