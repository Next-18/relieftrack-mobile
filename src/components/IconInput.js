import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function IconInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  textContentType,
  returnKeyType = 'next',
  onSubmitEditing,
  containerStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused, containerStyle]}>
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#849BB3"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        autoComplete={autoComplete}
        textContentType={textContentType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1.5,
    borderColor: '#D8E6F3',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#0062C4',
  },
  iconContainer: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0A3873',
    paddingVertical: 0,
  },
});
