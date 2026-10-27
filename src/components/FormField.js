import React from 'react';
import { Text, TextInput, View } from 'react-native';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder = label,
  autoCapitalize = 'words',
  keyboardType = 'default',
  autoComplete,
  textContentType,
  maxLength,
  multiline = false,
  numberOfLines,
  returnKeyType = 'next',
  onSubmitEditing,
  compact = false,
}) {
  const containerStyle = compact ? globalStyles.inputContainerCompact : globalStyles.inputContainer;
  const labelStyle = compact ? globalStyles.labelCompact : globalStyles.label;
  const inputStyle = compact
    ? [globalStyles.inputCompact, multiline && globalStyles.multilineInputCompact]
    : [globalStyles.input, multiline && globalStyles.multilineInput];

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        accessibilityLabel={label}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        textContentType={textContentType}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}
