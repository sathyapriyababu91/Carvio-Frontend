import { StyleSheet } from 'react-native';

const NAVY = '#0F1C45';
const NAVY_SOFT = '#12224F';
const BLUE = '#2F6FED';
const BLUE_LIGHT = '#76A8FF';
const INK_MUTED = '#65718A';
const BORDER = '#E4EAF4';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FC' },
  contentContainer: { paddingBottom: 0 },

  /* Shared centered wrapper */
  inner: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 40,
  },

  eyebrow: {
    color: BLUE,
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },

  /* ---------------- HERO ---------------- */
  hero: {
    backgroundColor: NAVY,
    overflow: 'hidden',
    paddingVertical: 72,
  },
  glowOne: {
    position: 'absolute',
    top: -140,
    right: -120,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(47,111,237,0.20)',
  },
  glowTwo: {
    position: 'absolute',
    bottom: -160,
    left: -110,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(118,168,255,0.10)',
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  heroLeft: { flex: 1.05, zIndex: 2 },
  topBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: BLUE_LIGHT,
    marginRight: 9,
  },
  badgeText: {
    color: '#DCE8FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 46,
    lineHeight: 54,
    fontWeight: '800',
    letterSpacing: -1,
  },
  highlightText: {
    color: BLUE_LIGHT,
    fontSize: 46,
    lineHeight: 54,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#C9D4EE',
    fontSize: 16,
    lineHeight: 26,
    marginTop: 20,
    maxWidth: 520,
  },
  heroButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 32,
    gap: 12,
  },
  primaryButton: {
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  primaryArrow: { color: '#FFFFFF', fontSize: 18, marginLeft: 10 },
  secondaryButton: {
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 30,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chipTick: { color: BLUE_LIGHT, fontSize: 12, fontWeight: '800', marginRight: 7 },
  chipText: { color: '#E3ECFF', fontSize: 12.5, fontWeight: '600' },

  heroMedia: { flex: 0.95, height: 470, position: 'relative', zIndex: 2 },
  heroImageClip: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: '#1B2C5E',
  },
  heroImage: { width: '100%', height: '100%' },
  floatCard: {
    position: 'absolute',
    left: -26,
    bottom: 30,
    maxWidth: 260,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
  },
  floatTitle: { color: NAVY_SOFT, fontSize: 15, fontWeight: '800' },
  floatText: { color: INK_MUTED, fontSize: 12.5, marginTop: 4 },

  /* ---------------- WHO WE ARE ---------------- */
  whoSection: { backgroundColor: '#FFFFFF', paddingVertical: 84 },
  whoInner: { flexDirection: 'row', alignItems: 'center', gap: 56 },
  whoMedia: {
    flex: 0.9,
    height: 400,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#E8EEF8',
  },
  whoImage: { width: '100%', height: '100%' },
  imageCaption: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(15,28,69,0.88)',
  },
  imageCaptionTitle: { color: '#FFFFFF', fontSize: 14.5, fontWeight: '800' },
  imageCaptionText: { color: '#D3E0F8', fontSize: 12.5, marginTop: 4 },

  whoText: { flex: 1.1 },
  sectionHeading: {
    color: NAVY_SOFT,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 18,
  },
  bodyText: { color: INK_MUTED, fontSize: 15, lineHeight: 26, marginBottom: 14 },
  checkList: { marginTop: 8, gap: 12 },
  checkItem: { flexDirection: 'row', alignItems: 'center' },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkBadgeText: { color: BLUE, fontSize: 13, fontWeight: '800' },
  checkText: { color: NAVY_SOFT, fontSize: 14.5, fontWeight: '600' },
  textLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 22,
    paddingVertical: 8,
  },
  textLinkText: { color: BLUE, fontSize: 15, fontWeight: '800' },
  textLinkArrow: { color: BLUE, fontSize: 18, fontWeight: '700' },

  /* ---------------- WHY ---------------- */
  whySection: { paddingVertical: 84 },
  centerHead: { alignItems: 'center', marginBottom: 44 },
  sectionTitleCenter: {
    color: NAVY_SOFT,
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: '#758098',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 540,
    marginTop: 12,
  },
  cardsRow: { flexDirection: 'row', gap: 20 },
  featureCard: {
    flex: 1,
    padding: 28,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderTopWidth: 3,
    borderTopColor: BLUE,
    shadowColor: '#0F1C45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
  },
  featureIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  featureIconText: { color: BLUE, fontSize: 24, fontWeight: '800' },
  cardTitle: { color: NAVY_SOFT, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  cardDescription: { color: '#758098', fontSize: 14, lineHeight: 23 },

  /* ---------------- BUY / SELL ---------------- */
  splitSection: { backgroundColor: '#FFFFFF', paddingVertical: 84 },
  splitRow: { flexDirection: 'row', gap: 20 },
  splitCard: {
    flex: 1,
    padding: 32,
    borderRadius: 24,
    backgroundColor: '#F3F7FF',
    borderWidth: 1,
    borderColor: '#DDE8FB',
  },
  splitCardDark: { backgroundColor: NAVY_SOFT, borderColor: NAVY_SOFT },
  splitLabel: {
    color: BLUE,
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  splitLabelDark: { color: BLUE_LIGHT },
  splitTitle: {
    color: NAVY_SOFT,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '800',
    marginBottom: 12,
  },
  splitTitleDark: { color: '#FFFFFF' },
  splitText: { color: INK_MUTED, fontSize: 14.5, lineHeight: 24, marginBottom: 20 },
  splitTextDark: { color: '#C9D4EE' },
  splitButton: {
    alignSelf: 'flex-start',
    minHeight: 46,
    paddingHorizontal: 22,
    borderRadius: 11,
    backgroundColor: NAVY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitButtonDark: { backgroundColor: BLUE },
  splitButtonText: { color: '#FFFFFF', fontSize: 13.5, fontWeight: '800' },

  /* ---------------- STEPS ---------------- */
  processSection: { backgroundColor: '#EEF4FF', paddingVertical: 84 },
  stepsRow: { flexDirection: 'row', gap: 24 },
  stepItem: { flex: 1, position: 'relative' },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    zIndex: 2,
  },
  stepNumberText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  stepLineH: {
    position: 'absolute',
    top: 24,
    left: 62,
    right: -12,
    height: 2,
    backgroundColor: '#BFD3F8',
  },
  stepLineV: {
    position: 'absolute',
    left: 24,
    top: 54,
    bottom: -22,
    width: 2,
    backgroundColor: '#BFD3F8',
  },
  stepTitle: { color: NAVY_SOFT, fontSize: 17, fontWeight: '800', marginBottom: 8 },
  stepDescription: { color: '#758098', fontSize: 14, lineHeight: 22 },

  /* ---------------- CTA ---------------- */
  ctaWrap: { paddingVertical: 72 },
  ctaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 44,
    borderRadius: 28,
    backgroundColor: NAVY,
    overflow: 'hidden',
    gap: 24,
  },
  ctaGlow: {
    position: 'absolute',
    top: -90,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(47,111,237,0.28)',
  },
  ctaContent: { flex: 1, zIndex: 2 },
  ctaTitle: { color: '#FFFFFF', fontSize: 32, lineHeight: 40, fontWeight: '800' },
  ctaDescription: { color: '#C9D4EE', fontSize: 15, lineHeight: 24, marginTop: 10 },
  ctaButton: {
    minHeight: 54,
    paddingHorizontal: 26,
    borderRadius: 12,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  ctaButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  ctaArrow: { color: '#FFFFFF', fontSize: 18, marginLeft: 10 },
});

