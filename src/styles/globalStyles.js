import { StyleSheet } from 'react-native';
import colors from './colors';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },

  // App header (login / register screens)
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },

  // Form card — matches the admin's .shell / .form-panel feel
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: colors.border,
    padding: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  formIntro: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 16,
    lineHeight: 18,
  },

  // Compact variants — used by account sub-screens (edit profile, change password)
  formCardCompact: {
    backgroundColor: colors.white,
    borderRadius: 6,
    borderWidth: 0,
    borderColor: colors.border,
    padding: 12,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  formIntroCompact: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 10,
    lineHeight: 16,
  },
  inputContainerCompact: {
    marginBottom: 8,
  },
  labelCompact: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 4,
  },
  inputCompact: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E3D5C0',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: colors.white,
    color: colors.text,
  },
  multilineInputCompact: {
    height: 72,
    paddingTop: 10,
  },
  passwordInputWrapperCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#E3D5C0',
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  passwordInputCompact: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
  },
  showPasswordButtonCompact: {
    minWidth: 48,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  primaryButtonCompact: {
    backgroundColor: colors.primary,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  primaryButtonTextCompact: {
    color: colors.darkBlue,
    fontSize: 14,
    fontWeight: '700',
  },

  // Inputs — matches admin .field style
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.placeholder,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: colors.white,
    color: colors.text,
  },
  multilineInput: {
    height: 80,
    paddingTop: 12,
  },

  // Password field
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: colors.placeholder,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
  },
  showPasswordButton: {
    minWidth: 52,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  showPasswordText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '400',
  },

  // Primary button — matches admin .submit
  primaryButton: {
    backgroundColor: colors.primary,
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.darkBlue,
    fontSize: 15,
    fontWeight: '700',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  // Register / login prompt rows
  registerPrompt: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },
  loginPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: -2,
    marginBottom: 14,
  },
  registerPromptText: {
    color: colors.muted,
    fontSize: 13,
  },
  loginLinkText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '400',
    paddingVertical: 6,
    paddingHorizontal: 2,
    textDecorationLine: 'underline',
  },

  // Secondary button (outline)
  secondaryButton: {
    height: 44,
    borderWidth: 0,
    borderColor: colors.border,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  // Back button
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    marginBottom: 12,
  },
  backButtonText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  // Show/hide passwords toggle
  passwordVisibilityButton: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
    marginTop: -5,
    marginBottom: 6,
  },
  passwordVisibilityText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  // Error text — matches admin --admin-danger
  errorText: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },

  // Help text
  helpText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Account number card (post-registration)
  accountNumberCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
  },
  accountNumberLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 6,
  },
  accountNumber: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default globalStyles;
