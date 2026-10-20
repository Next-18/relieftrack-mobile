import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import MemberLayout from '../components/MemberLayout';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';
import { DetailRow, PageHeading, StatusPill } from '../components/MemberComponents';
import { ErrorState, LoadingState } from '../components/ScreenState';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import { updateBeneficiaryProfile } from '../services/api';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

export default function AccountScreen() {
  const { session, signOut, storageWarning, updateSessionUser } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data, loading, refreshing, errors, refresh, setProfileData } = useBeneficiaryData();
  const profile = data.profile;
  const isLoading = loading.profile;
  const isRefreshing = refreshing.profile;
  const error = errors.profile;

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [householdSize, setHouseholdSize] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const startEditing = () => {
    setSaveError('');
    setSaveSuccess('');
    setFullName(profile?.full_name || session?.user?.name || '');
    setContactNumber(profile?.contact_number || '');
    setAddress(profile?.address || '');
    setHouseholdSize(profile?.household_size ? String(profile.household_size) : '');
    setChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setSaveError('Please enter your full name.');
      return;
    }

    if (householdSize && (isNaN(Number(householdSize)) || Number(householdSize) < 1 || Number(householdSize) > 99)) {
      setSaveError('Household size must be a number between 1 and 99.');
      return;
    }

    if (changePassword) {
      if (!currentPassword) {
        setSaveError('Please enter your current password.');
        return;
      }
      if (newPassword.length < 8) {
        setSaveError('New password must be at least 8 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setSaveError('New passwords do not match.');
        return;
      }
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const payload = {
        full_name: fullName.trim(),
        contact_number: contactNumber.trim() || null,
        address: address.trim() || null,
        household_size: householdSize.trim() ? parseInt(householdSize.trim(), 10) : null,
      };

      if (changePassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
        payload.new_password_confirmation = confirmPassword;
      }

      const updated = await updateBeneficiaryProfile(session.token, session.beneficiaryId, payload);

      setProfileData(updated);
      if (updated.full_name) {
        updateSessionUser({ name: updated.full_name });
      }

      setIsEditing(false);
      setSaveSuccess('Your account details have been updated.');
    } catch (err) {
      setSaveError(err.message || 'Could not update your account. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <MemberLayout onRefresh={() => refresh('profile')} refreshing={isRefreshing}>
      <PageHeading
        title="My account"
        subtitle="View and update your ReliefTrack beneficiary details."
      />

      {error ? <ErrorState message={error} onRetry={() => refresh('profile')} /> : null}
      {isLoading && !profile ? <LoadingState message="Loading your beneficiary profile…" /> : null}

      {saveSuccess ? (
        <View style={styles.successNotice}>
          <Text style={styles.successTitle}>✓  {saveSuccess}</Text>
        </View>
      ) : null}

      {profile && !isEditing ? (
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

          <TouchableOpacity
            style={styles.editButton}
            onPress={startEditing}
            accessibilityRole="button"
            accessibilityLabel="Edit account details"
          >
            <Text style={styles.editButtonText}>✎  Edit profile details</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {isEditing ? (
        <View style={styles.card}>
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>Edit account details</Text>
            <Text style={styles.editSubtitle}>
              Update your contact info or change your password.
            </Text>
          </View>

          <FormField
            label="Full name"
            value={fullName}
            onChangeText={(v) => {
              setSaveError('');
              setFullName(v);
            }}
            placeholder="Your full name"
            autoComplete="name"
          />

          <FormField
            label="Contact number"
            value={contactNumber}
            onChangeText={(v) => {
              setSaveError('');
              setContactNumber(v);
            }}
            placeholder="e.g. 09123456789"
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          <FormField
            label="Address"
            value={address}
            onChangeText={(v) => {
              setSaveError('');
              setAddress(v);
            }}
            placeholder="House no., street, barangay"
            multiline
            numberOfLines={3}
            autoComplete="street-address"
          />

          <FormField
            label="Household size"
            value={householdSize}
            onChangeText={(v) => {
              setSaveError('');
              setHouseholdSize(v);
            }}
            placeholder="Number of members in household"
            keyboardType="number-pad"
          />

          {/* Password toggle section */}
          <TouchableOpacity
            style={styles.passwordToggleRow}
            onPress={() => {
              setSaveError('');
              setChangePassword((prev) => !prev);
            }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: changePassword }}
          >
            <View style={[styles.checkbox, changePassword && styles.checkboxActive]}>
              {changePassword ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.passwordToggleText}>Change password</Text>
          </TouchableOpacity>

          {changePassword ? (
            <View style={styles.passwordSection}>
              <PasswordField
                label="Current password"
                value={currentPassword}
                onChangeText={(v) => {
                  setSaveError('');
                  setCurrentPassword(v);
                }}
                visible={showPassword}
                onToggleVisibility={() => setShowPassword((prev) => !prev)}
                showVisibilityButton
                placeholder="Enter current password"
              />
              <PasswordField
                label="New password"
                value={newPassword}
                onChangeText={(v) => {
                  setSaveError('');
                  setNewPassword(v);
                }}
                visible={showPassword}
                placeholder="At least 8 characters"
              />
              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                onChangeText={(v) => {
                  setSaveError('');
                  setConfirmPassword(v);
                }}
                visible={showPassword}
                placeholder="Re-enter new password"
              />
            </View>
          ) : null}

          {saveError ? (
            <Text accessibilityRole="alert" style={globalStyles.errorText}>
              {saveError}
            </Text>
          ) : null}

          <View style={styles.actionButtons}>
            <PrimaryButton
              title={isSaving ? 'Saving changes…' : 'Save changes'}
              onPress={handleSave}
              disabled={isSaving}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelEditing}
              disabled={isSaving}
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {storageWarning ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>This device could not save your sign-in</Text>
          <Text style={styles.warningText}>You may need to sign in again after closing ReliefTrack.</Text>
        </View>
      ) : null}

      {!isEditing ? (
        <>
          <Text style={styles.help}>
            Priority type and issuance of QR passes are managed by your Barangay Administrator.
          </Text>
          <PrimaryButton
            title={isSigningOut ? 'Signing out…' : 'Sign out'}
            onPress={handleSignOut}
            disabled={isSigningOut}
          />
        </>
      ) : null}
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.reliefTint,
    borderColor: '#ccecd6',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  nameCopy: {
    flex: 1,
  },
  name: {
    color: colors.darkBlue,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  number: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginTop: 5,
  },
  details: {
    marginTop: 12,
  },
  editButton: {
    marginTop: 16,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: colors.dirtyWhiteDarker,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: colors.darkBlue,
    fontSize: 13,
    fontWeight: '700',
  },
  editHeader: {
    marginBottom: 16,
  },
  editTitle: {
    color: colors.darkBlue,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  editSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  passwordToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  passwordToggleText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  passwordSection: {
    backgroundColor: colors.dirtyWhiteDarker,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  actionButtons: {
    marginTop: 6,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginTop: -4,
    marginBottom: 12,
  },
  cancelButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  successNotice: {
    backgroundColor: colors.successBackground,
    borderColor: '#bbf7d0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  successTitle: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '700',
  },
  warning: {
    backgroundColor: colors.warningBackground,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },
  warningTitle: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '800',
  },
  warningText: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  help: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
});
