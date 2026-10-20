import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppHeader from './AppHeader';
import globalStyles from '../styles/globalStyles';

export default function AppLayout({ children }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={globalStyles.container}>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={globalStyles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AppHeader />
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
