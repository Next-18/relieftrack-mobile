import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import colors from '../styles/colors';

export function LoadingState({ message = 'Loading your information…' }) {
  return (
    <View style={styles.centered}>
      <View style={styles.spinnerWrap}>
        <ActivityIndicator color={colors.primary} size="small" />
      </View>
      <Text style={styles.loadingMessage}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.stateCard}>
      <Text style={styles.warningIcon}>⚠️</Text>
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
    gap: 12,
  },
  spinnerWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  loadingMessage: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  stateCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    marginBottom: 14,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyCard: {
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 28,
  },
  emptyIcon: {
    fontSize: 26,
    marginBottom: 10,
    lineHeight: 30,
  },
  iconCircleWarning: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.warningBackground,
    borderColor: '#fed7aa',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 26,
    marginBottom: 10,
    lineHeight: 30,
    textAlign: 'center',
  },
  stateTitle: {
    color: colors.darkBlue,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 290,
  },
  buttonWrap: {
    width: '100%',
    marginTop: 8,
  },
});
