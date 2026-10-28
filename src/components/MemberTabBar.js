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

const activeColor = '#2563EB';
const inactiveIconColor = '#94A3B8';
const inactiveTextColor = '#64748B';

function QrIcon() {
  return (
    <Svg width={38} height={38} viewBox="0 0 38 38" fill="none" stroke="#FFFFFF" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
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
      style={styles.tabButton}
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
        {state.routes.map((route, index) => (
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
                  color="#17191E"
                  backgroundColor="#FFFFFF"
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
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabLabel: {
    color: inactiveTextColor,
    fontSize: 10,
    marginTop: 2,
  },
  tabLabelActive: {
    color: activeColor,
    fontWeight: '500',
  },
  qrTabButton: {
    alignItems: 'center',
    flex: 1,
    height: 64,
    justifyContent: 'flex-end',
    paddingBottom: 3,
  },
  qrTabButtonHighlighted: {
    backgroundColor: '#EAF2FF',
  },
  qrTabCircle: {
    alignItems: 'center',
    backgroundColor: activeColor,
    borderColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 3,
    height: 64,
    justifyContent: 'center',
    position: 'absolute',
    top: -24,
    width: 64,
  },
  qrTabCircleHovered: {
    backgroundColor: '#2D70D4',
  },
  qrTabLabel: {
    color: '#52657F',
    fontSize: 11,
    marginTop: 1,
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  qrModal: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxWidth: 380,
    padding: 16,
    width: '100%',
  },
  modalTitle: {
    color: '#17191E',
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: '#666B75',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  qrFrame: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E9ED',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  beneficiaryNumber: {
    color: '#17191E',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 12,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: activeColor,
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  closeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
