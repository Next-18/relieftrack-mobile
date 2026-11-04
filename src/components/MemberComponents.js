import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import colors from '../styles/colors';

export function PageHeading({ title, subtitle }) {
  return (
    <View style={styles.pageHeading}>
      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionHeading({ title, trailing }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {trailing}
    </View>
  );
}

export function PendingAssignmentNotice({ assignments = [], onShowQr }) {
  if (!assignments.length) return null;
  const packageNames = [...new Set(assignments.map((item) => item.relief_package?.package_name || item.package_name || 'Relief package'))];

  return (
    <View style={styles.pendingNotice}>
      <View style={styles.pendingNoticeIcon}><Text style={styles.pendingNoticeIconText}>!</Text></View>
      <View style={styles.pendingNoticeCopy}>
        <Text style={styles.pendingNoticeTitle}>{assignments.length === 1 ? 'A relief package is assigned to you' : `${assignments.length} relief packages are assigned to you`}</Text>
        <Text style={styles.pendingNoticeText}>{packageNames.join(', ')} · Pending pickup. Show your QR code to relief staff when collecting it.</Text>
        {onShowQr ? (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onShowQr}
            style={styles.pickupQrButton}
          >
            <Text style={styles.pickupQrButtonText}>Show pickup QR code</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

function ClockIcon({ size = 16, color = colors.warning }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 6v6l4 2" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 16, color = colors.success }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9 12l2 2 4-4" />
    </Svg>
  );
}

function XCircleIcon({ size = 16, color = colors.error }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M15 9l-6 6" />
      <Path d="M9 9l6 6" />
    </Svg>
  );
}

function BellIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors.blue} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

export function NotificationBell({ unreadCount = 0 }) {
  return (
    <View style={styles.bellWrap}>
      <BellIcon />
      {unreadCount > 0 ? (
        <View style={styles.bellBadge}>
          <Text style={styles.bellBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

function AnnouncementCard({ notification, onMarkRead, children }) {
  return (
    <View style={styles.announcementCard}>
      <Text style={styles.announcementTitle}>{notification.title}</Text>
      <Text style={styles.announcementText}>{notification.message}</Text>
      {!notification.read_at ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => onMarkRead?.(notification.id)}
          style={styles.markReadButton}
        >
          <Text style={styles.markReadText}>Mark as read</Text>
        </TouchableOpacity>
      ) : null}
      {children}
    </View>
  );
}

export function AnnouncementSection({ notifications = [], onMarkRead }) {
  const first = notifications[0];

  return (
    <View style={styles.announcementSection}>
      <Text style={styles.announcementHeading}>Announcements</Text>

      {!first ? (
        <View style={styles.announcementEmpty}>
          <Text style={styles.announcementEmptyText}>No announcements yet. Relief assignment and pickup updates will appear here.</Text>
        </View>
      ) : (
        <AnnouncementCard notification={first} onMarkRead={onMarkRead} />
      )}
    </View>
  );
}

const STATUS_TONES = {
  released: 'success',
  available: 'success',
  active: 'success',
  completed: 'success',
  fulfilled: 'success',
  pending: 'pending',
  assigned: 'pending',
  voided: 'danger',
  cancelled: 'danger',
  canceled: 'danger',
};

const STATUS_COLORS = {
  success: colors.success,
  pending: colors.warning,
  danger: colors.error,
  neutral: colors.muted,
};

export function StatusPill({ status }) {
  const tone = STATUS_TONES[String(status || '').toLowerCase()] || 'neutral';
  const color = STATUS_COLORS[tone];

  let IconComponent;
  const statusLower = String(status || '').toLowerCase();

  if (statusLower === 'active') {
    // Show just a green dot for active status
    return <View style={[styles.statusDot, { backgroundColor: color }]} />;
  }

  if (tone === 'pending') {
    IconComponent = ClockIcon;
  } else if (tone === 'success') {
    IconComponent = CheckCircleIcon;
  } else if (tone === 'danger') {
    IconComponent = XCircleIcon;
  }

  return (
    <View style={styles.statusMark}>
      {IconComponent ? <IconComponent color={color} /> : <View style={[styles.statusDot, { backgroundColor: color }]} />}
      <Text style={[styles.statusMarkText, { color }]}>{status || 'Unknown'}</Text>
    </View>
  );
}

export function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>{value || 'Not provided'}</Text>
    </View>
  );
}

export function formatDate(value) {
  if (!value) return 'Date unavailable';
  const datePart = String(value).slice(0, 10);
  const date = new Date(datePart + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return datePart;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const styles = StyleSheet.create({
  announcementSection: {
    marginBottom: 4,
  },
  announcementHeading: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  bellWrap: {
    padding: 3,
  },
  bellBadge: {
    alignItems: 'center',
    backgroundColor: colors.error,
    borderColor: colors.white,
    borderRadius: 7,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    minWidth: 16,
    paddingHorizontal: 2,
    position: 'absolute',
    right: -2,
    top: -3,
  },
  bellBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
  showMoreButton: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
  showMoreText: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '700',
  },
  announcementCard: {
    backgroundColor: colors.blueLight,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    padding: 10,
  },
  announcementTitle: { color: colors.text, fontSize: 13, fontWeight: '700' },
  announcementText: { color: colors.muted, fontSize: 12, lineHeight: 16, marginTop: 3 },
  announcementEmpty: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
  },
  announcementEmptyText: { color: colors.muted, fontSize: 12, lineHeight: 16 },
  pendingNotice: {
    alignItems: 'flex-start',
    backgroundColor: colors.warningBackground,
    borderColor: colors.warningBorder,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  pendingNoticeIcon: {
    alignItems: 'center',
    backgroundColor: colors.warningBorder,
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  pendingNoticeIconText: { color: colors.warningText, fontSize: 18, fontWeight: '700' },
  pendingNoticeCopy: { flex: 1, gap: 4 },
  pendingNoticeTitle: { color: colors.warningText, fontSize: 14, fontWeight: '600' },
  pendingNoticeText: { color: colors.warningText, fontSize: 12, lineHeight: 16 },
  pickupQrButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pickupQrButtonText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  markReadButton: { alignSelf: 'flex-start', marginTop: 4 },
  markReadText: { color: colors.blue, fontSize: 11, fontWeight: '700' },
  pageHeading: {
    marginBottom: 10,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  pageSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  statusMark: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexShrink: 0,
    gap: 6,
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusMarkText: {
    fontSize: 13,
    fontWeight: '700',
  },
  detailRow: {
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 3,
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});
