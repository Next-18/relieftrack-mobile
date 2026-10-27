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
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },

  // App header (login / register screens)
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },

  // Form card — matches the admin's .shell / .form-panel feel
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 0,
    borderColor: colors.border,
    padding: 20,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  formIntro: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 24,
    lineHeight: 22,
  },

  // Compact variants — used by account sub-screens (edit profile, change password)
  formCardCompact: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 0,
    borderColor: colors.border,
    padding: 16,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formIntroCompact: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 14,
    lineHeight: 20,
  },
  inputContainerCompact: {
    marginBottom: 12,
  },
  labelCompact: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 5,
  },
  inputCompact: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#E3D5C0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: colors.white,
    color: colors.text,
  },
  multilineInputCompact: {
    height: 84,
    paddingTop: 12,
  },
  passwordInputWrapperCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1.5,
    borderColor: '#E3D5C0',
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  passwordInputCompact: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
  },
  showPasswordButtonCompact: {
    minWidth: 56,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  primaryButtonCompact: {
    backgroundColor: colors.primary,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryButtonTextCompact: {
    color: colors.darkBlue,
    fontSize: 16,
    fontWeight: '700',
  },

  // Inputs — matches admin .field style
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 2,
    borderColor: colors.placeholder,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
  },
  multilineInput: {
    height: 100,
    paddingTop: 16,
  },

  // Password field
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 2,
    borderColor: colors.placeholder,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  showPasswordButton: {
    minWidth: 60,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  showPasswordText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '400',
  },

  // Primary button — matches admin .submit
  primaryButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.darkBlue,
    fontSize: 18,
    fontWeight: '700',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },

  // Register / login prompt rows
  registerPrompt: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
    marginTop: 6,
    marginBottom: 20,
  },
  loginPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: -2,
    marginBottom: 20,
  },
  registerPromptText: {
    color: colors.muted,
    fontSize: 15,
  },
  loginLinkText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '400',
    paddingVertical: 8,
    paddingHorizontal: 2,
    textDecorationLine: 'underline',
  },

  // Secondary button (outline)
  secondaryButton: {
    height: 52,
    borderWidth: 0,
    borderColor: colors.border,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  // Back button
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  // Show/hide passwords toggle
  passwordVisibilityButton: {
    alignSelf: 'flex-end',
    paddingVertical: 3,
    marginTop: -7,
    marginBottom: 8,
  },
  passwordVisibilityText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  // Error text — matches admin --admin-danger
  errorText: {
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Help text
  helpText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Account number card (post-registration)
  accountNumberCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 0,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },
  accountNumberLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 8,
  },
  accountNumber: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default globalStyles;
