import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MemberLayout from '../components/MemberLayout';
import { PageHeading } from '../components/MemberComponents';
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

  return (
    <MemberLayout onRefresh={() => refresh('distributions')} refreshing={isRefreshing}>
      <PageHeading
        title="My relief history"
        subtitle="Complete distribution records logged for your beneficiary account."
      />

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
                Verified and distributed by your Barangay Relief staff.
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
          message="ReliefTrack will automatically log each package here once released by your Barangay Administrator."
        />
      ) : null}
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  countCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    gap: 14,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  countBadge: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.reliefTint,
    borderColor: '#ccecd6',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  countTextWrap: {
    flex: 1,
  },
  countLabel: {
    color: colors.darkBlue,
    fontSize: 14.5,
    fontWeight: '700',
  },
  countSublabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});
