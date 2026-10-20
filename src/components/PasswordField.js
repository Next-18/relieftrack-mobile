import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

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
}) {
  return (
    <View style={globalStyles.inputContainer}>
      <Text style={globalStyles.label}>{label}</Text>

      {showVisibilityButton ? (
        <View style={globalStyles.passwordInputWrapper}>
          <TextInput
            style={globalStyles.passwordInput}
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
            style={globalStyles.showPasswordButton}
            onPress={onToggleVisibility}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          >
            <Text style={globalStyles.showPasswordText}>{visible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={globalStyles.input}
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
