import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MemberLayout from '../components/MemberLayout';
import PackageBoxIcon from '../components/PackageBoxIcon';
import { EmptyState, ErrorState, LoadingState } from '../components/ScreenState';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import colors from '../styles/colors';

function ChevronRight({ size = 16, color = '#94A3B8' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

function formatDistributionDateTime(distribution) {
  const raw = distribution.created_at || distribution.date_released || distribution.date_distributed;
  if (!raw) return 'Date unavailable';

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return String(raw).slice(0, 10);
  }

  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hasTime = String(raw).includes('T') || (String(raw).includes(':') && String(raw).length > 10);
  if (hasTime) {
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} • ${timeStr}`;
  }

  return dateStr;
}

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'released', label: 'Released' },
  { id: 'voided', label: 'Voided' },
];

export default function DistributionsScreen() {
  const { data, loading, refreshing, errors, refresh } = useBeneficiaryData();
  const distributions = useMemo(() => data.distributions || [], [data.distributions]);
  const isLoading = loading.distributions;
  const isRefreshing = refreshing.distributions;
  const error = errors.distributions;

  const [activeTab, setActiveTab] = useState('all');
  const [selectedDistribution, setSelectedDistribution] = useState(null);

  // Filter distributions by active status tab
  const filteredDistributions = useMemo(() => {
    if (activeTab === 'all') return distributions;
    return distributions.filter(
      (item) => String(item.status || '').toLowerCase() === activeTab
    );
  }, [distributions, activeTab]);

  return (
    <MemberLayout
      title="My Relief"
      onRefresh={() => refresh('distributions')}
      refreshing={isRefreshing}
    >
      {/* ── Status Filter Tabs ── */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} filter tab`}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabItem}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {isActive ? <View style={styles.activeTabIndicator} /> : <View style={styles.tabIndicatorPlaceholder} />}
            </Pressable>
          );
        })}
      </View>

      {error ? <ErrorState message={error} onRetry={() => refresh('distributions')} /> : null}
      {isLoading && !distributions.length ? <LoadingState message="Loading your distribution history…" /> : null}

      {/* ── Distributions Card List ── */}
      {filteredDistributions.length > 0 ? (
        <View style={styles.listContainer}>
          {filteredDistributions.map((item) => {
            const packageName = item.relief_package?.package_name || item.package_name || 'Relief Package';
            const itemsList = item.relief_package?.items || item.items || [];
            const itemCount = itemsList.length > 0 ? itemsList.length : 1;
            const subtitleText = `Package • ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
            const dateTimeLabel = formatDistributionDateTime(item);

            const statusNorm = String(item.status || 'Released').toLowerCase();
            const isPending = statusNorm === 'pending' || statusNorm === 'assigned';
            const isVoided = statusNorm === 'voided' || statusNorm === 'cancelled' || statusNorm === 'canceled';

            let pillBg = '#DCFCE7';
            let pillText = '#16A34A';
            let statusLabel = 'Released';

            if (isPending) {
              pillBg = '#FEF3C7';
              pillText = '#D97706';
              statusLabel = 'Pending';
            } else if (isVoided) {
              pillBg = '#FEE2E2';
              pillText = '#DC2626';
              statusLabel = 'Voided';
            }

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${packageName}, status ${statusLabel}`}
                onPress={() => setSelectedDistribution(item)}
                style={styles.card}
              >
                {/* Left Cardboard Box Icon */}
                <PackageBoxIcon status={item.status} size={46} />

                {/* Middle Info Column */}
                <View style={styles.cardCenter}>
                  <Text numberOfLines={1} style={styles.cardTitle}>
                    {packageName}
                  </Text>
                  <Text numberOfLines={1} style={styles.cardSubtitle}>
                    {subtitleText}
                  </Text>
                  <Text numberOfLines={1} style={styles.cardDateTime}>
                    {dateTimeLabel}
                  </Text>
                </View>

                {/* Right Status Badge and Chevron */}
                <View style={styles.cardRight}>
                  <View style={[styles.statusBadge, { backgroundColor: pillBg }]}>
                    <Text style={[styles.statusBadgeText, { color: pillText }]}>
                      {statusLabel}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {/* Empty State when no items in active tab */}
      {!isLoading && !error && filteredDistributions.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'all'
              ? 'No relief distributions recorded'
              : `No ${activeTab} relief distributions`
          }
          message={
            activeTab === 'pending'
              ? 'When relief goods are assigned to you by your Barangay, they will appear here as pending.'
              : activeTab === 'released'
              ? 'Packages you have successfully claimed will appear here.'
              : 'No relief distributions match this filter.'
          }
        />
      ) : null}

      {/* ── Distribution Details Modal ── */}
      <Modal
        animationType="fade"
        transparent
        visible={Boolean(selectedDistribution)}
        onRequestClose={() => setSelectedDistribution(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {selectedDistribution ? (
              <>
                <View style={styles.modalHeader}>
                  <PackageBoxIcon status={selectedDistribution.status} size={54} />
                  <View style={styles.modalHeaderCopy}>
                    <Text style={styles.modalTitle}>
                      {selectedDistribution.relief_package?.package_name || selectedDistribution.package_name || 'Relief Package'}
                    </Text>
                    <View style={styles.modalPillWrap}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              String(selectedDistribution.status).toLowerCase() === 'pending'
                                ? '#FEF3C7'
                                : String(selectedDistribution.status).toLowerCase() === 'voided'
                                ? '#FEE2E2'
                                : '#DCFCE7',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            {
                              color:
                                String(selectedDistribution.status).toLowerCase() === 'pending'
                                ? '#D97706'
                                : String(selectedDistribution.status).toLowerCase() === 'voided'
                                ? '#DC2626'
                                : '#16A34A',
                            },
                          ]}
                        >
                          {selectedDistribution.status || 'Released'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Date & Time</Text>
                    <Text style={styles.modalDetailValue}>
                      {formatDistributionDateTime(selectedDistribution)}
                    </Text>
                  </View>

                  {selectedDistribution.notes ? (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Notes</Text>
                      <Text style={styles.modalDetailValue}>
                        {selectedDistribution.notes}
                      </Text>
                    </View>
                  ) : null}

                  {String(selectedDistribution.status).toLowerCase() === 'pending' ? (
                    <View style={styles.pendingPickupNotice}>
                      <Text style={styles.pendingPickupNoticeText}>
                        📍 Collection is pending. Present your QR code to relief staff using the center QR button when collecting this package.
                      </Text>
                    </View>
                  ) : null}
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => setSelectedDistribution(null)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#1868A0',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    height: 3,
    width: '65%',
    backgroundColor: '#1868A0',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabIndicatorPlaceholder: {
    height: 3,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCenter: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  cardDateTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
    marginTop: 4,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 16,
  },
  modalHeaderCopy: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalPillWrap: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  modalBody: {
    paddingVertical: 16,
    gap: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalDetailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalDetailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0F172A',
    maxWidth: '60%',
    textAlign: 'right',
  },
  pendingPickupNotice: {
    backgroundColor: '#EDF5FE',
    borderColor: '#D0E1FD',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  pendingPickupNoticeText: {
    color: '#1868A0',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  modalCloseButton: {
    backgroundColor: '#1868A0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
