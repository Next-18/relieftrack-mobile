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
    <View style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.cardTop}>
        <Text numberOfLines={2} style={styles.cardTitle}>{packageName}</Text>
        <StatusPill status={distribution.status} />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.dateBadge}>📅  {releaseDate}</Text>
      </View>
      {distribution.notes ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{distribution.notes}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function PackageCard({ packageItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.titleWrap}>
          <Text style={styles.cardTitle}>{packageItem.package_name || 'Relief package'}</Text>
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
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#16231d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  compactCard: {
    padding: 14,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    color: colors.darkBlue,
    flex: 1,
    fontSize: 15.5,
    fontWeight: '800',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateBadge: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.reliefTint,
    borderColor: '#ccecd6',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  description: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  noteBox: {
    backgroundColor: colors.dirtyWhiteDarker,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 10,
  },
  noteText: {
    color: colors.text,
    fontSize: 12.5,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
