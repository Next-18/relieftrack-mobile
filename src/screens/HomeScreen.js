import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const { data, loading, refreshing, errors, refresh, markNotificationRead } = useBeneficiaryData();

  const name = (session.user.name ?? '').trim().split(/\s+/)[0] || 'there';
  const { profile, distributions, packages, notifications } = data;
  const releasedCount = distributions?.filter((item) => item.status === 'Released').length;
  const pendingAssignments = distributions?.filter((item) => item.status === 'Assigned') || [];

  return (
    <MemberLayout
      onRefresh={() => refresh()}
      refreshing={refreshing.profile || refreshing.distributions || refreshing.packages || refreshing.notifications}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {name}</Text>
          <Text style={styles.beneficiaryId}>{session.beneficiaryNo}</Text>
        </View>
        {profile?.status ? <StatusPill status={profile.status} /> : null}
      </View>

      {/* Yellow Info Card */}
      {pendingAssignments.length > 0 && (
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>!</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>A relief package is assigned to you</Text>
              <Text style={styles.infoCardText}>
                {pendingAssignments[0].relief_package?.package_name || 'Relief package'} · Pending pickup
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.qrButton}>
            <Text style={styles.qrButtonText}>Show pickup QR code</Text>
          </TouchableOpacity>
        </View>
      )}

      {errors.profile ? <ErrorState message={errors.profile} onRetry={() => refresh('profile')} /> : null}
      {loading.profile && !profile ? <LoadingState message="Loading your relief updates…" /> : null}
      <View style={styles.announcementWrapper}>
        <AnnouncementSection
          notifications={notifications || []}
          onMarkRead={markNotificationRead}
        />
      </View>

      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../../assets/package-received-icon.png')}
              style={styles.statIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{releasedCount ?? '0'}</Text>
            <Text style={styles.statLabel}>Packages received</Text>
          </View>
        </View>

        <Link href="/packages" asChild>
          <Pressable style={styles.statCard}>
            <View style={styles.iconWrapper}>
              <Image
                source={require('../../assets/package-listed-icon.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{packages?.length ?? '0'}</Text>
              <Text style={styles.statLabel}>Packages listed</Text>
              <Text style={styles.statSublabel}>Available now</Text>
            </View>
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
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  announcementWrapper: {
    marginBottom: 16,
  },
  welcomeText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  beneficiaryId: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '400',
  },
  infoCard: {
    backgroundColor: colors.warningBackground,
    borderColor: '#FCD34D',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },
  infoCardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: '#FDE68A',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  infoIconText: {
    color: '#92400E',
    fontSize: 18,
    fontWeight: '700',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoCardText: {
    color: '#B45309',
    fontSize: 12,
    lineHeight: 16,
  },
  qrButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  qrButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    width: 56,
    height: 56,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '400',
  },
  statSublabel: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '500',
  },
  sectionLinkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
});
