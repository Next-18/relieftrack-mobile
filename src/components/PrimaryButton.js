import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function PrimaryButton({ title, onPress, disabled = false, compact = false }) {
  return (
    <TouchableOpacity
      style={[
        compact ? globalStyles.primaryButtonCompact : globalStyles.primaryButton,
        disabled && globalStyles.primaryButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={compact ? globalStyles.primaryButtonTextCompact : globalStyles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}
