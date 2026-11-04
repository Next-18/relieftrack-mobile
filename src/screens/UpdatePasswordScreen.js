import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
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
      setShowSuccessAlert(true);
    } catch (err) {
      setError(err.message || 'Password could not be changed.');
      setIsSaving(false);
    }
  };

  const clearError = () => setError('');
  const handleSuccessDone = () => {
    setShowSuccessAlert(false);
    router.back();
  };

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

            <PrimaryButton
              compact
              title={isSaving ? 'Updating…' : 'Update password'}
              onPress={handleSubmit}
              disabled={isSaving}
            />

            <Text style={globalStyles.helpText}>Your new password must be at least 8 characters.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent
        visible={showSuccessAlert}
        animationType="fade"
        onRequestClose={handleSuccessDone}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertCard}>
            <View accessible={false} style={styles.alertIconCircle}>
              <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M20 6L9 17l-5-5" />
              </Svg>
            </View>
            <Text accessibilityRole="alert" style={styles.alertTitle}>Password updated</Text>
            <Text style={styles.alertMessage}>Your password has been updated.</Text>
            <Pressable
              style={styles.alertButton}
              onPress={handleSuccessDone}
              accessibilityRole="button"
            >
              <Text style={styles.alertButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  alertOverlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 20,
  },
  alertCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    maxWidth: 340,
    paddingHorizontal: 20,
    paddingVertical: 24,
    width: '100%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alertIconCircle: {
    alignItems: 'center',
    backgroundColor: colors.successBackground,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 14,
    width: 56,
  },
  alertTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  alertMessage: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: '100%',
  },
  alertButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
