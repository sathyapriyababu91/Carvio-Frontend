import { StyleSheet, Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// "outlineStyle" only exists on the web; it is invalid on Android / iOS.
const noOutline = isWeb ? { outlineStyle: 'none' } : {};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FC' },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    maxWidth: 1320,
    alignSelf: 'center',
    width: '100%',
  },

  /* ---------- Vehicle type tabs ---------- */
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  typeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 42,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D0D8E8',
    backgroundColor: '#FFFFFF',
  },
  typeTabActive: { backgroundColor: '#121826', borderColor: '#121826' },
  typeTabText: { fontSize: 13, fontWeight: '700', color: '#121826' },
  typeTabTextActive: { color: '#FFFFFF' },

  /* ---------- Top bar: search | fuel badges | sort ---------- */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
    flexWrap: 'wrap',
    zIndex: 20,
  },

  searchPill: {
    width: '100%',
    maxWidth: 320,
    minWidth: 0,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E3E6EC',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { fontSize: 18, marginRight: 10, color: '#6B7280' },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    ...noOutline,
  },

  fuelCenter: { alignItems: 'center', flex: 1, minWidth: 0 },
  discoverText: { fontSize: 15, color: '#6B7280', marginBottom: 8 },
  fuelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  fuelAll: {
    fontSize: 20,
    fontWeight: '800',
    color: '#121826',
    marginRight: 6,
    paddingHorizontal: 4,
  },
  fuelAllInactive: { opacity: 0.55, fontWeight: '600' },
  fuelBadge: {
    minHeight: 36,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#121826',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  fuelBadgeActive: { backgroundColor: '#121826' },
  fuelBadgeText: { fontSize: 14, color: '#121826', fontWeight: '600' },
  fuelBadgeTextActive: { color: '#FFFFFF' },

  sortWrap: { width: 185, zIndex: 30 },
  sortBox: {
    height: 44,
    borderWidth: 1,
    borderColor: '#9AA3B2',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  sortLabelSmall: {
    position: 'absolute',
    top: -8,
    left: 10,
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  sortValue: { fontSize: 15, color: '#121826' },

  // On the web the menu floats over the content below it. On Android / iOS
  // a menu hanging outside its parent cannot be tapped, so there it is part
  // of the normal layout.
  sortMenu: {
    position: isWeb ? 'absolute' : 'relative',
    ...(isWeb ? { top: 48, left: 0, right: 0 } : { marginTop: 6 }),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E6EC',
    borderRadius: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 50,
  },
  sortItem: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14 },
  sortItemActive: { backgroundColor: '#F1F4FA' },
  sortItemText: { fontSize: 13, color: '#121826' },

  /* ---------- Layout ---------- */
  marketplaceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
    width: '100%',
  },

  /* ---------- Left filter panel ---------- */
  filterPanel: { width: 270 },

  filterHeaderDark: {
    backgroundColor: '#121826',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 14,
  },
  filterTitleDark: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  clearAllDark: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },

  accordion: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF3',
    overflow: 'hidden',
    marginBottom: 14,
  },
  accordionHeader: {
    backgroundColor: '#121826',
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  accordionChevron: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  accordionBody: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12 },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingVertical: 10,
  },
  checkLabel: { fontSize: 13.5, color: '#333B4D' },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#6B7280',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: { backgroundColor: '#121826', borderColor: '#121826' },
  checkMark: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', lineHeight: 14 },

  clearSmallButton: {
    alignSelf: 'center',
    marginTop: 8,
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#121826',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  clearSmallText: { fontSize: 13, color: '#121826', fontWeight: '600' },

  filterHint: {
    backgroundColor: '#EEF4FF',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  filterHintIcon: { fontSize: 14, marginRight: 6 },
  filterHintText: { flex: 1, fontSize: 11.5, lineHeight: 16, color: '#667085' },

  /* ---------- Listings ---------- */
  listingsContainer: { flex: 1, minWidth: 0, width: '100%' },

  resultsHeader: { marginBottom: 14 },
  resultsTitle: { fontSize: 20, fontWeight: '800', color: '#121826' },
  resultsCount: { marginTop: 3, fontSize: 12, color: '#6B7A99' },

  // Space between cards comes from "gap" only (no extra card margin).
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },

  vehicleCard: {
    width: '100%',
    minWidth: 0,
    flexGrow: 0,
    flexShrink: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDF0F5',
    shadowColor: '#121826',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },

  // A fixed picture shape keeps the whole vehicle visible on every screen
  // (a fixed height crops it differently on a phone and on a laptop).
  vehicleImageContainer: {
    width: '100%',
    aspectRatio: 1.6,
    backgroundColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  vehicleImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  vehicleImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
  },
  vehicleIcon: { fontSize: 50 },
  vehicleImageText: { marginTop: 7, fontSize: 12, color: '#7A8496' },

  preOwnedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#121826',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preOwnedBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  vehicleDetails: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },

  titleShareRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  vehicleTitle: { fontSize: 18, fontWeight: '800', color: '#121826', flex: 1 },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20, color: '#121826' },

  vehicleSubTitle: {
    marginTop: 3,
    fontSize: 14,
    color: '#7C86A8',
    fontWeight: '500',
  },

  priceContainer: { marginTop: 10, minHeight: 44 },
  vehiclePrice: { fontSize: 22, fontWeight: '800', color: '#121826' },
  otherChargesRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  otherChargesText: { fontSize: 11.5, color: '#6B7280' },
  infoDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#121826',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoDotText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },

  motoSpecsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 6,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: '#F8FAFD',
  },
  specItem: { alignItems: 'center', flex: 1 },
  specIcon: { fontSize: 20, marginBottom: 6 },
  specText: { fontSize: 11.5, fontWeight: '700', color: '#121826', textAlign: 'center' },

  buyNowButton: {
    marginTop: 8,
    minHeight: 50,
    backgroundColor: '#121826',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },

  /* ---------- Empty / error ---------- */
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E6EF',
    paddingVertical: 50,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 42, marginBottom: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#121826' },
  emptyText: {
    marginTop: 7,
    color: '#6B7A99',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyClearButton: {
    marginTop: 17,
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#121826',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  emptyClearText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },
});