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
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  spinnerWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  loadingMessage: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '400',
  },
  stateCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 0,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyCard: {
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 24,
  },
  emptyIcon: {
    fontSize: 22,
    marginBottom: 8,
    lineHeight: 26,
  },
  iconCircleWarning: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.warningBackground,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 290,
  },
  buttonWrap: {
    width: '100%',
    marginTop: 12,
  },
});
