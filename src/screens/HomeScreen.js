import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/ScreenState';
import MemberLayout from '../components/MemberLayout';
import { AnnouncementSection, SectionHeading } from '../components/MemberComponents';
import { DistributionCard } from '../components/RecordCards';
import colors from '../styles/colors';

export default function HomeScreen() {
  const { session } = useAuth();
  const { data, loading, refreshing, errors, refresh, markNotificationRead } = useBeneficiaryData();

  const barangayName = session.user.name || 'Barangay';
  const { profile, distributions, packages, notifications } = data;
  const releasedCount = distributions?.filter((item) => item.status === 'Released').length;
  const pendingAssignments = distributions?.filter((item) => item.status === 'Assigned') || [];

  return (
    <MemberLayout
      onRefresh={() => refresh()}
      refreshing={refreshing.profile || refreshing.distributions || refreshing.packages || refreshing.notifications}
    >
      <LinearGradient
        colors={[colors.blueLight, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.welcomeBanner}
      >
        <Image
          source={require('../../assets/welcome-banner.png')}
          style={styles.welcomeImage}
          resizeMode="cover"
        />
        <View style={styles.welcomeCopy}>
          <Text style={styles.welcomeText}>Welcome, {barangayName}!</Text>
          <Text style={styles.beneficiaryId}>Track your relief packages and pickup status</Text>
        </View>
      </LinearGradient>

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
  welcomeBanner: {
    borderRadius: 16,
    marginBottom: 16,
    minHeight: 124,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  welcomeCopy: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 16,
    gap: 6,
    zIndex: 1,
    maxWidth: '70%',
  },
  announcementWrapper: {
    marginBottom: 16,
  },
  welcomeText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  beneficiaryId: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  infoCard: {
    backgroundColor: colors.warningBackground,
    borderColor: colors.warningBorder,
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
    backgroundColor: colors.warningBorder,
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  infoIconText: {
    color: colors.warningText,
    fontSize: 18,
    fontWeight: '700',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    color: colors.warningText,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoCardText: {
    color: colors.warningText,
    fontSize: 12,
    lineHeight: 16,
  },
  qrButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  qrButtonText: {
    color: colors.white,
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
    shadowColor: colors.shadow,
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
    color: colors.blue,
    fontSize: 13,
    fontWeight: '500',
  },
});
