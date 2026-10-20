import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusPill, formatDate } from './MemberComponents';
import colors from '../styles/colors';

export function DistributionCard({ distribution, compact = false }) {
  const packageName = distribution.relief_package?.package_name
    || distribution.package_name
    || 'Relief package';

  const releaseDate = formatDate(distribution.date_released ?? distribution.date_distributed);

  return (
    <View style={[styles.row, compact && styles.compactRow]}>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text numberOfLines={2} style={styles.rowTitle}>{packageName}</Text>
          <StatusPill status={distribution.status} />
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.dateText}>{releaseDate}</Text>
        </View>
        {distribution.notes ? (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{distribution.notes}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronIcon}>›</Text>
      </View>
    </View>
  );
}

export function PackageCard({ packageItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <View style={styles.titleWrap}>
            <Text style={styles.rowTitle}>{packageItem.package_name || 'Relief package'}</Text>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{packageItem.category || 'General Aid'}</Text>
            </View>
          </View>
          <StatusPill status={packageItem.status || 'Available'} />
        </View>
        {packageItem.description ? (
          <Text style={styles.description}>{packageItem.description}</Text>
        ) : null}
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronIcon}>›</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  compactRow: {
    paddingVertical: 14,
  },
  rowContent: {
    flex: 1,
  },
  rowTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    gap: 6,
  },
  rowTitle: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dateText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '400',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.reliefTint,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '400',
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  noteBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  noteText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  chevron: {
    marginLeft: 12,
    paddingHorizontal: 4,
  },
  chevronIcon: {
    color: colors.muted,
    fontSize: 24,
    fontWeight: '300',
  },
});
