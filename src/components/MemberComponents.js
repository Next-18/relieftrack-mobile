import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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

function BellIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#40332B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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

export function AnnouncementSection({ notifications = [], onMarkRead, expanded = false, onToggleExpanded }) {
  const first = notifications[0];
  const hiddenCount = Math.max(notifications.length - 1, 0);

  return (
    <View style={styles.announcementSection}>
      <Text style={styles.announcementHeading}>Announcements</Text>

      {!first ? (
        <View style={styles.announcementEmpty}>
          <Text style={styles.announcementEmptyText}>No announcements yet. Relief assignment and pickup updates will appear here.</Text>
        </View>
      ) : (
        <>
          <AnnouncementCard notification={first} onMarkRead={onMarkRead}>
            {hiddenCount > 0 ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={onToggleExpanded}
                style={styles.showMoreButton}
              >
                <Text style={styles.showMoreText}>
                  {expanded ? 'Show less' : `Show ${hiddenCount} more`} {expanded ? '⌃' : '⌄'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </AnnouncementCard>
          {expanded
            ? notifications.slice(1).map((notification) => (
                <AnnouncementCard key={notification.id} notification={notification} onMarkRead={onMarkRead} />
              ))
            : null}
        </>
      )}
    </View>
  );
}

const STATUS_GLYPHS = {
  released: { icon: 'check', color: colors.accent, stroke: 3.4 },
  available: { icon: 'check', color: colors.accent, stroke: 3.4 },
  pending: { icon: 'clock', color: colors.progress, stroke: 2.8 },
  cancelled: { icon: 'x', color: '#D64545', stroke: 3.2 },
};

export function StatusPill({ status }) {
  const normalizedStatus = String(status || 'Unknown').toLowerCase();

  if (normalizedStatus === 'active') {
    return (
      <View style={styles.statusPill}>
        <View style={styles.dotPositive} />
        <Text style={styles.statusPillText}>{status || 'Active'}</Text>
      </View>
    );
  }

  const glyph = STATUS_GLYPHS[normalizedStatus] || { icon: 'minus', color: colors.muted, stroke: 3 };

  return (
    <View style={styles.statusIconRow}>
      <View style={[styles.statusGlyph, { borderColor: glyph.color }]}>
        <Svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke={glyph.color} strokeWidth={glyph.stroke} strokeLinecap="round" strokeLinejoin="round">
          {glyph.icon === 'clock' ? <Path d="M12 6v6l4 2" /> : null}
          {glyph.icon === 'check' ? <Path d="M20 6L9 17l-5-5" /> : null}
          {glyph.icon === 'x' ? <Path d="M18 6L6 18M6 6l12 12" /> : null}
          {glyph.icon === 'minus' ? <Path d="M5 12h14" /> : null}
        </Svg>
      </View>
      <Text style={[styles.statusLabel, { color: glyph.color }]}>
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
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  bellWrap: {
    padding: 3,
  },
  bellBadge: {
    alignItems: 'center',
    backgroundColor: '#D64545',
    borderColor: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
  showMoreButton: {
    alignItems: 'center',
    borderTopColor: '#F1D38B',
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
  showMoreText: {
    color: '#674600',
    fontSize: 12,
    fontWeight: '700',
  },
  announcementCard: {
    backgroundColor: '#FFF8E8',
    borderColor: '#F1D38B',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    padding: 10,
  },
  announcementTitle: { color: '#674600', fontSize: 13, fontWeight: '700' },
  announcementText: { color: '#7B5B1E', fontSize: 12, lineHeight: 16, marginTop: 3 },
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
    backgroundColor: '#FFF8E8',
    borderColor: '#F1D38B',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    padding: 10,
  },
  pendingNoticeIcon: {
    alignItems: 'center',
    backgroundColor: '#F6E5B7',
    borderRadius: 8,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  pendingNoticeIconText: { color: '#855500', fontSize: 14, fontWeight: '700' },
  pendingNoticeCopy: { flex: 1, gap: 3 },
  pendingNoticeTitle: { color: '#674600', fontSize: 13, fontWeight: '700' },
  pendingNoticeText: { color: '#7B5B1E', fontSize: 12, lineHeight: 16 },
  pickupQrButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 6,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickupQrButtonText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  markReadButton: { alignSelf: 'flex-start', marginTop: 4 },
  markReadText: { color: '#674600', fontSize: 11, fontWeight: '700' },
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
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: colors.reliefTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  dotPositive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  statusPillText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  statusIconRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 18,
  },
  statusGlyph: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    height: 14,
    justifyContent: 'center',
    width: 14,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    textTransform: 'capitalize',
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
