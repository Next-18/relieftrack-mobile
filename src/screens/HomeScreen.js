import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Link } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/ScreenState';
import MemberLayout from '../components/MemberLayout';
import { SectionHeading, StatusPill } from '../components/MemberComponents';
import { DistributionCard } from '../components/RecordCards';
import colors from '../styles/colors';

export default function HomeScreen() {
  const { session } = useAuth();
  const { data, loading, refreshing, errors, refresh } = useBeneficiaryData();

  const name = (session.user.name ?? '').trim().split(/\s+/)[0] || 'there';
  const { profile, distributions, packages } = data;
  const releasedCount = distributions?.filter((item) => item.status === 'Released').length;

  return (
    <MemberLayout
      onRefresh={() => refresh()}
      refreshing={refreshing.profile || refreshing.distributions || refreshing.packages}
    >
      {/* Aesthetic Hero Banner */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>RELIEF PORTAL</Text>
        </View>

        <Text style={styles.heroTitle}>Welcome, {name}</Text>
        <Text style={styles.heroText}>
          Your beneficiary records, pass, and relief updates are synced and ready.
        </Text>

        <View style={styles.idPassCard}>
          <View style={styles.idPassHeader}>
            <Text style={styles.idPassLabel}>BENEFICIARY PASS</Text>
            {profile?.status ? <StatusPill status={profile.status} /> : null}
          </View>
          <Text selectable style={styles.idPassNumber}>{session.beneficiaryNo}</Text>
          <View style={styles.idPassFooter}>
            <Text style={styles.idPassNotice}>Official Barangay Credential</Text>
          </View>
        </View>
      </View>

      {errors.profile ? <ErrorState message={errors.profile} onRetry={() => refresh('profile')} /> : null}
      {loading.profile && !profile ? <LoadingState message="Loading your relief updates…" /> : null}

      <>
        {/* Metric Stat Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{releasedCount ?? '0'}</Text>
            <Text style={styles.statLabel}>Packages received</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{packages?.length ?? '0'}</Text>
            <Text style={styles.statLabel}>Available packages</Text>
          </View>
        </View>

        {/* QR Pass Card */}
        {profile?.qr_code ? (
          <View style={styles.qrCard}>
            <View style={styles.qrHeader}>
              <Text style={styles.qrTag}>DIGITAL QR PASS</Text>
              <Text style={styles.qrTitle}>Official Beneficiary QR</Text>
              <Text style={styles.qrText}>
                Present this code to ReliefTrack staff at distribution checkpoints for swift identity verification.
              </Text>
            </View>
            <View style={styles.qrFrame} accessibilityLabel="Beneficiary QR code">
              <QRCode
                value={profile.beneficiary_no || session.beneficiaryNo}
                size={168}
                color={colors.darkBlue}
                backgroundColor={colors.white}
                ecl="H"
                quietZone={8}
              />
            </View>
            <Text selectable style={styles.qrNumber}>{session.beneficiaryNo}</Text>
            <Text style={styles.qrHelper}>Instant Scan Verification</Text>
          </View>
        ) : profile ? (
          <View style={styles.qrNotice}>
            <Text style={styles.qrNoticeTitle}>QR Pass Pending Issuance</Text>
            <Text style={styles.qrNoticeText}>
              Your Barangay Administrator can issue your official QR pass for expedited identity verification.
            </Text>
          </View>
        ) : null}

        {/* Recent Distributions Section */}
        <SectionHeading
          title="Recent relief distributions"
          trailing={
            <Link href="/distributions" style={styles.pillLink}>
              <Text style={styles.pillLinkText}>View history →</Text>
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
            <Link href="/packages" style={styles.pillLink}>
              <Text style={styles.pillLinkText}>Browse all →</Text>
            </Link>
          }
        />
        {loading.packages && !packages ? (
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
    backgroundColor: colors.primary,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 28,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: colors.darkBlue,
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: colors.darkBlue,
    fontSize: 30,
    fontWeight: '700',
  },
  heroText: {
    color: colors.darkBlue,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
  idPassCard: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 28,
    padding: 24,
    marginTop: 24,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  idPassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  idPassLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '400',
  },
  idPassNumber: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  idPassFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  idPassNotice: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '400',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 28,
    borderWidth: 0,
    flex: 1,
    padding: 24,
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
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
  qrCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 28,
    borderWidth: 0,
    padding: 28,
    marginTop: 24,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  qrHeader: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 24,
  },
  qrTag: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  qrTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  qrText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 290,
  },
  qrFrame: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  qrNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 16,
  },
  qrHelper: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '400',
    marginTop: 4,
  },
  qrNotice: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 28,
    padding: 24,
    marginTop: 24,
  },
  qrNoticeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  qrNoticeText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  pillLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  pillLinkText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  packageSummary: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 28,
    borderWidth: 0,
    flexDirection: 'row',
    padding: 24,
    gap: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  packageSummaryBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.reliefTint,
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageSummaryValue: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '700',
  },
  packageSummaryTextWrap: {
    flex: 1,
  },
  packageSummaryHeading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  packageSummaryText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
