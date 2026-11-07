import React, { Fragment, useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import colors from '../styles/colors';
import { useAuth } from '../contexts/AuthContext';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';

function QrGridIcon({ size = 26, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke={color} strokeWidth={2.4} />
      <Rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke={color} strokeWidth={2.4} />
      <Rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke={color} strokeWidth={2.4} />
      <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth={2.4} />
    </Svg>
  );
}

function TabButton({ route, state, descriptors }) {
  const isFocused = state.index === state.routes.indexOf(route);
  const { options } = descriptors[route.key];
  const label = options.tabBarLabel ?? options.title ?? route.name;

  const onPress = () => {
    const event = state.emit?.({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event?.defaultPrevented) {
      descriptors[route.key].navigation.navigate(route.name);
    }
  };

  const color = isFocused ? '#1868A0' : '#64748B';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      style={[styles.tabButton, isFocused && styles.tabButtonActive]}
    >
      {options.tabBarIcon?.({ focused: isFocused, color, size: 20 })}
      <Text numberOfLines={1} style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function MemberTabBar({ state, descriptors }) {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const {
    showQrModal,
    setShowQrModal,
    simulateAlreadyReceivedScan,
    data,
  } = useBeneficiaryData();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const distributions = data?.distributions || [];
  const pendingAssignments = distributions.filter(
    (item) => String(item.status).toLowerCase() === 'pending'
  );
  const releasedDistributions = distributions.filter(
    (item) => String(item.status).toLowerCase() === 'released'
  );
  const isAlreadyReceived = pendingAssignments.length === 0 && releasedDistributions.length > 0;

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View style={styles.tabBarWrapper}>
      {/* Wave flourish peeking behind the rounded tab bar top */}
      <Image
        source={require('../../assets/login-footer.png')}
        style={styles.waveFooter}
        resizeMode="cover"
      />

      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 6) }]}>
        <View style={styles.bar}>
          {state.routes
            .filter((route) => {
              const options = descriptors[route.key]?.options;
              return options?.href !== null;
            })
            .map((route, index) => (
              <Fragment key={route.key}>
                {index === 2 ? (
                  <View style={styles.qrSlot}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Show my beneficiary QR code"
                      onPress={() => setShowQrModal(true)}
                      style={({ pressed }) => [
                        styles.qrCircle,
                        pressed && styles.qrCirclePressed,
                      ]}
                    >
                      <QrGridIcon size={26} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ) : null}
                <TabButton
                  route={route}
                  state={state}
                  descriptors={descriptors}
                />
              </Fragment>
            ))}
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={showQrModal}
          onRequestClose={() => setShowQrModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.qrModal}>
              <Text style={styles.modalTitle}>Your beneficiary QR</Text>
              <Text style={styles.modalSubtitle}>Show this code to relief staff at pickup.</Text>
              {session?.beneficiaryNo ? (
                <Pressable
                  onPress={() => {
                    if (isAlreadyReceived) {
                      simulateAlreadyReceivedScan();
                    }
                  }}
                  style={styles.qrFrame}
                >
                  <QRCode
                    value={session.beneficiaryNo}
                    size={230}
                    color={colors.navy}
                    backgroundColor={colors.white}
                    ecl="H"
                    quietZone={8}
                  />
                </Pressable>
              ) : (
                <Text style={styles.modalSubtitle}>Your beneficiary number is not available. Please sign in again.</Text>
              )}
              {session?.beneficiaryNo ? <Text selectable style={styles.beneficiaryNumber}>{session.beneficiaryNo}</Text> : null}

              {isAlreadyReceived ? (
                <View style={styles.alreadyClaimedBadge}>
                  <Text style={styles.alreadyClaimedBadgeText}>
                    ℹ️ Relief package already claimed
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity accessibilityRole="button" onPress={() => setShowQrModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  waveFooter: {
    position: 'absolute',
    bottom: 38,
    left: 0,
    right: 0,
    width: '100%',
    height: 52,
    opacity: 0.9,
    zIndex: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingTop: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  bar: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 4,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: '#E0EDFD',
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#1868A0',
    fontWeight: '700',
  },
  qrSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCircle: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderColor: '#FFFFFF',
    borderRadius: 29,
    borderWidth: 3.5,
    height: 58,
    justifyContent: 'center',
    width: 58,
    marginTop: -26,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  qrCirclePressed: {
    backgroundColor: '#047857',
    transform: [{ scale: 0.95 }],
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  qrModal: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    maxWidth: 380,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  qrFrame: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  beneficiaryNumber: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 16,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: 18,
    paddingHorizontal: 32,
    paddingVertical: 12,
    width: '100%',
  },
  closeButtonText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  alreadyClaimedBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  alreadyClaimedBadgeText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
});
