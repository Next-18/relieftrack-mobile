import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

function EyeToggleIcon({ visible, color = '#607B9E' }) {
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
      {!visible && <Path d="M2 2l20 20" />}
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
  icon,
  containerStyle,
  appearance = 'default',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isLogin = appearance === 'login';

  if (isLogin) {
    return (
      <View
        style={[
          styles.loginField,
          isFocused && styles.loginFieldFocused,
          containerStyle,
        ]}
      >
        {icon ? <View style={styles.loginIcon}>{icon}</View> : null}
        <TextInput
          style={styles.loginInput}
          placeholder={placeholder}
          placeholderTextColor="#849BB3"
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {showVisibilityButton ? (
          <TouchableOpacity
            style={styles.loginEyeButton}
            onPress={onToggleVisibility}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <EyeToggleIcon visible={visible} color="#607B9E" />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[compact ? globalStyles.inputContainerCompact : globalStyles.inputContainer, containerStyle]}>
      <Text style={compact ? globalStyles.labelCompact : globalStyles.label}>{label}</Text>

      {showVisibilityButton ? (
        <View style={compact ? globalStyles.passwordInputWrapperCompact : globalStyles.passwordInputWrapper}>
          {icon && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
          <TextInput
            style={[compact ? globalStyles.passwordInputCompact : globalStyles.passwordInput, icon && styles.inputWithIcon]}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
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
            <EyeToggleIcon visible={visible} color={colors.muted} />
          </TouchableOpacity>
        </View>
      ) : icon ? (
        <View style={styles.inputWrapper}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
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
        </View>
      ) : (
        <TextInput
          style={compact ? globalStyles.inputCompact : globalStyles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
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

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#EAF5FF',
  },
  inputWithIcon: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#EAF5FF',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#173B63',
  },
  loginField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1.5,
    borderColor: '#D8E6F3',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  loginFieldFocused: {
    borderColor: '#0062C4',
  },
  loginIcon: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  loginInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0A3873',
    paddingVertical: 0,
  },
  loginEyeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6,
  },
});
