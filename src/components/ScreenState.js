import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import colors from '../styles/colors';

export function LoadingState({ message = 'Loading your information…' }) {
  return (
    <View style={styles.centered}>
      <View style={styles.spinnerWrap}>
        <ActivityIndicator color={colors.accent} size="small" />
      </View>
      <Text style={styles.loadingMessage}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.stateCard}>

      <Text style={styles.stateTitle}>We couldn’t load this right now</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <View style={styles.buttonWrap}>
          <PrimaryButton title="Try again" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

export function EmptyState({  title, message }) {
  return (
    <View style={[styles.stateCard, styles.emptyCard]}>
      
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  spinnerWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingMessage: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '400',
  },
  stateCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 0,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyCard: {
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 36,
  },
  emptyIcon: {
    fontSize: 26,
    marginBottom: 10,
    lineHeight: 30,
  },
  iconCircleWarning: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.warningBackground,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 290,
  },
  buttonWrap: {
    width: '100%',
    marginTop: 16,
  },
});
