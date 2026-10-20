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
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },

  // App header (login / register screens)
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkBlue,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },

  // Form card — matches the admin's .shell / .form-panel feel
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 26,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 8,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.darkBlue,
    letterSpacing: -0.7,
    marginBottom: 5,
  },
  formIntro: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 24,
    lineHeight: 20,
  },

  // Inputs — matches admin .field style
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.label,
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: colors.white,
    color: colors.text,
  },
  multilineInput: {
    height: 84,
    paddingTop: 12,
  },

  // Password field
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
  },
  showPasswordButton: {
    minWidth: 52,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  showPasswordText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // Primary button — matches admin .submit
  primaryButton: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },

  // Register / login prompt rows
  registerPrompt: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 10,
  },
  loginPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: -2,
    marginBottom: 16,
  },
  registerPromptText: {
    color: colors.muted,
    fontSize: 13,
  },
  loginLinkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },

  // Secondary button (outline)
  secondaryButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#c6ded2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  // Back button
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: 14,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  // Show/hide passwords toggle
  passwordVisibilityButton: {
    alignSelf: 'flex-end',
    paddingVertical: 3,
    marginTop: -7,
    marginBottom: 8,
  },
  passwordVisibilityText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // Error text — matches admin --admin-danger
  errorText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },

  // Help text
  helpText: {
    fontSize: 11,
    color: colors.help,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Account number card (post-registration)
  accountNumberCard: {
    backgroundColor: colors.dirtyWhiteDarker,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18,
  },
  accountNumberLabel: {
    color: colors.label,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
  },
  accountNumber: {
    color: colors.darkBlue,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});

export default globalStyles;
