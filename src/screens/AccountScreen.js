import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import MemberLayout from '../components/MemberLayout';
import { DetailRow, PageHeading, StatusPill } from '../components/MemberComponents';
import { ErrorState, LoadingState } from '../components/ScreenState';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import colors from '../styles/colors';

function MenuRow({ title, subtitle, onPress, destructive = false, disabled = false }) {
  return (
    <TouchableOpacity
      style={styles.menuRow}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View style={styles.menuRowTextWrap}>
        <Text style={[styles.menuRowTitle, destructive && styles.menuRowTitleDestructive]}>{title}</Text>
        {subtitle ? <Text style={styles.menuRowSubtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.menuRowChevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function AccountScreen() {
  const { session, signOut, storageWarning } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data, loading, refreshing, errors, refresh } = useBeneficiaryData();
  const profile = data.profile;
  const isLoading = loading.profile;
  const isRefreshing = refreshing.profile;
  const error = errors.profile;

  useFocusEffect(
    useCallback(() => {
      refresh('profile');
    }, [refresh])
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <MemberLayout onRefresh={() => refresh('profile')} refreshing={isRefreshing}>
      <PageHeading
        title="My account"
        subtitle="Your ReliefTrack beneficiary details."
      />

      {error ? <ErrorState message={error} onRetry={() => refresh('profile')} /> : null}
      {isLoading && !profile ? <LoadingState message="Loading your beneficiary profile…" /> : null}

      {profile ? (
        <>
          <View style={styles.card}>
            <View style={styles.nameRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(profile.full_name || session.user.name || 'B').trim()[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.nameCopy}>
                <Text style={styles.name}>{profile.full_name || session.user.name}</Text>
                <Text selectable style={styles.number}>{profile.beneficiary_no || session.beneficiaryNo}</Text>
              </View>
              <StatusPill status={profile.status} />
            </View>

            <View style={styles.details}>
              <DetailRow label="Address" value={profile.address} />
              <DetailRow label="Contact number" value={profile.contact_number} />
              <DetailRow label="Household size" value={profile.household_size ? `${profile.household_size} members` : null} />
              <DetailRow label="Priority type" value={profile.priority_type} />
            </View>
          </View>

          <View style={styles.menuCard}>
            <MenuRow
              title="Edit profile details"
              subtitle="Name, contact, address, household size"
              onPress={() => router.push('/edit-profile')}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              title="Change password"
              subtitle="Keep your account secure"
              onPress={() => router.push('/update-password')}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              title={isSigningOut ? 'Signing out…' : 'Sign out'}
              onPress={handleSignOut}
              destructive
              disabled={isSigningOut}
            />
          </View>
        </>
      ) : null}

      {storageWarning ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>This device could not save your sign-in</Text>
          <Text style={styles.warningText}>You may need to sign in again after closing ReliefTrack.</Text>
        </View>
      ) : null}

      <Text style={styles.help}>
        Priority type and issuance of QR passes are managed by your Barangay Administrator.
      </Text>
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 0,
    padding: 20,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.reliefTint,
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.accent,
    fontSize: 21,
    fontWeight: '700',
  },
  nameCopy: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  number: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  details: {
    marginTop: 16,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 0,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuRowTextWrap: {
    flex: 1,
  },
  menuRowTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '400',
  },
  menuRowTitleDestructive: {
    color: colors.error,
  },
  menuRowSubtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  menuRowChevron: {
    color: colors.muted,
    fontSize: 22,
    fontWeight: '300',
    marginLeft: 12,
  },
  menuDivider: {
    backgroundColor: colors.divider,
    height: 1,
    marginLeft: 20,
  },
  warning: {
    backgroundColor: colors.warningBackground,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  warningTitle: {
    color: colors.progress,
    fontSize: 15,
    fontWeight: '400',
  },
  warningText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  help: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
});
