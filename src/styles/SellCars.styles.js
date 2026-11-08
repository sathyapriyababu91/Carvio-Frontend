import { StyleSheet, Platform, StatusBar } from 'react-native';

const NAVY = '#12224F';
const BLUE = '#2F6FED';
const BLUE_SOFT = '#EEF4FF';
const WHITE = '#FFFFFF';
const TEXT = '#101828';
const LABEL = '#344054';
const MUTED = '#667085';
const BORDER = '#E4E9F2';
const FIELD_BORDER = '#D6DCE8';
const BG = '#F4F6FB';
const GREEN = '#12B76A';
const RED = '#D92D20';

const webOnly = (style) => (Platform.OS === 'web' ? style : {});

const cardShadow = Platform.select({
  android: { elevation: 1 },
  ios: {
    shadowColor: '#101B36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  web: { boxShadow: '0px 2px 10px rgba(16, 27, 54, 0.05)' },
  default: {},
});

export const styles = StyleSheet.create({
  /* ---------- Page ---------- */
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  contentContainer: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 28,
  },

  /* ---------- Header + progress ---------- */
  header: {
    marginBottom: 14,
  },

  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: MUTED,
  },

  progressCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    ...cardShadow,
  },

  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: LABEL,
  },

  progressPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: BLUE,
  },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8EEFB',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: BLUE,
  },

  /* ---------- Cards / sections ---------- */
  card: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    ...cardShadow,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: BLUE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionIcon: {
    fontSize: 16,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: NAVY,
  },

  /* ---------- Fields ---------- */
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: LABEL,
    marginBottom: 7,
    marginTop: 16,
  },

  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: TEXT,
    backgroundColor: '#FBFCFE',
    ...webOnly({ outlineStyle: 'none' }),
  },

  inputFocused: {
    borderColor: BLUE,
    backgroundColor: WHITE,
    ...webOnly({ boxShadow: '0 0 0 3px rgba(47,111,237,0.12)' }),
  },

  inputRow: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 12,
    paddingHorizontal: 13,
    backgroundColor: '#FBFCFE',
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputAffix: {
    fontSize: 14,
    fontWeight: '700',
    color: MUTED,
  },

  inputInner: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 14,
    color: TEXT,
    ...webOnly({ outlineStyle: 'none', backgroundColor: 'transparent' }),
  },

  helperText: {
    fontSize: 11,
    lineHeight: 16,
    color: MUTED,
    marginTop: 6,
  },

  pricePreview: {
    fontSize: 12,
    fontWeight: '800',
    color: GREEN,
    marginTop: 6,
  },

  textArea: {
    width: '100%',
    minHeight: 110,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    lineHeight: 20,
    color: TEXT,
    backgroundColor: '#FBFCFE',
    textAlignVertical: 'top',
    ...webOnly({ outlineStyle: 'none' }),
  },

  characterCount: {
    textAlign: 'right',
    color: MUTED,
    fontSize: 11,
    marginTop: 6,
  },

  /* ---------- Select field (brand / location) ---------- */
  dropdownInput: {
    width: '100%',
    minHeight: 46,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 12,
    paddingHorizontal: 13,
    backgroundColor: '#FBFCFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...webOnly({ cursor: 'pointer' }),
  },

  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: TEXT,
  },

  dropdownPlaceholder: {
    color: '#98A2B3',
  },

  dropdownArrow: {
    fontSize: 12,
    color: MUTED,
    marginLeft: 10,
  },

  /* ---------- Chips ---------- */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    ...webOnly({ cursor: 'pointer' }),
  },

  chipSelected: {
    borderColor: BLUE,
    backgroundColor: BLUE_SOFT,
  },

  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475467',
  },

  chipTextSelected: {
    color: BLUE,
    fontWeight: '800',
  },

  /* ---------- Location summary ---------- */
  locationSummary: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0FBF5',
    borderWidth: 1,
    borderColor: '#C9EFD9',
  },

  locationSummaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },

  locationSummarySub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 3,
  },

  /* ---------- Bottom sheet (brand picker) ---------- */
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,0.5)',
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  dropdownModal: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    maxHeight: '78%',
    backgroundColor: WHITE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },

  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D5DD',
    alignSelf: 'center',
    marginTop: 8,
  },

  dropdownHeader: {
    minHeight: 54,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
  },

  dropdownClose: {
    fontSize: 26,
    color: MUTED,
    lineHeight: 30,
    paddingLeft: 15,
  },

  dropdownOptions: {
    paddingVertical: 4,
  },

  dropdownOption: {
    minHeight: 50,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...webOnly({ cursor: 'pointer' }),
  },

  dropdownOptionSelected: {
    backgroundColor: BLUE_SOFT,
  },

  dropdownOptionText: {
    flex: 1,
    fontSize: 14,
    color: LABEL,
  },

  dropdownOptionTextSelected: {
    color: BLUE,
    fontWeight: '800',
  },

  checkMark: {
    fontSize: 17,
    color: BLUE,
    fontWeight: '800',
    marginLeft: 10,
  },

  /* ---------- Photos ---------- */
  photoDescription: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 18,
    marginBottom: 14,
  },

  photoUploadButton: {
    width: '100%',
    minHeight: 120,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderStyle: 'dashed',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F9FF',
    ...webOnly({ cursor: 'pointer' }),
  },

  photoUploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BLUE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  photoUploadIcon: {
    fontSize: 24,
    color: BLUE,
    fontWeight: '400',
    lineHeight: 28,
  },

  photoUploadText: {
    fontSize: 13,
    color: BLUE,
    fontWeight: '800',
  },

  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  photoItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EEF2F7',
  },

  carPhoto: {
    width: '100%',
    height: '100%',
  },

  addPhotoTile: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderStyle: 'dashed',
    backgroundColor: '#F7F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    ...webOnly({ cursor: 'pointer' }),
  },

  addPhotoTileIcon: {
    fontSize: 26,
    color: BLUE,
    lineHeight: 30,
  },

  addPhotoTileText: {
    fontSize: 10,
    fontWeight: '800',
    color: BLUE,
    marginTop: 2,
  },

  mainPhotoBadge: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    backgroundColor: NAVY,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },

  mainPhotoText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '800',
  },

  removePhotoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    ...webOnly({ cursor: 'pointer' }),
  },

  removePhotoText: {
    color: RED,
    fontSize: 17,
    lineHeight: 19,
    fontWeight: '700',
  },

  photoCount: {
    fontSize: 12,
    color: MUTED,
    marginTop: 10,
    fontWeight: '600',
  },

  /* ---------- Payment ---------- */
  paymentContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  paymentOption: {
    width: '48.5%',
    minHeight: 92,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 14,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    position: 'relative',
    ...webOnly({ cursor: 'pointer' }),
  },

  paymentOptionSelected: {
    borderColor: BLUE,
    backgroundColor: BLUE_SOFT,
  },

  paymentLogoBox: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  paymentLogo: {
    width: 34,
    height: 34,
  },

  paymentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#101B36',
    textAlign: 'center',
  },

  paymentTextSelected: {
    fontWeight: '800',
    color: NAVY,
  },

  paymentCheckBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  paymentCheck: {
    fontSize: 11,
    fontWeight: '800',
    color: WHITE,
  },

  /* ---------- Back link ---------- */
  backButton: {
    alignItems: 'center',
    marginTop: 4,
    padding: 10,
  },

  backButtonText: {
    color: BLUE,
    fontSize: 14,
    fontWeight: '700',
  },

  /* ---------- Sticky bottom bar ---------- */
  footer: {
    width: '100%',
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    ...Platform.select({
      web: { boxShadow: '0px -4px 16px rgba(16, 27, 54, 0.06)' },
      android: { elevation: 10 },
      default: {},
    }),
  },

  footerInner: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  footerPriceBox: {
    flexShrink: 1,
    maxWidth: '42%',
  },

  footerPriceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 0.4,
  },

  footerPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: NAVY,
    marginTop: 1,
  },

  submitButton: {
    flex: 1,
    minHeight: 50,
    backgroundColor: BLUE,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...webOnly({ cursor: 'pointer' }),
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '800',
  },

  submitArrow: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '700',
  },

  /* ---------- Map modal ---------- */
  mapScreen: {
    flex: 1,
    backgroundColor: WHITE,
  },

  mapHeader: {
    minHeight: 64,
    paddingHorizontal: 18,
    paddingTop: Platform.select({
      ios: 48,
      android: (StatusBar.currentHeight || 24) + 6,
      default: 0,
    }),
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  mapHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: NAVY,
  },

  mapHeaderSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },

  mapClose: {
    fontSize: 28,
    color: MUTED,
    paddingLeft: 14,
  },

  webMapFallback: {
    flex: 1,
    backgroundColor: BLUE_SOFT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },

  webMapPin: {
    fontSize: 44,
    marginBottom: 14,
  },

  webMapTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: NAVY,
    textAlign: 'center',
    marginBottom: 8,
  },

  webMapText: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 22,
  },

  mapPrimaryButton: {
    minHeight: 50,
    backgroundColor: BLUE,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    ...webOnly({ cursor: 'pointer' }),
  },

  mapPrimaryButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '800',
  },

  mapFooter: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: Platform.OS === 'ios' ? 28 : 18,
  },

  mapSelectedCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: WHITE,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
    ...cardShadow,
  },

  mapSelectedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: NAVY,
  },

  mapSelectedSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },

  mapSecondaryButton: {
    minHeight: 46,
    borderRadius: 13,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...webOnly({ cursor: 'pointer' }),
  },

  mapSecondaryButtonText: {
    color: BLUE,
    fontSize: 14,
    fontWeight: '800',
  },
});