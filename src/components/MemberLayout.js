import React from 'react';
import { Image, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import colors from '../styles/colors';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import ReceiptAlertModal from './ReceiptAlertModal';

export default function MemberLayout({ children, onRefresh, refreshing = false }) {
  const { releasedItems, dismissReleasedAlert } = useBeneficiaryData();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh
              ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
              : undefined
          }
        >
          <View style={styles.topBar}>
            <View style={styles.brand}>
              <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
              <View>
                <Text style={styles.brandName}>ReliefTrack</Text>
                <Text style={styles.brandCaption}>BENEFICIARY PORTAL</Text>
              </View>
            </View>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
      <ReceiptAlertModal items={releasedItems} onDismiss={dismissReleasedAlert} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 38,
    height: 38,
    marginRight: 11,
  },
  brandName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  brandCaption: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
});
