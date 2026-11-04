import React, { Fragment, useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import colors from '../styles/colors';

const activeColor = colors.blue;
const inactiveIconColor = colors.muted;
const inactiveTextColor = colors.muted;

function QrIcon() {
  return (
    <Svg width={38} height={38} viewBox="0 0 38 38" fill="none" stroke={colors.white} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 13V7a2 2 0 0 1 2-2h6M25 5h6a2 2 0 0 1 2 2v6M33 25v6a2 2 0 0 1-2 2h-6M13 33H7a2 2 0 0 1-2-2v-6" />
      <Rect x="11" y="11" width="6" height="6" rx="1" />
      <Rect x="21" y="11" width="6" height="6" rx="1" />
      <Rect x="11" y="21" width="6" height="6" rx="1" />
      <Path d="M22 22h3v3h-3zM28 22v3h3M25 28v3h3M31 28v3" />
    </Svg>
  );
}

function TabButton({ route, state, descriptors }) {
  const router = useRouter();
  const options = descriptors[route.key].options;
  const focused = state.routes[state.index]?.key === route.key;
  const color = focused ? activeColor : inactiveIconColor;
  const label = options.tabBarLabel ?? options.title ?? route.name;

  const onPress = () => {
    router.navigate(`/(tabs)/${route.name}`);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={options.tabBarAccessibilityLabel || String(label)}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      style={[styles.tabButton, focused && styles.tabButtonActive]}
    >
      {options.tabBarIcon?.({ focused, color, size: 18 })}
      <Text numberOfLines={1} style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

export default function MemberTabBar({ state, descriptors }) {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const [showQr, setShowQr] = useState(false);
  const [qrHovered, setQrHovered] = useState(false);
  const [qrPressed, setQrPressed] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {state.routes.filter((route) => {
          const options = descriptors[route.key]?.options;
          return options?.href !== null;
        }).map((route, index) => (
          <Fragment key={route.key}>
            {index === 2 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show my beneficiary QR code"
                onPress={() => setShowQr(true)}
                onPressIn={() => setQrPressed(true)}
                onPressOut={() => setQrPressed(false)}
                onHoverIn={() => setQrHovered(true)}
                onHoverOut={() => setQrHovered(false)}
                style={({ pressed }) => [
                  styles.qrTabButton,
                  (pressed || qrHovered) && styles.qrTabButtonHighlighted,
                ]}
              >
                <View style={[styles.qrTabCircle, (qrHovered || qrPressed) && styles.qrTabCircleHovered]}><QrIcon /></View>
                <Text style={styles.qrTabLabel}>QR</Text>
              </Pressable>
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
        visible={showQr}
        onRequestClose={() => setShowQr(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.qrModal}>
            <Text style={styles.modalTitle}>Your beneficiary QR</Text>
            <Text style={styles.modalSubtitle}>Show this code to relief staff at pickup.</Text>
            {session?.beneficiaryNo ? (
              <View style={styles.qrFrame}>
                <QRCode
                  value={session.beneficiaryNo}
                  size={230}
                  color={colors.navy}
                  backgroundColor={colors.white}
                  ecl="H"
                  quietZone={8}
                />
              </View>
            ) : (
              <Text style={styles.modalSubtitle}>Your beneficiary number is not available. Please sign in again.</Text>
            )}
            {session?.beneficiaryNo ? <Text selectable style={styles.beneficiaryNumber}>{session.beneficiaryNo}</Text> : null}
            <TouchableOpacity accessibilityRole="button" onPress={() => setShowQr(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 2,
    paddingVertical: 6,
  },
  tabButtonActive: {
    backgroundColor: colors.blueLight,
  },
  tabLabel: {
    color: inactiveTextColor,
    fontSize: 11,
    marginTop: 4,
  },
  tabLabelActive: {
    color: activeColor,
    fontWeight: '600',
  },
  qrTabButton: {
    alignItems: 'center',
    flex: 1,
    height: 70,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  qrTabButtonHighlighted: {
    backgroundColor: colors.blueLight,
  },
  qrTabCircle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.white,
    borderRadius: 36,
    borderWidth: 4,
    height: 72,
    justifyContent: 'center',
    position: 'absolute',
    top: -28,
    width: 72,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  qrTabCircleHovered: {
    backgroundColor: colors.primaryDark,
  },
  qrTabLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
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
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  closeButtonText: { color: colors.white, fontSize: 15, fontWeight: '600' },
});
