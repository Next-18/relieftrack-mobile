import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import colors from '../styles/colors';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import ReceiptAlertModal from './ReceiptAlertModal';

export default function MemberLayout({
  children,
  title,
  onBack,
  onRefresh,
  refreshing = false,
  headerRight,
}) {
  const router = useRouter();
  const { offline, lastSyncedAt, pendingActions } = useBeneficiaryData();
  const {
    releasedItems,
    dismissReleasedAlert,
    alreadyReceivedAlert,
    dismissAlreadyReceivedAlert,
  } = useBeneficiaryData();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Wave Background matching mockups */}
      {title ? (
        <View style={styles.topRightBlueWaveWrap} pointerEvents="none">
          <Svg width={240} height={110} viewBox="0 0 240 110">
            <Path d="M0 0 C70 55 150 25 240 75 L240 0 Z" fill="#1868A0" opacity="0.9" />
            <Path d="M30 0 C95 65 170 35 240 95 L240 0 Z" fill="#38BDF8" opacity="0.35" />
          </Svg>
        </View>
      ) : (
        <View style={styles.topRightWaveWrap} pointerEvents="none">
          <Svg width={160} height={80} viewBox="0 0 160 80">
            <Path d="M0 0 C50 35 105 25 160 60 L160 0 Z" fill="#46B04F" opacity="0.6" />
            <Path d="M35 0 C80 45 115 35 160 75 L160 0 Z" fill="#1868A0" opacity="0.4" />
          </Svg>
        </View>
      )}

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
          {/* ── Top Header ── */}
          {title ? (
            <View style={styles.subScreenHeader}>
              <View style={styles.subScreenHeaderLeft}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  onPress={handleBack}
                  style={styles.backButton}
                  hitSlop={8}
                >
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M15 18l-6-6 6-6" />
                  </Svg>
                </Pressable>
                <Text style={styles.subScreenTitle}>{title}</Text>
              </View>
              {headerRight || null}
            </View>
          ) : (
            <View style={styles.topBar}>
              <View style={styles.brand}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                <View>
                  <Text style={styles.brandName}>
                    <Text style={styles.brandRelief}>Relief</Text>
                    <Text style={styles.brandTrack}>Track</Text>
                  </Text>
                  <Text style={styles.brandCaption}>BENEFICIARY PORTAL</Text>
                </View>
              </View>
            </View>
          )}

          {offline || pendingActions.length > 0 ? (
            <View accessibilityRole="alert" style={styles.offlineNotice}>
              <Text style={styles.offlineNoticeText}>
                {offline ? 'Offline mode: showing saved information.' : 'Some changes are waiting to sync.'}
                {lastSyncedAt ? ` Last synced ${new Date(lastSyncedAt).toLocaleString()}.` : ' No saved server data is available yet.'}
                {pendingActions.length ? ` ${pendingActions.length} change${pendingActions.length === 1 ? '' : 's'} pending.` : ''}
              </Text>
            </View>
          ) : null}

          {children}
        </ScrollView>
      </KeyboardAvoidingView>

      <ReceiptAlertModal
        items={releasedItems}
        error={alreadyReceivedAlert}
        onDismiss={dismissReleasedAlert}
        onDismissError={dismissAlreadyReceivedAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5FC',
  },
  topRightWaveWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 0,
  },
  topRightBlueWaveWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 0,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  offlineNotice: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  offlineNoticeText: { color: '#92400E', fontSize: 12, lineHeight: 17 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 2,
    zIndex: 1,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 38,
    height: 38,
    marginRight: 10,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandRelief: {
    color: '#1868A0',
  },
  brandTrack: {
    color: '#16A34A',
  },
  brandCaption: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
    letterSpacing: 0.8,
  },
  subScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingTop: 4,
    zIndex: 1,
  },
  subScreenHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
    marginLeft: -4,
  },
  subScreenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
});
