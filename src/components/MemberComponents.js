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
    marginBottom: 16,
  },
  pageTitle: {
    color: colors.darkBlue,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  pageSubtitle: {
    color: colors.muted,
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 4,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.darkBlue,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    gap: 5,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotPositive: {
    backgroundColor: colors.primary,
  },
  dotPending: {
    backgroundColor: colors.warning,
  },
  dotNeutral: {
    backgroundColor: colors.muted,
  },
  positivePill: {
    backgroundColor: colors.successBackground,
    borderColor: '#c6e7d3',
  },
  pendingPill: {
    backgroundColor: colors.warningBackground,
    borderColor: '#fed7aa',
  },
  neutralPill: {
    backgroundColor: colors.dirtyWhiteDarker,
    borderColor: colors.border,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0.1,
  },
  positiveText: {
    color: colors.primary,
  },
  pendingText: {
    color: colors.warning,
  },
  neutralText: {
    color: colors.muted,
  },
  detailRow: {
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
  },
  detailLabel: {
    color: colors.label,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
