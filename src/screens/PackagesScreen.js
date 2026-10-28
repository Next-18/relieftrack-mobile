import React from 'react';
import { StyleSheet, Text } from 'react-native';
import MemberLayout from '../components/MemberLayout';
import { PageHeading } from '../components/MemberComponents';
import { PackageCard } from '../components/RecordCards';
import { EmptyState, ErrorState, LoadingState } from '../components/ScreenState';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import colors from '../styles/colors';

export default function PackagesScreen() {
  const { data, loading, refreshing, errors, refresh } = useBeneficiaryData();
  const packages = data.packages;
  const isLoading = loading.packages;
  const isRefreshing = refreshing.packages;
  const error = errors.packages;

  return (
    <MemberLayout onRefresh={() => refresh('packages')} refreshing={isRefreshing}>
      <PageHeading
        title="Relief packages"
        subtitle="See the packages your Barangay has prepared."
      />

      {errors.distributions ? (
        <ErrorState message={errors.distributions} onRetry={() => refresh('distributions')} />
      ) : null}
      {!errors.distributions && error ? <ErrorState message={error} onRetry={() => refresh('packages')} /> : null}
      {!errors.distributions && (isLoading || loading.distributions) && !packages ? (
        <LoadingState message="Loading available packages…" />
      ) : null}

      {!errors.distributions && packages?.length ? packages.map((item) => (
        <PackageCard key={item.id} packageItem={item} />
      )) : null}

      {!errors.distributions && packages && packages.length === 0 ? (
        <EmptyState
          title="No packages currently available"
          message="Check back soon or contact your Barangay Administrator for the upcoming relief distribution schedule."
        />
      ) : null}

      <Text style={styles.help}>
        Assigned packages appear under My Relief. At pickup, show your QR code to staff using the center QR button.
      </Text>
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  help: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
});
