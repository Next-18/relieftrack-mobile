import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/ScreenState';
import MemberLayout from '../components/MemberLayout';
import { AnnouncementSection, SectionHeading, StatusPill } from '../components/MemberComponents';
import { DistributionCard } from '../components/RecordCards';
import colors from '../styles/colors';

export default function HomeScreen() {
  const { session } = useAuth();
  const { data, loading, refreshing, errors, refresh, markNotificationRead, announcementsExpanded, toggleAnnouncementsExpanded } = useBeneficiaryData();

  const name = (session.user.name ?? '').trim().split(/\s+/)[0] || 'there';
  const { profile, distributions, packages, notifications } = data;
  const releasedCount = distributions?.filter((item) => item.status === 'Released').length;

  return (
    <MemberLayout
      onRefresh={() => refresh()}
      refreshing={refreshing.profile || refreshing.distributions || refreshing.packages || refreshing.notifications}
    >
      {/* Aesthetic Hero Banner */}
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Welcome, {name}</Text>
          <Text style={styles.idPassNumber}>{session.beneficiaryNo}</Text>
        </View>
        {profile?.status ? <StatusPill status={profile.status} /> : null}
      </View>

      {errors.profile ? <ErrorState message={errors.profile} onRetry={() => refresh('profile')} /> : null}
      {loading.profile && !profile ? <LoadingState message="Loading your relief updates…" /> : null}
      <AnnouncementSection
        notifications={notifications || []}
        onMarkRead={markNotificationRead}
        expanded={announcementsExpanded}
        onToggleExpanded={toggleAnnouncementsExpanded}
      />

      {/* Metric Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{releasedCount ?? '0'}</Text>
          <Text style={styles.statLabel}>Packages received</Text>
        </View>

        <Link href="/packages" asChild>
          <Pressable style={styles.statCard}>
            <Text style={styles.statValue}>{packages?.length ?? '0'}</Text>
            <Text style={styles.statLabel}>Packages listed</Text>
          </Pressable>
        </Link>
      </View>

      {/* Recent Distributions Section */}
      <SectionHeading
        title="Recent relief distributions"
        trailing={
          <Link href="/distributions" asChild>
            <Pressable>
              <Text style={styles.sectionLinkText}>See all</Text>
            </Pressable>
          </Link>
        }
      />

      {loading.distributions && !distributions ? (
        <LoadingState message="Loading relief history…" />
      ) : errors.distributions ? (
        <ErrorState message={errors.distributions} onRetry={() => refresh('distributions')} />
      ) : distributions?.length ? (
        distributions.slice(0, 3).map((item) => (
          <DistributionCard key={item.id} distribution={item} compact />
        ))
      ) : distributions ? (
        <EmptyState
          title="No distributions recorded yet"
          message="When an authorized relief package is released to you, it will appear here."
        />
      ) : null}
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  heroCopy: {
    flex: 1,
    gap: 3,
  },
  heroTitle: {
    color: colors.darkBlue,
    fontSize: 18,
    fontWeight: '700',
  },
  idPassNumber: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    padding: 12,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
  },
  sectionLinkText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '400',
  },
});
