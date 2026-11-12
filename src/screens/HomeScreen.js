import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
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

function SeeAllLink({ href }) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="See all"
        style={styles.seeAllPressable}
        hitSlop={8}
      >
        <Text style={styles.seeAllText}>See all</Text>
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#1868A0" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M9 18l6-6-6-6" />
        </Svg>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  const { session } = useAuth();
  const { data, loading, refreshing, errors, refresh, markNotificationRead } = useBeneficiaryData();

  const { profile, distributions, packages, updates } = data;
  const displayName = profile?.full_name || session?.user?.name || session?.user?.full_name || 'Beneficiary';
  const releasedCount = distributions?.filter((item) => item.status === 'Released').length;

  return (
    <MemberLayout
      onRefresh={() => refresh()}
      refreshing={refreshing.profile || refreshing.distributions || refreshing.packages || refreshing.notifications || refreshing.announcements}
    >
      {/* ── Welcome Banner Card ── */}
      <View style={styles.welcomeCard}>
        <Image
          source={require('../../assets/welcome-banner.png')}
          style={styles.welcomeBannerImage}
          resizeMode="cover"
        />
        {/* Soft horizontal gradient scrim to guarantee crystal-clear text readability */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.94)', 'rgba(255, 255, 255, 0.72)', 'rgba(255, 255, 255, 0)']}
          locations={[0, 0.45, 0.75]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.welcomeScrim}
          pointerEvents="none"
        />
        {/* Dynamic user greeting */}
        <View style={styles.welcomeCopy}>
          <Text style={styles.welcomeGreetingLine1}>Welcome,</Text>
          <Text numberOfLines={2} style={styles.welcomeGreetingLine2}>
            {displayName}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {'Track your relief packages and\npickup status.'}
          </Text>
          <View style={styles.welcomeAccentBar} />
        </View>
      </View>

      {errors.profile ? <ErrorState message={errors.profile} onRetry={() => refresh('profile')} /> : null}
      {loading.profile && !profile ? <LoadingState message="Loading your relief updates…" /> : null}

      {/* ── Announcements Section ── */}
      <View style={styles.sectionBlock}>
        <AnnouncementSection
          notifications={updates || []}
          onMarkRead={markNotificationRead}
          trailing={<SeeAllLink href="/notifications" />}
        />
      </View>

      {/* ── Stat Cards (Side-by-side) ── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          {/* Subtle pale green background flourish */}
          <View style={styles.statBgTint} />
          <Image
            source={require('../../assets/package-received-icon.png')}
            style={styles.statIcon}
            resizeMode="contain"
          />
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{releasedCount ?? '0'}</Text>
            <Text style={styles.statLabel}>{'Packages\nreceived'}</Text>
          </View>
        </View>

        <Link href="/packages" asChild>
          <Pressable style={styles.statCard}>
            {/* Subtle pale green background flourish */}
            <View style={styles.statBgTint} />
            <Image
              source={require('../../assets/package-listed-icon.png')}
              style={styles.statIcon}
              resizeMode="contain"
            />
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{packages?.length ?? '0'}</Text>
              <Text style={styles.statLabel}>{'Packages\nlisted'}</Text>
              <Text style={styles.statBadge}>Available now</Text>
            </View>
          </Pressable>
        </Link>
      </View>

      {/* ── Recent Relief Distributions Section ── */}
      <View style={styles.sectionBlock}>
        <SectionHeading
          title="Recent relief distributions"
          icon="history"
          trailing={<SeeAllLink href="/distributions" />}
        />

        {loading.distributions && !distributions ? (
          <LoadingState message="Loading relief history…" />
        ) : errors.distributions ? (
          <ErrorState message={errors.distributions} onRetry={() => refresh('distributions')} />
        ) : distributions?.length ? (
          <View style={styles.distributionsCard}>
            {distributions.slice(0, 3).map((item, index) => (
              <View key={item.id}>
                <DistributionCard distribution={item} compact />
                {index < Math.min(distributions.length, 3) - 1 ? (
                  <View style={styles.cardDivider} />
                ) : null}
              </View>
            ))}
          </View>
        ) : distributions ? (
          <EmptyState
            title="No distributions recorded yet"
            message="When an authorized relief package is released to you, it will appear here."
          />
        ) : null}
      </View>
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: '#C8E5F8',
    borderRadius: 20,
    height: 168,
    marginBottom: 14,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  welcomeBannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  welcomeScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '65%',
    zIndex: 1,
  },
  welcomeCopy: {
    position: 'absolute',
    top: 18,
    left: 18,
    maxWidth: '50%',
    zIndex: 2,
  },
  welcomeGreetingLine1: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  welcomeGreetingLine2: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  welcomeSubtitle: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginTop: 6,
  },
  welcomeAccentBar: {
    width: 32,
    height: 4,
    backgroundColor: '#16A34A',
    borderRadius: 2,
    marginTop: 8,
  },
  sectionBlock: {
    marginBottom: 12,
  },
  seeAllPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  seeAllText: {
    color: '#1868A0',
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statBgTint: {
    position: 'absolute',
    bottom: -16,
    left: -16,
    right: -16,
    height: 48,
    backgroundColor: '#ECFDF5',
    opacity: 0.8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  statIcon: {
    width: 44,
    height: 44,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    marginTop: 1,
  },
  statBadge: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  distributionsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
