import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusPill, formatDate } from './MemberComponents';
import colors from '../styles/colors';

export function DistributionCard({ distribution, compact = false }) {
  const packageName = distribution.relief_package?.package_name
    || distribution.package_name
    || 'Relief package';

  const releaseDate = formatDate(distribution.date_released ?? distribution.date_distributed);
  const dateLabel = distribution.status === 'Pending' ? `Assigned ${releaseDate}` : `Released ${releaseDate}`;

  return (
    <View style={[styles.row, compact && styles.compactRow]}>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text numberOfLines={2} style={styles.rowTitle}>{packageName}</Text>
          <StatusPill status={distribution.status} />
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.dateText}>{dateLabel}</Text>
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
  const [isExpanded, setIsExpanded] = useState(false);
  const items = Array.isArray(packageItem.items) ? packageItem.items : [];

  return (
    <View style={styles.packageCard}>
      <TouchableOpacity
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`${packageItem.package_name || 'Relief package'}, ${isExpanded ? 'hide' : 'view'} contents`}
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded((expanded) => !expanded)}
        style={styles.packageRow}
      >
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
          <Text style={styles.packageAction}>{isExpanded ? 'Hide contents' : 'Tap to see package contents'}</Text>
        </View>
        <View style={styles.chevron}>
          <Text style={styles.chevronIcon}>{isExpanded ? '⌃' : '›'}</Text>
        </View>
      </TouchableOpacity>
      {isExpanded ? (
        <View style={styles.packageContents}>
          <Text style={styles.contentsTitle}>Inside this package</Text>
          {items.length ? items.map((item) => {
            const quantity = Number(item.quantity_per_package ?? 1);
            const unit = item.unit ? ` ${item.unit}` : '';
            return (
              <View key={item.id ?? item.item_name} style={styles.contentsRow}>
                <Text style={styles.contentsBullet}>•</Text>
                <Text style={styles.contentsText}>{quantity}{unit} {item.item_name || 'Item'}</Text>
              </View>
            );
          }) : (
            <Text style={styles.contentsEmpty}>Package contents have not been listed yet. Contact your Barangay Administrator for details.</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  packageCard: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  packageRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  row: {
    minHeight: 56,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  compactRow: {
    paddingVertical: 10,
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
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    color: colors.muted,
    fontSize: 13,
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
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  packageAction: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  packageContents: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  contentsTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  contentsRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 8, paddingVertical: 4 },
  contentsBullet: { color: colors.accent, fontSize: 16, lineHeight: 20 },
  contentsText: { color: colors.text, flex: 1, fontSize: 14, lineHeight: 20 },
  contentsEmpty: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  noteBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
  },
  noteText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
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
