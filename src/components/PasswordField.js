import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

function EyeIcon({ visible }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {visible ? (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          <Path d="M1 1l22 22" />
        </>
      ) : (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </>
      )}
    </Svg>
  );
}

export default function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggleVisibility,
  showVisibilityButton = false,
  autoComplete = 'password',
  textContentType,
  returnKeyType = 'next',
  onSubmitEditing,
  placeholder = 'Enter password',
  compact = false,
}) {
  return (
    <View style={compact ? globalStyles.inputContainerCompact : globalStyles.inputContainer}>
      <Text style={compact ? globalStyles.labelCompact : globalStyles.label}>{label}</Text>

      {showVisibilityButton ? (
        <View style={compact ? globalStyles.passwordInputWrapperCompact : globalStyles.passwordInputWrapper}>
          <TextInput
            style={compact ? globalStyles.passwordInputCompact : globalStyles.passwordInput}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            value={value}
            accessibilityLabel={label}
            onChangeText={onChangeText}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={autoComplete}
            textContentType={textContentType}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
          />
          <TouchableOpacity
            style={compact ? globalStyles.showPasswordButtonCompact : globalStyles.showPasswordButton}
            onPress={onToggleVisibility}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          >
            <EyeIcon visible={visible} />
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={compact ? globalStyles.inputCompact : globalStyles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          accessibilityLabel={label}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
      )}
    </View>
  );
}
