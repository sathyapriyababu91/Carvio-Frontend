import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  contentContainer: {
    padding: 35,
    paddingBottom: 60,
  },

  contentContainerMobile: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 22,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#12224F',
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  titleMobile: {
    fontSize: 26,
  },

  subtitle: {
    fontSize: 15,
    color: '#667085',
    lineHeight: 22,
  },

  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5EAF2',
    shadowColor: '#12224F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  cityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#12224F',
  },

  viewAllCitiesText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F6FED',
  },

  cityList: {
    gap: 12,
    paddingRight: 6,
  },

  cityCardItem: {
    width: 92,
    alignItems: 'center',
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5EAF2',
    backgroundColor: '#FFFFFF',
  },

  cityCardActive: {
    borderColor: '#2F6FED',
    backgroundColor: '#F0F5FF',
  },

  cityCardImage: {
    width: 76,
    height: 58,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#EEF2F7',
  },

  cityCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475467',
    textAlign: 'center',
  },

  cityCardTextActive: {
    color: '#2F6FED',
    fontWeight: '700',
  },

  searchBox: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DFEA',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#12224F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#101828',
  },

  searchClear: {
    fontSize: 15,
    color: '#98A2B3',
    fontWeight: '700',
    paddingLeft: 8,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  resultsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#12224F',
  },

  resultsCount: {
    fontSize: 13,
    color: '#667085',
    marginTop: 4,
  },

  loadingBox: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  carGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },

  carCard: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5EAF2',
    shadowColor: '#12224F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },

  carCardMobile: {
    width: '100%',
  },

  imageContainer: {
    width: '100%',
    height: 210,
    position: 'relative',
    backgroundColor: '#EEF2F7',
  },

  carImage: {
    width: '100%',
    height: '100%',
  },

  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  favoriteIcon: {
    fontSize: 25,
    color: '#344054',
  },

  favoriteIconActive: {
    color: '#D92D20',
  },

  usedBadge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: '#12224F',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    zIndex: 2,
  },

  usedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  cardContent: {
    padding: 17,
  },

  carTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  carNameContainer: {
    flex: 1,
    paddingRight: 10,
  },

  carName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#12224F',
  },

  variant: {
    fontSize: 13,
    color: '#667085',
    marginTop: 3,
  },

  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  shareIcon: {
    fontSize: 21,
    color: '#2F6FED',
    fontWeight: '700',
  },

  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2F6FED',
    marginTop: 15,
    marginBottom: 13,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  detailText: {
    fontSize: 13,
    color: '#475467',
  },

  ownerText: {
    fontSize: 13,
    color: '#475467',
    marginBottom: 12,
  },

  locationRow: {
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    paddingTop: 12,
    marginBottom: 14,
  },

  locationText: {
    fontSize: 13,
    color: '#667085',
  },

  viewButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2F6FED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 5,
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  viewArrow: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },

  noResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5EAF2',
  },

  noResultsIcon: {
    fontSize: 45,
    marginBottom: 10,
  },

  noResultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#12224F',
    marginBottom: 7,
  },

  noResultsText: {
    fontSize: 14,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 21,
  },

  retryButton: {
    minHeight: 46,
    marginTop: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#2F6FED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  sellBanner: {
    marginTop: 35,
    padding: 25,
    backgroundColor: '#12224F',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sellBannerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 16,
    padding: 20,
  },

  sellBannerContent: {
    flex: 1,
    paddingRight: 20,
  },

  sellBannerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 7,
  },

  sellBannerText: {
    color: '#D0D5DD',
    fontSize: 14,
    lineHeight: 20,
  },

  sellButton: {
    minHeight: 48,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sellButtonText: {
    color: '#12224F',
    fontSize: 14,
    fontWeight: '800',
  },

  /* ---------- CITY MODAL ---------- */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '92%',
    maxWidth: 720,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
  },

  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    color: '#12224F',
    paddingRight: 10,
  },

  modalCloseIcon: {
    fontSize: 18,
    color: '#667085',
    fontWeight: '700',
    padding: 4,
  },

  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    flexWrap: 'wrap',
    gap: 12,
  },

  useLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  useLocationIcon: {
    fontSize: 16,
    color: '#FF6000',
  },

  useLocationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6000',
  },

  modalSearchBox: {
    flex: 1,
    minWidth: 220,
    height: 48,
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  modalSearchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#101828',
  },

  popularCitiesLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#98A2B3',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },

  modalCityScroll: {
    maxHeight: 380,
  },

  modalCityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    paddingBottom: 10,
  },

  modalCityItem: {
    width: 88,
    alignItems: 'center',
  },

  modalCityImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#EEF2F7',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  modalCityImageActive: {
    borderColor: '#2F6FED',
  },

  modalCityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#344054',
    textAlign: 'center',
  },

  modalCityTextActive: {
    color: '#2F6FED',
    fontWeight: '700',
  },

  modalNoCityText: {
    fontSize: 14,
    color: '#667085',
    paddingVertical: 20,
    textAlign: 'center',
    width: '100%',
  },
});