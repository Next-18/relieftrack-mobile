import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
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

function ClockIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </Svg>
  );
}

function GridIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="3" width="7" height="7" rx="1" />
      <Rect x="14" y="3" width="7" height="7" rx="1" />
      <Rect x="3" y="14" width="7" height="7" rx="1" />
      <Rect x="14" y="14" width="7" height="7" rx="1" />
    </Svg>
  );
}

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

      <>
        {/* Metric Stat Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{releasedCount ?? '0'}</Text>
            <Text style={styles.statLabel}>Packages received</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{packages?.length ?? '0'}</Text>
            <Text style={styles.statLabel}>Packages listed</Text>
          </View>
        </View>

        {/* Recent Distributions Section */}
        <SectionHeading
          title="Recent relief distributions"
          trailing={
            <Link href="/distributions" asChild>
              <Pressable style={styles.sectionLinkPill}>
                <ClockIcon />
                <Text style={styles.sectionLinkText}>History</Text>
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

        {/* Available Packages Section */}
        <SectionHeading
          title="Available relief packages"
          trailing={
            <Link href="/packages" asChild>
              <Pressable style={styles.sectionLinkPill}>
                <GridIcon />
                <Text style={styles.sectionLinkText}>Browse all</Text>
              </Pressable>
            </Link>
          }
        />
        {errors.distributions ? (
          <ErrorState message={errors.distributions} onRetry={() => refresh('distributions')} />
        ) : loading.distributions || loading.packages ? (
          <LoadingState message="Loading available packages…" />
        ) : errors.packages ? (
          <ErrorState message={errors.packages} onRetry={() => refresh('packages')} />
        ) : packages?.length ? (
          <View style={styles.packageSummary}>
            <View style={styles.packageSummaryBadge}>
              <Text style={styles.packageSummaryValue}>{packages.length}</Text>
            </View>
            <View style={styles.packageSummaryTextWrap}>
              <Text style={styles.packageSummaryHeading}>
                {packages.length === 1 ? '1 Relief package available' : `${packages.length} Relief packages available`}
              </Text>
              <Text style={styles.packageSummaryText}>
                Active aid packages currently marked ready by your Barangay Administrator.
              </Text>
            </View>
          </View>
        ) : packages ? (
          <EmptyState
            title="No active packages listed"
            message="Relief packages will appear here once scheduled by your Barangay Administrator."
          />
        ) : null}
      </>
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: colors.darkBlue,
    fontSize: 22,
    fontWeight: '700',
  },
  idPassNumber: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 0,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBadgeGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.reliefTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconBadgeNeutral: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 14,
  },
  statValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '400',
    flex: 1,
  },
  sectionLinkPill: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionLinkText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '400',
  },
  packageSummary: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  packageSummaryBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.reliefTint,
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageSummaryValue: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '700',
  },
  packageSummaryTextWrap: {
    flex: 1,
  },
  packageSummaryHeading: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '400',
  },
  packageSummaryText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
});
