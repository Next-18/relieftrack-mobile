import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
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
  const [showAlert, setShowAlert] = useState(false);
  const { data, loading, errors, refresh } = useBeneficiaryData();
  const profile = data.profile;
  const accountName = session?.user?.name || 'Beneficiary';
  const beneficiaryNo = session?.beneficiaryNo || '';
  const isLoading = loading.profile;
  const error = errors.profile;

  const handleSignOut = async () => {
    setShowAlert(true);
  };

  const confirmSignOut = async () => {
    setShowAlert(false);
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <MemberLayout onRefresh={() => refresh('profile')}>
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
                  {(profile.full_name || accountName || 'B').trim()[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.nameCopy}>
                <Text style={styles.name}>{profile.full_name || accountName}</Text>
                <Text selectable style={styles.number}>{profile.beneficiary_no || beneficiaryNo}</Text>
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
              title="Sign out"
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

      <Modal
        transparent
        visible={showAlert}
        animationType="fade"
        onRequestClose={() => setShowAlert(false)}
      >
        <Pressable style={styles.alertBackdrop} onPress={() => setShowAlert(false)}>
          <Pressable style={styles.alertContainer} onPress={() => {}}>
            <Text style={styles.alertTitle}>Sign out</Text>
            <Text style={styles.alertMessage}>Are you sure you want to sign out?</Text>
            <View style={styles.alertButtonContainer}>
              <TouchableOpacity
                style={[styles.alertButton, styles.alertButtonCancel]}
                onPress={() => setShowAlert(false)}
              >
                <Text style={styles.alertButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertButton, styles.alertButtonConfirm]}
                onPress={confirmSignOut}
              >
                <Text style={styles.alertButtonText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.reliefTint,
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  nameCopy: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  number: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.3,
    marginTop: 3,
  },
  details: {
    marginTop: 12,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuRowTextWrap: {
    flex: 1,
  },
  menuRowTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '400',
  },
  menuRowTitleDestructive: {
    color: colors.error,
  },
  menuRowSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  menuRowChevron: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: '300',
    marginLeft: 10,
  },
  menuDivider: {
    backgroundColor: colors.divider,
    height: 1,
    marginLeft: 14,
  },
  warning: {
    backgroundColor: colors.warningBackground,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  warningTitle: {
    color: colors.progress,
    fontSize: 13,
    fontWeight: '400',
  },
  warningText: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  help: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  alertBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  alertTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  alertMessage: {
    color: colors.text,
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  alertButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  alertButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertButtonCancel: {
    backgroundColor: colors.muted,
  },
  alertButtonConfirm: {
    backgroundColor: colors.error,
  },
  alertButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
