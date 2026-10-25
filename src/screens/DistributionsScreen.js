import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MemberLayout from '../components/MemberLayout';
import { PageHeading, PendingAssignmentNotice } from '../components/MemberComponents';
import { DistributionCard } from '../components/RecordCards';
import { EmptyState, ErrorState, LoadingState } from '../components/ScreenState';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import colors from '../styles/colors';

export default function DistributionsScreen() {
  const { data, loading, refreshing, errors, refresh } = useBeneficiaryData();
  const distributions = data.distributions;
  const isLoading = loading.distributions;
  const isRefreshing = refreshing.distributions;
  const error = errors.distributions;
  const pendingAssignments = distributions?.filter((item) => item.status === 'Pending') ?? [];

  return (
    <MemberLayout onRefresh={() => refresh('distributions')} refreshing={isRefreshing}>
      <PageHeading
        title="My relief history"
        subtitle="See packages assigned to you and your completed relief history."
      />

      <PendingAssignmentNotice assignments={pendingAssignments} />
      {error ? <ErrorState message={error} onRetry={() => refresh('distributions')} /> : null}
      {isLoading && !distributions ? <LoadingState message="Loading your distribution history…" /> : null}

      {distributions?.length ? (
        <>
          <View style={styles.countCard}>
            <View style={styles.countBadge}>
              <Text style={styles.countValue}>{distributions.length}</Text>
            </View>
            <View style={styles.countTextWrap}>
              <Text style={styles.countLabel}>
                {distributions.length === 1 ? '1 Relief distribution record' : `${distributions.length} Relief distribution records`}
              </Text>
              <Text style={styles.countSublabel}>
                Pending assignments stay here until staff scans your QR code at pickup.
              </Text>
            </View>
          </View>
          {distributions.map((item) => (
            <DistributionCard key={item.id} distribution={item} />
          ))}
        </>
      ) : null}

      {distributions && distributions.length === 0 ? (
        <EmptyState
          title="No distributions recorded yet"
          message="Packages assigned to you will appear here as pending. Staff will mark them released when you collect them."
        />
      ) : null}
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  countCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 0,
    flexDirection: 'row',
    padding: 20,
    marginBottom: 20,
    gap: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  countBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.reliefTint,
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countValue: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '700',
  },
  countTextWrap: {
    flex: 1,
  },
  countLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  countSublabel: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
