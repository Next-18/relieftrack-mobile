// Sampled from the ReliefTrack admin dashboard screenshot.
// Filled buttons and small text use the darker greens and blues from that
// same screen so labels stay readable. Do not add one-off greens or blues.

const colors = {
  // Surfaces
  background: '#F2F5FC',
  dirtyWhite: '#F2F5FC',
  dirtyWhiteDarker: '#FFFFFF',
  white: '#FFFFFF',

  // Brand — logo leaf ~#48B848, wordmark green ~#1B8555, icon blue ~#1868A0
  green: '#46B04F',
  greenDark: '#1B8555',
  greenLight: '#D8F3DE',
  blue: '#1868A0',
  blueDark: '#145880',
  blueLight: '#D7E8FC',

  // Neutrals — heading ink is near-navy; secondary text matches the gray labels
  text: '#12182F',
  navy: '#12182F',
  darkBlue: '#12182F',
  darkText: '#12182F',
  muted: '#64748B',
  subtitle: '#64748B',
  label: '#12182F',
  placeholder: '#94A3B8',
  help: '#64748B',
  border: '#E2E8F0',
  borderLight: '#E2E8F0',
  divider: '#E2E8F0',
  disabled: '#CBD5E1',
  inactiveTracker: '#E2E8F0',
  shadow: '#12182F',
  overlay: 'rgba(18, 24, 47, 0.45)',

  // Interactive roles
  primary: '#1B8555',
  primaryDark: '#146B43',
  primaryLight: '#46B04F',
  accent: '#1868A0',
  activeTab: '#D7E8FC',

  // Soft fills
  blueBackground: '#D7E8FC',
  reliefTint: '#D8F3DE',
  successBackground: '#D8F3DE',
  warningBackground: '#FFF0D6',
  warningBorder: '#E8B070',
  errorBackground: '#FDECEC',

  // Status — pending peach and voided red sampled from the dashboard badges
  success: '#1B8555',
  warning: '#F5A000',
  warningText: '#B45309',
  progress: '#F5A000',
  error: '#D02020',
  alertRed: '#D02020',
};

export default colors;
