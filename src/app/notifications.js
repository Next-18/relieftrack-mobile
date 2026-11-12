import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MemberLayout from '../components/MemberLayout';
import { EmptyState } from '../components/ScreenState';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';

export default function NotificationsScreen() {
  const { data, markNotificationRead, refresh, refreshing } = useBeneficiaryData();
  const notifications = data.updates || data.notifications || [];

  return (
    <MemberLayout
      title="Announcements"
      onRefresh={() => refresh('notifications')}
      refreshing={refreshing.notifications}
    >
      <View style={styles.container}>
        {notifications.length > 0 ? (
          notifications.map((item) => {
            const isRead = Boolean(item.read_at) || item.is_announcement;
            return (
              <View
                key={`${item.is_announcement ? 'announcement' : 'notification'}-${item.id}`}
                style={[styles.notificationCard, !isRead && styles.notificationCardUnread]}
              >
                <View style={styles.iconBadge}>
                  <View style={styles.dot} />
                </View>
                <View style={styles.content}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.message}>{item.message || item.body}</Text>
                  {item.author ? <Text style={styles.message}>Posted by {item.author}</Text> : null}
                  {!isRead ? (
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={() => !item.is_announcement && markNotificationRead?.(item.id)}
                      style={styles.markReadBtn}
                    >
                      <Text style={styles.markReadText}>Mark as read</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            );
          })
        ) : (
          <EmptyState
            title="No announcements yet"
            message="Relief assignment and pickup announcements from your Barangay will appear here."
          />
        )}
      </View>
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  notificationCardUnread: {
    backgroundColor: '#EDF5FE',
    borderColor: '#D0E1FD',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D6E6FD',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1868A0',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  markReadBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  markReadText: {
    color: '#1868A0',
    fontSize: 12,
    fontWeight: '700',
  },
});
