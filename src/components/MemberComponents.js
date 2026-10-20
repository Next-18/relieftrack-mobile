import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../styles/colors';

export function PageHeading({ title, subtitle }) {
  return (
    <View style={styles.pageHeading}>
      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionHeading({ title, trailing }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {trailing}
    </View>
  );
}

export function StatusPill({ status }) {
  const normalizedStatus = String(status || 'Unknown').toLowerCase();
  const isPositive = ['released', 'active', 'available'].includes(normalizedStatus);
  const isPending = normalizedStatus === 'pending';

  return (
    <View style={[
      styles.statusPill,
      isPositive && styles.positivePill,
      isPending && styles.pendingPill,
      !isPositive && !isPending && styles.neutralPill,
    ]}>
      <View style={[
        styles.dot,
        isPositive && styles.dotPositive,
        isPending && styles.dotPending,
        !isPositive && !isPending && styles.dotNeutral,
      ]} />
      <Text style={[
        styles.statusText,
        isPositive && styles.positiveText,
        isPending && styles.pendingText,
        !isPositive && !isPending && styles.neutralText,
      ]}>
        {status || 'Unknown'}
      </Text>
    </View>
  );
}

export function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>{value || 'Not provided'}</Text>
    </View>
  );
}

export function formatDate(value) {
  if (!value) return 'Date unavailable';
  const datePart = String(value).slice(0, 10);
  const date = new Date(datePart + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return datePart;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const styles = StyleSheet.create({
  pageHeading: {
    marginBottom: 24,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  pageSubtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 36,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotPositive: {
    backgroundColor: colors.accent,
  },
  dotPending: {
    backgroundColor: colors.progress,
  },
  dotNeutral: {
    backgroundColor: colors.muted,
  },
  positivePill: {
    backgroundColor: colors.reliefTint,
  },
  pendingPill: {
    backgroundColor: colors.warningBackground,
  },
  neutralPill: {
    backgroundColor: colors.dirtyWhiteDarker,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  positiveText: {
    color: colors.accent,
  },
  pendingText: {
    color: colors.progress,
  },
  neutralText: {
    color: colors.muted,
  },
  detailRow: {
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
});
