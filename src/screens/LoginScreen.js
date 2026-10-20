import React, { useState } from 'react';
import { Text, View } from 'react-native';
import AppLayout from '../components/AppLayout';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';
import globalStyles from '../styles/globalStyles';

export default function LoginScreen({ initialBeneficiaryNo = '', onLogin }) {
  const [beneficiaryNo, setBeneficiaryNo] = useState(initialBeneficiaryNo);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!beneficiaryNo.trim() || !password) {
      setLoginError('Enter your beneficiary number and password.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      await onLogin({ beneficiaryNo, password });
    } catch (error) {
      setLoginError(error.message || 'Sign-in failed. Check your beneficiary number and password.');
      setIsLoggingIn(false);
    }
  };

  const clearLoginError = () => setLoginError('');

  return (
    <AppLayout>
      <View style={globalStyles.formCard}>
        <Text style={globalStyles.formTitle}>Beneficiary sign in</Text>
        <Text style={globalStyles.formIntro}>View your relief packages and distribution records.</Text>

        <FormField
          label="Beneficiary number"
          placeholder="For example, BEN-1001"
          value={beneficiaryNo}
          onChangeText={(value) => {
            clearLoginError();
            setBeneficiaryNo(value);
          }}
          autoCapitalize="characters"
          autoComplete="username"
        />

        <PasswordField
          label="Password"
          value={password}
          onChangeText={(value) => {
            clearLoginError();
            setPassword(value);
          }}
          visible={showPassword}
          onToggleVisibility={() => setShowPassword((visible) => !visible)}
          showVisibilityButton
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {loginError ? <Text accessibilityRole="alert" style={globalStyles.errorText}>{loginError}</Text> : null}

        <PrimaryButton
          title={isLoggingIn ? 'Signing in…' : 'Sign in'}
          onPress={handleLogin}
          disabled={isLoggingIn}
        />

        <Text style={globalStyles.helpText}>Need help? Contact your Barangay Administrator.</Text>
      </View>
    </AppLayout>
  );
}
