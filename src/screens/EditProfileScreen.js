import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import SubScreenHeader from '../components/SubScreenHeader';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { getBeneficiaryProfile, updateBeneficiaryProfile } from '../services/api';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

export default function EditProfileScreen() {
  const router = useRouter();
  const { session, updateSessionUser } = useAuth();
  const [fullName, setFullName] = useState(session?.user?.name || '');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [householdSize, setHouseholdSize] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getBeneficiaryProfile(session.token, session.beneficiaryId)
      .then((profile) => {
        if (!isMounted || !profile) {
          return;
        }
        setFullName(profile.full_name || session?.user?.name || '');
        setContactNumber(profile.contact_number || '');
        setAddress(profile.address || '');
        setHouseholdSize(profile.household_size ? String(profile.household_size) : '');
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [session]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (householdSize && (isNaN(Number(householdSize)) || Number(householdSize) < 1 || Number(householdSize) > 99)) {
      setError('Household size must be a number between 1 and 99.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const updated = await updateBeneficiaryProfile(session.token, session.beneficiaryId, {
        full_name: fullName.trim(),
        contact_number: contactNumber.trim() || null,
        address: address.trim() || null,
        household_size: householdSize.trim() ? parseInt(householdSize.trim(), 10) : null,
      });

      if (updated?.full_name) {
        updateSessionUser({ name: updated.full_name });
      }

      setSuccess('Your account details have been updated.');
      setTimeout(() => router.back(), 1200);
    } catch (err) {
      setError(err.message || 'Could not update your account. Please try again.');
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
        <SubScreenHeader title="Edit profile" />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.formCardCompact}>
            <Text style={globalStyles.formIntroCompact}>Update your contact information.</Text>

            <FormField
              compact
              label="Full name"
              value={fullName}
              onChangeText={(value) => {
                clearError();
                setFullName(value);
              }}
              placeholder="Your full name"
              autoComplete="name"
            />

            <FormField
              compact
              label="Contact number"
              value={contactNumber}
              onChangeText={(value) => {
                clearError();
                setContactNumber(value);
              }}
              placeholder="e.g. 09123456789"
              keyboardType="phone-pad"
              autoComplete="tel"
            />

            <FormField
              compact
              label="Address"
              value={address}
              onChangeText={(value) => {
                clearError();
                setAddress(value);
              }}
              placeholder="House no., street, barangay"
              multiline
              numberOfLines={3}
              autoComplete="street-address"
            />

            <FormField
              compact
              label="Household size"
              value={householdSize}
              onChangeText={(value) => {
                clearError();
                setHouseholdSize(value);
              }}
              placeholder="Members in household"
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            {error ? (
              <Text accessibilityRole="alert" style={globalStyles.errorText}>
                {error}
              </Text>
            ) : null}
            {success ? (
              <View style={styles.successNotice}>
                <Text style={styles.successText}>{success}</Text>
              </View>
            ) : null}

            <PrimaryButton
              compact
              title={isSaving ? 'Saving…' : 'Save changes'}
              onPress={handleSave}
              disabled={isSaving || !!success}
            />
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
