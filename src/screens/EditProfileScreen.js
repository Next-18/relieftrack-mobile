import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!session?.token || !session?.beneficiaryId) {
      return () => {
        isMounted = false;
      };
    }

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
    if (!session?.token || !session?.beneficiaryId) {
      setError('Please sign in again to edit your profile.');
      return;
    }

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

      setShowSuccessAlert(true);
    } catch (err) {
      setError(err.message || 'Could not update your account. Please try again.');
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
            <PrimaryButton
              compact
              title={isSaving ? 'Saving…' : 'Save changes'}
              onPress={handleSave}
              disabled={isSaving}
            />
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
            <Text accessibilityRole="alert" style={styles.alertTitle}>Profile saved</Text>
            <Text style={styles.alertMessage}>Your account details have been updated.</Text>
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
