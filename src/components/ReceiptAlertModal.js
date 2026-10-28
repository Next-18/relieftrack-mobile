import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import colors from '../styles/colors';

const AUTO_DISMISS_MS = 5000;

function CheckIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export default function ReceiptAlertModal({ items, onDismiss }) {
  const visible = Array.isArray(items) && items.length > 0;

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    const timeout = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timeout);
  }, [visible, items, onDismiss]);

  if (!visible) {
    return null;
  }

  const names = [...new Set(items.map((item) => item.relief_package?.package_name || item.package_name || 'Relief package'))];
  const message = names.length === 1
    ? `${names[0]} has been released to you.`
    : `${names.length} packages have been released to you.`;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onDismiss}>
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.iconCircle}>
            <CheckIcon />
          </View>
          <Text style={styles.title}>Successfully received</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.button} onPress={onDismiss} accessibilityRole="button">
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(64, 51, 43, 0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    maxWidth: 320,
    paddingHorizontal: 18,
    paddingVertical: 20,
    width: '100%',
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.activeTab,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginBottom: 12,
    width: 48,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.darkBlue,
    fontSize: 14,
    fontWeight: '700',
  },
});
