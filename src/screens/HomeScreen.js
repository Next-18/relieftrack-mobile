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
            <Text style={styles.idPassNotice}>✓ Official Barangay Credential</Text>
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
    backgroundColor: colors.dirtyWhiteDarker,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.reliefTint,
    borderColor: '#ccecd6',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  heroTitle: {
    color: colors.darkBlue,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  heroText: {
    color: colors.muted,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 5,
  },
  idPassCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  idPassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  idPassLabel: {
    color: colors.label,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  idPassNumber: {
    color: colors.darkBlue,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  idPassFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  idPassNotice: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  statCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    padding: 16,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBadgeGreen: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.reliefTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIconBadgeNeutral: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.dirtyWhiteDarker,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIconText: {
    fontSize: 13,
  },
  statValue: {
    color: colors.darkBlue,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
  qrCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    marginTop: 14,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  qrHeader: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 18,
  },
  qrTag: {
    color: colors.primary,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  qrTitle: {
    color: colors.darkBlue,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  qrText: {
    color: colors.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 5,
    textAlign: 'center',
    maxWidth: 290,
  },
  qrFrame: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  qrNumber: {
    color: colors.darkBlue,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 14,
  },
  qrHelper: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  qrNotice: {
    backgroundColor: colors.dirtyWhiteDarker,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
  },
  qrNoticeTitle: {
    color: colors.darkBlue,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  qrNoticeText: {
    color: colors.muted,
    fontSize: 12.5,
    lineHeight: 18,
  },
  pillLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  pillLinkText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  packageSummary: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 14,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  packageSummaryBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.reliefTint,
    borderColor: '#ccecd6',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageSummaryValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  packageSummaryTextWrap: {
    flex: 1,
  },
  packageSummaryHeading: {
    color: colors.darkBlue,
    fontSize: 14.5,
    fontWeight: '700',
  },
  packageSummaryText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
});
