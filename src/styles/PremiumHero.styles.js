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

  heroMobile: {
    flexDirection: 'column',
    width: '100%',
  },

  heroMain: {
    width: '100%',
    minHeight: 460,
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
    minHeight: 460,
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

  // Content grows with its height (flex: 0 would collapse it on web).
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
    marginBottom: 6,
  },

  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 14,
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
    transform: [{ scale: 0.97 }],
  },

  categorySection: {
    width: '100%',
    paddingHorizontal: 42,
    paddingTop: 28,
    paddingBottom: 34,
    backgroundColor: LIGHT_BG,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },

  categorySectionMobile: {
    paddingHorizontal: 16,
    paddingTop: 22,
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

  // OLX-style category grid: icon tile on top, label underneath.
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  categoryCard: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
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
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  categoryIcon: {
    fontSize: 30,
  },

  categoryTitle: {
    color: NAVY,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Selected category tile (filters the vehicles shown below).
  categoryCardActive: {
    borderColor: BLUE,
    borderWidth: 2,
    backgroundColor: '#EEF4FF',
  },

  categoryTitleActive: {
    color: BLUE,
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