import React, { useState } from 'react';
import { Text, View } from 'react-native';
import AppLayout from '../components/AppLayout';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';
import globalStyles from '../styles/globalStyles';

export default function ChangePasswordScreen({ onChangePassword }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsChanging(true);
    setError('');

    try {
      await onChangePassword({ currentPassword, newPassword });
    } catch (err) {
      setError(err.message || 'Password change failed. Please try again.');
      setIsChanging(false);
    }
  };

  const clearError = () => setError('');

  return (
    <AppLayout>
      <View style={globalStyles.formCard}>
        <Text style={globalStyles.formTitle}>Change your password</Text>
        <Text style={globalStyles.formIntro}>For your security, set a new password you can remember.</Text>

        <PasswordField
          label="Current password"
          value={currentPassword}
          onChangeText={(value) => {
            clearError();
            setCurrentPassword(value);
          }}
          visible={showCurrentPassword}
          onToggleVisibility={() => setShowCurrentPassword((visible) => !visible)}
          showVisibilityButton
          returnKeyType="next"
        />

        <PasswordField
          label="New password"
          value={newPassword}
          onChangeText={(value) => {
            clearError();
            setNewPassword(value);
          }}
          visible={showNewPassword}
          onToggleVisibility={() => setShowNewPassword((visible) => !visible)}
          showVisibilityButton
          returnKeyType="next"
        />

        <PasswordField
          label="Confirm new password"
          value={confirmPassword}
          onChangeText={(value) => {
            clearError();
            setConfirmPassword(value);
          }}
          visible={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((visible) => !visible)}
          showVisibilityButton
          returnKeyType="done"
          onSubmitEditing={handleChangePassword}
        />

        {error ? <Text accessibilityRole="alert" style={globalStyles.errorText}>{error}</Text> : null}

        <PrimaryButton
          title={isChanging ? 'Changing password…' : 'Change password'}
          onPress={handleChangePassword}
          disabled={isChanging}
        />

        <Text style={globalStyles.helpText}>Your new password must be at least 6 characters.</Text>
      </View>
    </AppLayout>
  );
}