/**
 * Responsive overrides.
 * mobile  : < 768
 * tablet  : 768 - 1023
 * desktop : >= 1024
 */
export function getResponsiveStyles(width) {
  if (width < 768) {
    const small = width < 390;
    const pad = small ? 18 : 22;

    return {
      inner: { paddingHorizontal: pad },

      hero: { paddingVertical: 44 },
      heroInner: { flexDirection: 'column', alignItems: 'stretch', gap: 34 },
      heroLeft: { flex: 0 },
      title: { fontSize: small ? 32 : 37, lineHeight: small ? 40 : 45 },
      highlightText: { fontSize: small ? 32 : 37, lineHeight: small ? 40 : 45 },
      subtitle: { fontSize: 14.5, lineHeight: 23 },
      heroButtons: { flexDirection: 'column', alignItems: 'stretch' },
      primaryButton: { width: '100%' },
      secondaryButton: { width: '100%' },
      heroMedia: { flex: 0, height: small ? 250 : 300 },
      floatCard: { left: 12, right: 12, bottom: 12, maxWidth: undefined, padding: 13 },

      whoSection: { paddingVertical: 52 },
      whoInner: { flexDirection: 'column-reverse', alignItems: 'stretch', gap: 28 },
      whoMedia: { flex: 0, width: '100%', height: small ? 240 : 290 },
      whoText: { flex: 0 },
      sectionHeading: { fontSize: 28, lineHeight: 36 },

      whySection: { paddingVertical: 52 },
      centerHead: { marginBottom: 28 },
      sectionTitleCenter: { fontSize: 29, lineHeight: 37 },
      cardsRow: { flexDirection: 'column', gap: 14 },
      featureCard: { flex: 0, width: '100%', padding: 22 },

      splitSection: { paddingVertical: 52 },
      splitRow: { flexDirection: 'column', gap: 14 },
      splitCard: { flex: 0, width: '100%', padding: 24 },
      splitTitle: { fontSize: 23, lineHeight: 31 },
      splitButton: { alignSelf: 'stretch' },

      processSection: { paddingVertical: 52 },
      stepsRow: { flexDirection: 'column', gap: 30 },
      stepItem: { flex: 0, width: '100%', paddingLeft: 68, minHeight: 56 },
      stepNumber: { position: 'absolute', left: 0, top: 0, marginBottom: 0 },

      ctaWrap: { paddingVertical: 44 },
      ctaSection: {
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: 26,
        borderRadius: 22,
        gap: 22,
      },
      ctaTitle: { fontSize: 26, lineHeight: 34 },
      ctaButton: { width: '100%' },
    };
  }

  if (width < 1024) {
    return {
      inner: { paddingHorizontal: 28 },

      hero: { paddingVertical: 56 },
      heroInner: { gap: 32 },
      title: { fontSize: 38, lineHeight: 46 },
      highlightText: { fontSize: 38, lineHeight: 46 },
      heroMedia: { height: 380 },
      floatCard: { left: -14, bottom: 22, maxWidth: 220 },

      whoSection: { paddingVertical: 64 },
      whoInner: { gap: 34 },
      whoMedia: { height: 340 },
      sectionHeading: { fontSize: 30, lineHeight: 38 },

      whySection: { paddingVertical: 64 },
      sectionTitleCenter: { fontSize: 32, lineHeight: 40 },
      featureCard: { padding: 20 },

      splitSection: { paddingVertical: 64 },
      splitCard: { padding: 26 },

      processSection: { paddingVertical: 64 },
      stepsRow: { flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 30, gap: 0 },
      stepItem: { flex: 0, width: '47%' },

      ctaWrap: { paddingVertical: 56 },
      ctaSection: { padding: 34 },
      ctaTitle: { fontSize: 27, lineHeight: 35 },
    };
  }

  return {};
}