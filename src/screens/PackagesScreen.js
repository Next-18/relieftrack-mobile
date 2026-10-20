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
        title="Available aid packages"
        subtitle="Explore relief goods and packages currently marked ready by your Barangay."
      />

      <View style={styles.note}>
        <View style={styles.noteContent}>
          <Text style={styles.noteTitle}>Need package or pickup information?</Text>
          <Text style={styles.noteText}>
            Release schedules and eligibility are managed directly by your Barangay Administrator.
          </Text>
        </View>
      </View>

      {error ? <ErrorState message={error} onRetry={() => refresh('packages')} /> : null}
      {isLoading && !packages ? <LoadingState message="Loading available packages…" /> : null}

      {packages?.length ? packages.map((item) => (
        <PackageCard key={item.id} packageItem={item} />
      )) : null}

      {packages && packages.length === 0 ? (
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
    borderRadius: 28,
    borderWidth: 0,
    padding: 24,
    marginBottom: 24,
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
