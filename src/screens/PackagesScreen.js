import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import MemberLayout from '../components/MemberLayout';
import PackageIllustration from '../components/PackageIllustrations';
import { EmptyState, ErrorState, LoadingState } from '../components/ScreenState';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import colors from '../styles/colors';

const CATEGORIES = [
  'All',
  'Emergency',
  'Food',
  'General',
  'Hygiene',
  'Medical',
  'Shelter',
  'Water',
];

const DEFAULT_SAMPLE_PACKAGES = [
  {
    id: 'sample-food',
    package_name: 'Family Food Pack',
    category: 'Food',
    description: 'Rice, canned goods, noodles and more.',
    status: 'Available',
    items: [
      { id: '1', item_name: 'Rice (5kg sack)', quantity_per_package: 1, unit: 'sack' },
      { id: '2', item_name: 'Canned Sardines', quantity_per_package: 4, unit: 'cans' },
      { id: '3', item_name: 'Canned Corned Beef', quantity_per_package: 4, unit: 'cans' },
      { id: '4', item_name: 'Instant Noodles', quantity_per_package: 6, unit: 'packs' },
      { id: '5', item_name: 'Coffee Sachets', quantity_per_package: 8, unit: 'packs' },
    ],
  },
  {
    id: 'sample-hygiene',
    package_name: 'Hygiene Kit',
    category: 'Hygiene',
    description: 'Soap, shampoo, personal care items.',
    status: 'Available',
    items: [
      { id: '6', item_name: 'Bath Soap Bars', quantity_per_package: 3, unit: 'bars' },
      { id: '7', item_name: 'Shampoo (Sachets)', quantity_per_package: 6, unit: 'sachets' },
      { id: '8', item_name: 'Toothpaste (150g)', quantity_per_package: 2, unit: 'tubes' },
      { id: '9', item_name: 'Toothbrushes', quantity_per_package: 4, unit: 'pcs' },
      { id: '10', item_name: 'Sanitary Napkins', quantity_per_package: 2, unit: 'packs' },
    ],
  },
  {
    id: 'sample-emergency',
    package_name: 'Emergency Kit',
    category: 'Emergency',
    description: 'Flashlight, first aid, and essentials.',
    status: 'Available',
    items: [
      { id: '11', item_name: 'LED Flashlight & Batteries', quantity_per_package: 1, unit: 'set' },
      { id: '12', item_name: 'First Aid Medical Kit', quantity_per_package: 1, unit: 'kit' },
      { id: '13', item_name: 'Emergency Whistle', quantity_per_package: 2, unit: 'pcs' },
      { id: '14', item_name: 'Thermal Mylar Blanket', quantity_per_package: 2, unit: 'pcs' },
    ],
  },
  {
    id: 'sample-relief',
    package_name: 'Relief Pack',
    category: 'General',
    description: 'Food and hygiene essentials.',
    status: 'Available',
    items: [
      { id: '15', item_name: 'Assorted Canned Goods', quantity_per_package: 6, unit: 'cans' },
      { id: '16', item_name: 'Drinking Water (1L)', quantity_per_package: 4, unit: 'bottles' },
      { id: '17', item_name: 'Hygiene Soap & Towel', quantity_per_package: 1, unit: 'pack' },
      { id: '18', item_name: 'Disaster Relief Backpack', quantity_per_package: 1, unit: 'pc' },
    ],
  },
];

function SearchIcon({ size = 18, color = '#94A3B8' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" />
      <Path d="M21 21l-4.35-4.35" />
    </Svg>
  );
}

