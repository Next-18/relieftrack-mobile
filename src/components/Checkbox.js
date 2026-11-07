import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function CheckIcon({ size = 14, color = '#FFFFFF' }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export default function Checkbox({ checked, onChange, label, labelStyle, containerStyle }) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      style={[styles.container, containerStyle]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      activeOpacity={0.75}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <CheckIcon />}
      </View>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: '#B8CEE2',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0062C4',
    borderColor: '#0062C4',
  },
  label: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#0A3873',
  },
});
