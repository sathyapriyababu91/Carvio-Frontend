import { StyleSheet, Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const NAVY = '#12224F';
const BLUE = '#2F6FED';
const SKY = '#6EA8FF';
const WHITE = '#FFFFFF';
const MUTED = '#64718B';
const LIGHT_BG = '#F5F8FF';

const web = (styles) => (isWeb ? styles : {});

export const styles = StyleSheet.create({
  heroContainer: {
    width: '100%',
    alignSelf: 'stretch',
    flexShrink: 0,
    backgroundColor: NAVY,
    overflow: 'hidden',
    ...web({
      backgroundImage:
        'linear-gradient(135deg, #0C1838 0%, #12224F 55%, #1B3A82 100%)',
    }),
  },

  bodyTypeSearchBox: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },

  bodyTypeSearchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E3E9F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F7F9FD',
    color: '#12224F',
    fontSize: 14,
    // "outlineStyle" is a web-only property; it is invalid on Android/iOS.
    ...web({ outlineStyle: 'none' }),
  },

  heroMobile: {
    flexDirection: 'column',
    width: '100%',
  },

  heroMain: {
    width: '100%',
    minHeight: 510,
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  heroMainMobile: {
    width: '100%',
    minHeight: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  imageWrap: {
    width: '46%',
    minHeight: 510,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#101D3D',
    alignItems: 'center',
    justifyContent: 'center',
    ...web({
      backgroundImage:
        'radial-gradient(ellipse at center, #253F78 0%, #101D3D 75%)',
    }),
  },

  imageWrapMobile: {
    width: '100%',
    height: 240,
    minHeight: 240,
    flexGrow: 0,
    flexShrink: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  imageWrapSmall: {
    height: 195,
    minHeight: 195,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  // Shown when a hero image fails to load (offline / blocked URL).
  imageFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageFallbackIcon: {
    fontSize: 54,
  },

  imageFallbackText: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
  },

  // Soft dark fade on the picture so the badge and dots are easy to read.
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,17,40,0.16)',
    ...web({
      backgroundImage:
        'linear-gradient(180deg, rgba(8,17,40,0.28) 0%, rgba(8,17,40,0) 35%, rgba(8,17,40,0) 62%, rgba(8,17,40,0.5) 100%)',
    }),
  },

  imageBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(18,34,79,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },

  imageBadgeText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  slideIndicators: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(8,17,40,0.65)',
  },

  slideIndicator: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.48)',
  },

  slideIndicatorActive: {
    width: 22,
    backgroundColor: SKY,
  },

  contentContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingHorizontal: 38,
    paddingVertical: 42,
  },

  // முன்பு flex: 0 இருந்தது. web-ல் அது height-ஐ 0 ஆக்கி, hero content முழுவதும்
  // overflow: hidden-ஆல் மறைந்துவிட்டது. இப்போது content உயரத்துக்கு ஏற்ப வளரும்.
  contentMobile: {
    width: '100%',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },

  contentSmall: {
    width: '100%',
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 24,
  },

  topBadge: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#6EE7B7',
    marginRight: 8,
    flexShrink: 0,
  },

  topBadgeText: {
    color: '#DCE9FF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    flexShrink: 1,
  },

  heroTitle: {
    color: WHITE,
    fontSize: 43,
    lineHeight: 51,
    fontWeight: '900',
    letterSpacing: -1.2,
    marginBottom: 14,
  },

  heroTitleMobile: {
    fontSize: 33,
    lineHeight: 40,
    letterSpacing: -0.6,
  },

  heroTitleSmall: {
    fontSize: 28,
    lineHeight: 34,
  },

  welcomeText: {
    color: SKY,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },

  heroSubtitle: {
    color: '#CBD7F1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },

  searchPanel: {
    width: '100%',
    maxWidth: 570,
    alignSelf: 'stretch',
    padding: 12,
    borderRadius: 22,
    backgroundColor: WHITE,
    zIndex: 20,
    ...(isWeb
      ? {
          boxShadow: '0 16px 38px rgba(0,0,0,0.22)',
        }
      : {
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.16,
          shadowRadius: 14,
        }),
  },

  searchField: {
    width: '100%',
    position: 'relative',
    zIndex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F6',
  },

  // dropdown திறந்திருக்கும் field, கீழே உள்ள field-களுக்கு மேலே தெரிய வேண்டும்
  searchFieldOpen: {
    zIndex: 50,
    elevation: 12,
  },

  searchFieldButton: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
  },

  searchFieldPressed: {
    backgroundColor: '#F2F6FF',
  },

  searchLabel: {
    color: '#8B95A8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 4,
  },

  searchValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  searchValue: {
    flex: 1,
    minWidth: 0,
    color: NAVY,
    fontSize: 14,
    fontWeight: '800',
  },

  searchCaret: {
    color: BLUE,
    fontSize: 17,
    marginLeft: 10,
  },

  // On the web the list floats over the content below it.
  // On Android/iOS an absolutely positioned list that hangs outside its
  // parent cannot be tapped, so there it is part of the normal layout.
  dropdown: {
    position: isWeb ? 'absolute' : 'relative',
    ...web({
      top: '100%',
      left: 0,
      right: 0,
    }),
    marginTop: 4,
    marginBottom: isWeb ? 0 : 6,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E3E9F4',
    borderRadius: 14,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 12,
    ...web({
      boxShadow: '0 12px 28px rgba(18,34,79,0.18)',
    }),
  },

  dropdownScroll: {
    maxHeight: 200,
  },

  dropdownEmpty: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },

  dropdownEmptyText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },

  dropdownKeywordButton: {
    minHeight: 46,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdownKeywordText: {
    color: BLUE,
    fontSize: 13,
    fontWeight: '900',
  },

  dropdownOption: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownOptionSelected: {
    backgroundColor: '#F2F6FF',
  },

  dropdownOptionPressed: {
    backgroundColor: '#E8F0FF',
  },

  dropdownOptionText: {
    color: '#45516B',
    fontSize: 13,
    fontWeight: '600',
  },

  dropdownOptionActive: {
    color: BLUE,
    fontWeight: '900',
  },

  optionCheck: {
    color: BLUE,
    fontWeight: '900',
  },

  searchButton: {
    minHeight: 52,
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb
      ? null
      : {
          elevation: 3,
          shadowColor: BLUE,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }),
    ...web({
      backgroundImage: 'linear-gradient(135deg, #2F6FED, #5B8DFF)',
      cursor: 'pointer',
      boxShadow: '0 8px 18px rgba(47,111,237,0.35)',
    }),
  },

  searchButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },

  trustChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },

  trustText: {
    color: '#DCE9FF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Shared "pressed" feedback for cards and buttons.
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  categorySection: {
    width: '100%',
    paddingHorizontal: 42,
    paddingTop: 32,
    paddingBottom: 38,
    backgroundColor: LIGHT_BG,
  },

  categorySectionMobile: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 28,
  },

  categoryHeading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },

  sectionEyebrow: {
    color: BLUE,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  sectionTitle: {
    color: NAVY,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },

  viewAllText: {
    color: BLUE,
    fontSize: 13,
    fontWeight: '900',
  },

  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  categoryCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 150,
    minWidth: 0,
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E7ECF5',
    ...(isWeb
      ? null
      : {
          elevation: 2,
          shadowColor: '#12224F',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.07,
          shadowRadius: 8,
        }),
    ...web({
      boxShadow: '0 8px 22px rgba(18,34,79,0.06)',
      cursor: 'pointer',
      transition: 'transform .2s ease',
    }),
  },

  categoryIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },

  categoryIcon: {
    fontSize: 22,
  },

  categoryTextWrap: {
    flex: 1,
    minWidth: 0,
  },

  categoryTitle: {
    color: NAVY,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },

  categoryDescription: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
  },

  categoryArrow: {
    color: BLUE,
    fontSize: 17,
    fontWeight: '900',
    marginLeft: 5,
    flexShrink: 0,
  },

  sellBanner: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderRadius: 24,
    backgroundColor: NAVY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    overflow: 'hidden',
    ...web({
      backgroundImage:
        'linear-gradient(110deg, #12224F 0%, #1B3A82 100%)',
    }),
  },

  // Decorative light circle in the corner of the sell banner.
  sellBannerGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(110,168,255,0.16)',
  },

  sellBannerTextWrap: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 180,
    minWidth: 0,
  },

  sellBannerEyebrow: {
    color: SKY,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 7,
  },

  sellBannerTitle: {
    color: WHITE,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    marginBottom: 5,
  },

  sellBannerSubtitle: {
    color: '#CBD7F1',
    fontSize: 12,
    lineHeight: 18,
  },

  sellBannerButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  sellBannerButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '900',
  },
});