function ChevronDownIcon({ size = 18, color = '#64748B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export default function PackagesScreen() {
  const { data, loading, refreshing, errors, refresh } = useBeneficiaryData();
  const apiPackages = useMemo(() => data.packages || [], [data.packages]);
  const isLoading = loading.packages;
  const isRefreshing = refreshing.packages;
  const error = errors.packages;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePackage, setActivePackage] = useState(null);

  // Combine API packages with default mockup sample packages if API list is empty or minimal
  const allPackages = useMemo(() => {
    if (apiPackages && apiPackages.length > 0) {
      // Check if sample packages are needed or if API already has complete items
      const hasFood = apiPackages.some((p) => String(p.package_name).toLowerCase().includes('food'));
      if (!hasFood) {
        return [...apiPackages, ...DEFAULT_SAMPLE_PACKAGES];
      }
      return apiPackages;
    }
    return DEFAULT_SAMPLE_PACKAGES;
  }, [apiPackages]);

  // Filter packages based on search query and category
  const filteredPackages = useMemo(() => {
    return allPackages.filter((pkg) => {
      const name = String(pkg.package_name || '').toLowerCase();
      const desc = String(pkg.description || '').toLowerCase();
      const cat = String(pkg.category || 'General').toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch = !query || name.includes(query) || desc.includes(query) || cat.includes(query);
      const matchesCategory =
        selectedCategory === 'All' || cat === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [allPackages, searchQuery, selectedCategory]);

  return (
    <MemberLayout
      title="Packages"
      onRefresh={() => refresh('packages')}
      refreshing={isRefreshing}
    >
      {/* ── Search Input ── */}
      <View style={styles.searchBar}>
        <SearchIcon size={18} color="#94A3B8" />
        <TextInput
          accessibilityLabel="Search packages"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search packages..."
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setSearchQuery('')}
            hitSlop={8}
            style={styles.searchClearBtn}
          >
            <Text style={styles.searchClearText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ── Category Selector Dropdown ── */}
      <View style={styles.categoryDropdownWrapper}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Category filter: ${selectedCategory}`}
          activeOpacity={0.8}
          onPress={() => setIsDropdownOpen((open) => !open)}
          style={[styles.dropdownTrigger, isDropdownOpen && styles.dropdownTriggerOpen]}
        >
          <Text style={styles.dropdownTriggerText}>
            {selectedCategory}
          </Text>
          <ChevronDownIcon size={18} color="#1868A0" />
        </TouchableOpacity>

        {/* Dropdown Options List */}
        {isDropdownOpen ? (
          <View style={styles.dropdownMenu}>
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${category} category`}
                  onPress={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}
                >
                  <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextSelected]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>

      {error ? <ErrorState message={error} onRetry={() => refresh('packages')} /> : null}
      {isLoading && !allPackages.length ? <LoadingState message="Loading available packages…" /> : null}

      {/* ── 2-Column Grid of Package Cards ── */}
      {filteredPackages.length > 0 ? (
        <View style={styles.grid}>
          {filteredPackages.map((item) => {
            const packageName = item.package_name || 'Relief Package';
            const description = item.description || 'Essential relief supplies and care items.';
            const category = item.category || 'General';

            return (
              <View key={item.id} style={styles.card}>
                {/* Top Illustration */}
                <View style={styles.illustrationWrap}>
                  <PackageIllustration
                    category={category}
                    name={packageName}
                    width="100%"
                    height={88}
                  />
                </View>

                {/* Package Name */}
                <Text numberOfLines={1} style={styles.packageName}>
                  {packageName}
                </Text>

                {/* Description */}
                <Text numberOfLines={2} style={styles.packageDescription}>
                  {description}
                </Text>

                {/* Available Badge */}
                <View style={styles.badgeAvailable}>
                  <Text style={styles.badgeAvailableText}>Available</Text>
                </View>

                {/* View Details Button */}
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`View details for ${packageName}`}
                  activeOpacity={0.75}
                  onPress={() => setActivePackage(item)}
                  style={styles.viewDetailsButton}
                >
                  <Text style={styles.viewDetailsText}>View Details →</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ) : null}

      {/* Empty State when no results */}
      {!isLoading && !error && filteredPackages.length === 0 ? (
        <EmptyState
          title="No packages found"
          message={`No packages match "${searchQuery || selectedCategory}". Try selecting another category or clearing your search.`}
        />
      ) : null}

      {/* ── Package Details Modal ── */}
      <Modal
        animationType="fade"
        transparent
        visible={Boolean(activePackage)}
        onRequestClose={() => setActivePackage(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {activePackage ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Large Illustration in Modal */}
                <View style={styles.modalIllustrationWrap}>
                  <PackageIllustration
                    category={activePackage.category}
                    name={activePackage.package_name}
                    width="100%"
                    height={110}
                  />
                </View>

                {/* Title & Category */}
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>
                    {activePackage.package_name || 'Relief Package'}
                  </Text>
                  <View style={styles.modalCategoryBadge}>
                    <Text style={styles.modalCategoryBadgeText}>
                      {activePackage.category || 'General'}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                <View style={styles.modalBadgeRow}>
                  <View style={styles.badgeAvailable}>
                    <Text style={styles.badgeAvailableText}>
                      {activePackage.status || 'Available'}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                {activePackage.description ? (
                  <Text style={styles.modalDescription}>
                    {activePackage.description}
                  </Text>
                ) : null}

                {/* Inside this package */}
                <View style={styles.contentsSection}>
                  <Text style={styles.contentsHeading}>Inside this package</Text>
                  {Array.isArray(activePackage.items) && activePackage.items.length > 0 ? (
                    activePackage.items.map((item, idx) => {
                      const qty = item.quantity_per_package ?? item.quantity ?? 1;
                      const unit = item.unit ? ` ${item.unit}` : '';
                      return (
                        <View key={item.id ?? idx} style={styles.contentItemRow}>
                          <Text style={styles.contentBullet}>•</Text>
                          <Text style={styles.contentText}>
                            {qty}{unit} {item.item_name || 'Item'}
                          </Text>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.contentEmptyText}>
                      Standard relief assortment. Contact your Barangay Administrator for detailed allocation.
                    </Text>
                  )}
                </View>

                {/* Pickup helper notice */}
                <View style={styles.pickupHelper}>
                  <Text style={styles.pickupHelperText}>
                    📦 Assigned packages will appear under My Relief. Show your QR code using the center button when claiming.
                  </Text>
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => setActivePackage(null)}
                  style={styles.modalCloseBtn}
                >
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  searchClearBtn: {
    padding: 4,
  },
  searchClearText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
  categoryDropdownWrapper: {
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownTrigger: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownTriggerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownTriggerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  dropdownItemSelected: {
    backgroundColor: '#1868A0',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  dropdownItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  card: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  illustrationWrap: {
    height: 90,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  packageName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
    lineHeight: 19,
  },
  packageDescription: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 4,
    minHeight: 32,
  },
  badgeAvailable: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 10,
  },
  badgeAvailableText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '600',
  },
  viewDetailsButton: {
    backgroundColor: '#EBF3FE',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    color: '#1868A0',
    fontSize: 12,
    fontWeight: '700',
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
    maxWidth: 420,
    maxHeight: '85%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  modalIllustrationWrap: {
    height: 110,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  modalCategoryBadge: {
    backgroundColor: '#EBF3FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalCategoryBadgeText: {
    color: '#1868A0',
    fontSize: 12,
    fontWeight: '600',
  },
  modalBadgeRow: {
    marginTop: 8,
  },
  modalDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginTop: 10,
  },
  contentsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  contentsHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  contentItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingVertical: 3,
  },
  contentBullet: {
    color: '#1868A0',
    fontSize: 14,
    lineHeight: 18,
  },
  contentText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
  },
  contentEmptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  pickupHelper: {
    backgroundColor: '#EDF5FE',
    borderColor: '#D0E1FD',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  pickupHelperText: {
    color: '#1868A0',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  modalCloseBtn: {
    backgroundColor: '#1868A0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
