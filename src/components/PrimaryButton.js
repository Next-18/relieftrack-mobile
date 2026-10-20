import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function PrimaryButton({ title, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      style={[globalStyles.primaryButton, disabled && globalStyles.primaryButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={globalStyles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}
