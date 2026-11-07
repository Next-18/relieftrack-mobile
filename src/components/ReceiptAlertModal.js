import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  playQrScanErrorSound,
  playQrScanSuccessSound,
} from '../utils/soundEffects';
import colors from '../styles/colors';

const AUTO_DISMISS_MS = 6000;

function SweetAlertCheckIcon({ size = 34, color = '#10B981' }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

function SweetAlertErrorIcon({ size = 32, color = '#EF4444' }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M18 6L6 18" />
      <Path d="M6 6l12 12" />
    </Svg>
  );
}

export default function ReceiptAlertModal({
  items,
  error,
  onDismiss,
  onDismissError,
}) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const isError = Boolean(error);
  const visible = hasItems || isError;

  // Store Animated.Values in useState so they are stable across renders
  // and can safely be referenced in JSX without triggering the refs-in-render lint rule.
  const [scaleAnim] = useState(() => new Animated.Value(0.75));
  const [opacityAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      scaleAnim.setValue(0.75);
      opacityAnim.setValue(0);
      return undefined;
    }

    // Play appropriate sound immediately upon alert display
    if (isError) {
      playQrScanErrorSound();
    } else {
      playQrScanSuccessSound();
    }

    // SweetAlert pop-in spring animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      if (isError && onDismissError) {
        onDismissError();
      } else if (onDismiss) {
        onDismiss();
      }
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timeout);
  }, [visible, isError, items, error, onDismiss, onDismissError, scaleAnim, opacityAnim]);

  if (!visible) {
    return null;
  }

  const handleDismiss = () => {
    if (isError && onDismissError) {
      onDismissError();
    } else if (onDismiss) {
      onDismiss();
    }
  };

  let title = 'Successfully received!';
  let message = '';

  if (isError) {
    title = error?.title || 'Already received!';
    message =
      error?.message ||
      (error?.packageName
        ? `${error.packageName} has already been claimed and released. Each beneficiary is only eligible to receive once.`
        : 'This relief package has already been claimed and released. Each beneficiary is only eligible to receive once.');
  } else {
    const names = [
      ...new Set(
        items.map(
          (item) => item.relief_package?.package_name || item.package_name || 'Relief package'
        )
      ),
    ];
    message =
      names.length === 1
        ? `${names[0]} has been released to you.`
        : `${names.length} packages have been released to you.`;
  }

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Pressable onPress={() => {}} style={styles.cardInner}>
            {/* SweetAlert Icon Ring: Green Check or Red Cross */}
            {isError ? (
              <View style={styles.iconRingOuterError}>
                <View style={styles.iconRingInnerError}>
                  <SweetAlertErrorIcon />
                </View>
              </View>
            ) : (
              <View style={styles.iconRingOuter}>
                <View style={styles.iconRingInner}>
                  <SweetAlertCheckIcon />
                </View>
              </View>
            )}

            <Text accessibilityRole="alert" style={styles.title}>
              {title}
            </Text>
            <Text style={styles.message}>{message}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                isError && styles.buttonError,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleDismiss}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>{isError ? 'Understood' : 'Done'}</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  cardInner: {
    alignItems: 'center',
    width: '100%',
  },
  iconRingOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D1FAE5',
    borderWidth: 3,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconRingInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingOuterError: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    borderWidth: 3,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconRingInnerError: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonError: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
