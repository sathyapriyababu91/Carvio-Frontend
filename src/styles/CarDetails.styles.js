import { StyleSheet } from 'react-native';

const NAVY = '#0F1C45';
const NAVY_SOFT = '#12224F';
const BLUE = '#2F6FED';
const MUTED = '#6B7A99';
const BORDER = '#E4EAF4';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FC' },
  contentContainer: { paddingBottom: 40 },

  inner: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  /* ---------- Top bar ---------- */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 20, color: NAVY_SOFT, fontWeight: '700' },
  topBarTitle: { fontSize: 18, fontWeight: '800', color: NAVY_SOFT },
  topActions: { flexDirection: 'row', gap: 10 },
  topActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topActionIcon: { fontSize: 20, color: NAVY_SOFT },
  topActionIconActive: { color: '#E5383B' },

  /* ---------- Main two-column layout ---------- */
  mainRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 28 },
  leftCol: { flex: 1.55, minWidth: 0, gap: 20 },
  rightCol: { flex: 1, minWidth: 0, gap: 20, position: 'sticky', top: 16 },

  /* ---------- Gallery ---------- */
  gallery: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E8EEF8',
    height: 480,
    position: 'relative',
  },
  mainImage: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
  },
  placeholderIcon: { fontSize: 64 },
  placeholderText: { marginTop: 8, fontSize: 13, color: '#7A8496' },

  usedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: NAVY,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  usedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(15,28,69,0.78)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  imageCounterText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: { left: 14 },
  arrowRight: { right: 14 },
  arrowText: { fontSize: 18, color: NAVY_SOFT, fontWeight: '800' },

  thumbnailContainer: { gap: 10, paddingVertical: 2 },
  thumbnailButton: {
    width: 92,
    height: 66,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.7,
  },
  thumbnailButtonActive: { borderColor: BLUE, opacity: 1 },
  thumbnailImage: { width: '100%', height: '100%' },

  /* ---------- Cards ---------- */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 26,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: NAVY_SOFT,
    marginBottom: 18,
  },

  /* Summary card */
  carTitle: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    color: NAVY_SOFT,
    letterSpacing: -0.5,
  },
  variant: { fontSize: 15, color: '#7C86A8', marginTop: 4, fontWeight: '500' },
  price: {
    fontSize: 34,
    fontWeight: '800',
    color: NAVY_SOFT,
    marginTop: 16,
    letterSpacing: -0.5,
  },
  priceNote: { fontSize: 12, color: MUTED, marginTop: 2 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F8',
  },
  locationIcon: { fontSize: 15, marginRight: 8 },
  locationText: { flex: 1, fontSize: 14, color: '#4B5563', fontWeight: '600' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  specChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F1F5FF',
  },
  specChipText: { fontSize: 12.5, fontWeight: '700', color: NAVY_SOFT },

  chatButton: {
    marginTop: 22,
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  chatHint: { marginTop: 10, fontSize: 12.5, color: MUTED, textAlign: 'center' },

  /* Overview */
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  overviewItem: {
    width: '31.5%',
    backgroundColor: '#F7F9FD',
    borderRadius: 16,
    padding: 16,
  },
  overviewIcon: { fontSize: 20, marginBottom: 10 },
  overviewLabel: { fontSize: 12, color: MUTED, fontWeight: '600' },
  overviewValue: { fontSize: 15, color: NAVY_SOFT, fontWeight: '800', marginTop: 3 },

  /* Seller */
  sellerRow: { flexDirection: 'row', alignItems: 'center' },
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sellerAvatarText: { fontSize: 24 },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '800', color: NAVY_SOFT },
  sellerLocation: { fontSize: 13, color: MUTED, marginTop: 3 },
  verifiedText: { fontSize: 12.5, color: '#16A34A', fontWeight: '700', marginTop: 4 },

  description: { fontSize: 14.5, lineHeight: 25, color: '#4B5563' },

  bottomBackButton: {
    alignSelf: 'center',
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E6',
    backgroundColor: '#FFFFFF',
  },
  bottomBackButtonText: { color: NAVY_SOFT, fontSize: 14, fontWeight: '700' },

  /* Mobile sticky bottom bar */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  bottomBarPriceLabel: { fontSize: 11, color: MUTED, fontWeight: '600' },
  bottomBarPrice: { fontSize: 19, fontWeight: '800', color: NAVY_SOFT },
  bottomBarButton: {
    flex: 1,
    maxWidth: 220,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  /* Empty state */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F6F8FC',
  },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: NAVY_SOFT },
  backButton: {
    marginTop: 18,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: NAVY_SOFT,
  },
  backButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});

/**
 * mobile  : < 768
 * tablet  : 768 - 1023
 * desktop : >= 1024
 */
export function getResponsiveStyles(width) {
  if (width < 768) {
    const small = width < 390;

    return {
      contentContainer: { paddingBottom: 24 },
      inner: { paddingHorizontal: small ? 14 : 16, paddingTop: 14 },
      mainRow: { flexDirection: 'column', alignItems: 'stretch', gap: 16 },
      leftCol: { flex: 0, width: '100%', gap: 16 },
      rightCol: { flex: 0, width: '100%', position: 'relative', top: 0 },
      gallery: { height: small ? 230 : 280, borderRadius: 18 },
      thumbnailButton: { width: 74, height: 54 },
      card: { padding: 18, borderRadius: 18 },
      carTitle: { fontSize: 23, lineHeight: 30 },
      price: { fontSize: 28, marginTop: 12 },
      overviewItem: { width: '48%', padding: 14 },
      arrowButton: { width: 38, height: 38, borderRadius: 19, marginTop: -19 },
    };
  }

  if (width < 1024) {
    return {
      inner: { paddingHorizontal: 24 },
      mainRow: { flexDirection: 'column', alignItems: 'stretch', gap: 20 },
      leftCol: { flex: 0, width: '100%' },
      rightCol: { flex: 0, width: '100%', position: 'relative', top: 0 },
      gallery: { height: 400 },
      overviewItem: { width: '31.5%' },
    };
  }

  return {};
}