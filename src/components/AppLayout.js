import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import colors from '../styles/colors';

export default function AppLayout({ children }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>
                <Text style={styles.brandRelief}>Relief</Text>
                <Text style={styles.brandTrack}>Track</Text>
              </Text>
              <Text style={styles.subtitle}>Disaster Relief Inventory Tracker</Text>
            </View>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  headerGradient: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  brandRelief: {
    color: colors.blue,
  },
  brandTrack: {
    color: colors.greenDark,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
});
