import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export function AnnouncementSection({ notifications = [], onMarkRead }) {
  const latestAnnouncements = notifications.slice(0, 5);

  return (
    <View style={styles.announcementSection}>
      <Text style={styles.announcementHeading}>Announcements</Text>
      {latestAnnouncements.length ? latestAnnouncements.map((notification) => (
        <View key={notification.id} style={styles.announcementCard}>
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
        </View>
      )) : (
        <View style={styles.announcementEmpty}>
          <Text style={styles.announcementEmptyText}>No announcements yet. Relief assignment and pickup updates will appear here.</Text>
        </View>
      )}
    </View>
  );
}

export function StatusPill({ status }) {
  const normalizedStatus = String(status || 'Unknown').toLowerCase();
  const isPositive = ['released', 'active', 'available'].includes(normalizedStatus);
  const isPending = normalizedStatus === 'pending';

  return (
    <View style={[
      styles.statusPill,
      isPositive && styles.positivePill,
      isPending && styles.pendingPill,
      !isPositive && !isPending && styles.neutralPill,
    ]}>
      <View style={[
        styles.dot,
        isPositive && styles.dotPositive,
        isPending && styles.dotPending,
        !isPositive && !isPending && styles.dotNeutral,
      ]} />
      <Text style={[
        styles.statusText,
        isPositive && styles.positiveText,
        isPending && styles.pendingText,
        !isPositive && !isPending && styles.neutralText,
      ]}>
        {status || 'Unknown'}
      </Text>
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  announcementCard: {
    backgroundColor: '#FFF8E8',
    borderColor: '#F1D38B',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
  },
  announcementTitle: { color: '#674600', fontSize: 14, fontWeight: '700' },
  announcementText: { color: '#7B5B1E', fontSize: 13, lineHeight: 19, marginTop: 4 },
  announcementEmpty: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  announcementEmptyText: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  pendingNotice: {
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E8',
    borderColor: '#F1D38B',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    marginBottom: 16,
    padding: 14,
  },
  pendingNoticeIcon: {
    alignItems: 'center',
    backgroundColor: '#F6E5B7',
    borderRadius: 12,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  pendingNoticeIconText: { color: '#855500', fontSize: 16, fontWeight: '700' },
  pendingNoticeCopy: { flex: 1, gap: 4 },
  pendingNoticeTitle: { color: '#674600', fontSize: 14, fontWeight: '700' },
  pendingNoticeText: { color: '#7B5B1E', fontSize: 13, lineHeight: 19 },
  pickupQrButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 10,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pickupQrButtonText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  markReadButton: { alignSelf: 'flex-start', marginTop: 5 },
  markReadText: { color: '#674600', fontSize: 12, fontWeight: '700' },
  pageHeading: {
    marginBottom: 16,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  pageSubtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotPositive: {
    backgroundColor: colors.accent,
  },
  dotPending: {
    backgroundColor: colors.progress,
  },
  dotNeutral: {
    backgroundColor: colors.muted,
  },
  positivePill: {
    backgroundColor: colors.reliefTint,
  },
  pendingPill: {
    backgroundColor: colors.warningBackground,
  },
  neutralPill: {
    backgroundColor: colors.dirtyWhiteDarker,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  positiveText: {
    color: colors.accent,
  },
  pendingText: {
    color: colors.progress,
  },
  neutralText: {
    color: colors.muted,
  },
  detailRow: {
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
});
