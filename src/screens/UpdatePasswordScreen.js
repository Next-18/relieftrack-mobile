import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import SubScreenHeader from '../components/SubScreenHeader';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

export default function UpdatePasswordScreen() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await updatePassword({ currentPassword, newPassword });
      setSuccess('Your password has been updated.');
      setTimeout(() => router.back(), 1200);
    } catch (err) {
      setError(err.message || 'Password could not be changed.');
      setIsSaving(false);
    }
  };

  const clearError = () => setError('');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SubScreenHeader title="Change password" />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.formCardCompact}>
            <Text style={globalStyles.formIntroCompact}>
              Enter your current password, then choose a new one.
            </Text>

            <PasswordField
              compact
              label="Current password"
              value={currentPassword}
              onChangeText={(value) => {
                clearError();
                setCurrentPassword(value);
              }}
              visible={showCurrent}
              onToggleVisibility={() => setShowCurrent((v) => !v)}
              showVisibilityButton
              placeholder="Enter current password"
            />

            <PasswordField
              compact
              label="New password"
              value={newPassword}
              onChangeText={(value) => {
                clearError();
                setNewPassword(value);
              }}
              visible={showNew}
              onToggleVisibility={() => setShowNew((v) => !v)}
              showVisibilityButton
              placeholder="At least 8 characters"
            />

            <PasswordField
              compact
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={(value) => {
                clearError();
                setConfirmPassword(value);
              }}
              visible={showConfirm}
              onToggleVisibility={() => setShowConfirm((v) => !v)}
              showVisibilityButton
              placeholder="Re-enter new password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {error ? <Text accessibilityRole="alert" style={globalStyles.errorText}>{error}</Text> : null}
            {success ? (
              <View style={styles.successNotice}>
                <Text style={styles.successText}>{success}</Text>
              </View>
            ) : null}

            <PrimaryButton
              compact
              title={isSaving ? 'Updating…' : 'Update password'}
              onPress={handleSubmit}
              disabled={isSaving || !!success}
            />

            <Text style={globalStyles.helpText}>Your new password must be at least 8 characters.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
  },
  successNotice: {
    backgroundColor: colors.successBackground,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  successText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '400',
  },
});
