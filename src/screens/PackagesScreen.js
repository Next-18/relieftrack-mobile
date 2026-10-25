import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

      <View style={styles.note}>
        <View style={styles.noteContent}>
          <Text style={styles.noteTitle}>How to collect a package</Text>
          <Text style={styles.noteText}>
            Your Barangay Administrator assigns packages. Assigned packages appear under My Relief. At pickup, tap the center QR button in the navigation and show the code to staff.
          </Text>
        </View>
      </View>

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
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  note: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 0,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  noteIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.reliefTint,
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  noteIcon: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '400',
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
  },
  noteText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
