import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LoginLayout from '../components/LoginLayout';
import IconInput from '../components/IconInput';
import PasswordField from '../components/PasswordField';
import Checkbox from '../components/Checkbox';
import { PersonIcon, LockIcon, ArrowRightIcon } from '../components/Icons';
import {
  clearRememberedBeneficiary,
  getRememberedBeneficiary,
  saveRememberedBeneficiary,
} from '../services/authStorage';
import colors from '../styles/colors';

export default function LoginScreen({ initialBeneficiaryNo = '', onLogin }) {
  const [beneficiaryNo, setBeneficiaryNo] = useState(initialBeneficiaryNo);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadRemembered() {
      if (initialBeneficiaryNo) return;
      try {
        const remembered = await getRememberedBeneficiary();
        if (remembered && isMounted) {
          setBeneficiaryNo(remembered);
          setRememberMe(true);
        }
      } catch {
        // Ignore secure store read failure
      }
    }
    loadRemembered();
    return () => {
      isMounted = false;
    };
  }, [initialBeneficiaryNo]);

  const handleLogin = async () => {
    if (!beneficiaryNo.trim() || !password) {
      setLoginError('Enter your beneficiary number and password.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      if (rememberMe) {
        await saveRememberedBeneficiary(beneficiaryNo.trim()).catch(() => {});
      } else {
        await clearRememberedBeneficiary().catch(() => {});
      }

      await onLogin({ beneficiaryNo, password });
    } catch (error) {
      setLoginError(error.message || 'Sign-in failed. Check your beneficiary number and password.');
      setIsLoggingIn(false);
    }
  };

  const clearLoginError = () => setLoginError('');

  return (
    <LoginLayout>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue to ReliefTrack</Text>

      <IconInput
        label="Username or Beneficiary No."
        placeholder="Username or Beneficiary No."
        value={beneficiaryNo}
        onChangeText={(value) => {
          clearLoginError();
          setBeneficiaryNo(value);
        }}
        icon={<PersonIcon color="#607B9E" size={22} />}
        autoCapitalize="none"
        autoComplete="username"
        containerStyle={styles.inputSpacing}
      />

      <PasswordField
        appearance="login"
        label="Password"
        placeholder="Password"
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
        icon={<LockIcon color="#607B9E" size={22} />}
        containerStyle={styles.inputSpacing}
      />

      <View style={styles.rememberRow}>
        <Checkbox
          checked={rememberMe}
          onChange={setRememberMe}
          label="Remember Me"
        />
      </View>

      {loginError ? (
        <View style={styles.errorBox}>
          <Text accessibilityRole="alert" style={styles.errorText}>
            {loginError}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.loginButton, isLoggingIn && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={isLoggingIn}
        accessibilityRole="button"
        accessibilityState={{ disabled: isLoggingIn }}
        activeOpacity={0.85}
      >
        {isLoggingIn ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.loginButtonText}>Logging in…</Text>
          </>
        ) : (
          <>
            <Text style={styles.loginButtonText}>Login</Text>
            <ArrowRightIcon size={20} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>
    </LoginLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '800',
    color: '#0A3873',
    letterSpacing: -0.4,
    fontSize: 31,
    marginBottom: 4,
  },
  subtitle: {
    color: '#607B9E',
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 22,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  loginButton: {
    backgroundColor: '#004EA0',
    height: 54,
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#004EA0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
