import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
  const [showQR, setShowQR] = useState(false);

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
        <Text style={styles.heroTitle}>Welcome, {name}</Text>
        <View style={styles.idPassMini}>
          <Text style={styles.idPassNumber}>{session.beneficiaryNo}</Text>
          {profile?.status ? <StatusPill status={profile.status} /> : null}
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

        {/* QR Pass Button */}
        {profile?.qr_code ? (
          <>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => setShowQR(!showQR)}
              accessibilityRole="button"
              accessibilityLabel="View QR code"
            >
              <Text style={styles.qrButtonText}>{showQR ? 'Hide QR code' : 'View QR code'}</Text>
            </TouchableOpacity>

            {showQR && (
              <View style={styles.qrModal}>
                <View style={styles.qrFrame} accessibilityLabel="Beneficiary QR code">
                  <QRCode
                    value={profile.beneficiary_no || session.beneficiaryNo}
                    size={200}
                    color={colors.text}
                    backgroundColor={colors.white}
                    ecl="H"
                    quietZone={8}
                  />
                </View>
                <Text selectable style={styles.qrNumber}>{session.beneficiaryNo}</Text>
                <Text style={styles.qrHelper}>Show this code at distribution checkpoints</Text>
              </View>
            )}
          </>
        ) : null}

        {/* Scan QR Button */}
        <Link href="/scan-qr" style={styles.qrButton} accessibilityRole="button" accessibilityLabel="Scan QR code to record relief">
          <Text style={styles.qrButtonText}>Scan QR to record relief</Text>
        </Link>

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
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTitle: {
    color: colors.darkBlue,
    fontSize: 22,
    fontWeight: '700',
  },
  idPassMini: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  idPassNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 0,
    flex: 1,
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
    marginTop: 4,
  },
  qrButton: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  qrButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  qrModal: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 0,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  qrFrame: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 20,
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
