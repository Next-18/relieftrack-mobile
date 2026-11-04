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

  // Form card — white card with shadow
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: colors.border,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    borderRadius: 12,
    borderWidth: 0,
    borderColor: colors.border,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  formIntroCompact: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 12,
    lineHeight: 18,
  },
  inputContainerCompact: {
    marginBottom: 12,
  },
  labelCompact: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  inputCompact: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
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
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  passwordInputCompact: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
  },
  showPasswordButtonCompact: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  primaryButtonCompact: {
    backgroundColor: colors.primary,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonTextCompact: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  // Inputs — matches design
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
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
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
  },
  showPasswordButton: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // Primary button — brand green with white text
  primaryButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
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
