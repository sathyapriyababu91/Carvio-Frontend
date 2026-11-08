import { StyleSheet, Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const web = (styles) => (isWeb ? styles : {});

const NAVY = '#12224F';
const BLUE = '#2F6FED';
const BLUE_DARK = '#2458CC';
const BLUE_SOFT = '#EEF4FF';
const WHITE = '#FFFFFF';
const TEXT = '#101B36';
const MUTED = '#667085';
const BORDER = '#E5EAF2';
const BG = '#F7F9FC';
const RED = '#F04438';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    backgroundColor: WHITE,
    zIndex: 100,
    elevation: 8,
    ...web({
      position: 'relative',
      boxShadow: '0 5px 24px rgba(18,34,79,0.08)',
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
      borderBottomStyle: 'solid',
    }),
  },

  mobileMainContainer: {
    width: '100%',
  },

  annBar: {
    width: '100%',
    minHeight: 35,
    backgroundColor: NAVY,
    ...web({
      backgroundImage:
        'linear-gradient(100deg,#0C1838 0%,#12224F 55%,#1B3A82 100%)',
    }),
  },

  annInner: {
    minHeight: 35,
    paddingHorizontal: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    ...web({
      maxWidth: 1600,
      width: '100%',
      alignSelf: 'center',
    }),
  },

  annInnerMobile: {
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  annLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flexShrink: 1,
    minWidth: 0,
  },

  annDotWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  annDotRing: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#86B5FF',
  },

  annDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8DB8FF',
  },

  annText: {
    color: '#DCE7FF',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
    flexShrink: 1,
  },

  annTextStrong: {
    color: WHITE,
    fontWeight: '800',
  },

  annLink: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    ...web({
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    }),
  },

  annLinkText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '800',
  },

  topBar: {
    minHeight: 84,
    paddingHorizontal: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
    backgroundColor: WHITE,
    ...web({
      maxWidth: 1600,
      width: '100%',
      alignSelf: 'center',
    }),
  },

  mobileTopBar: {
    minHeight: 70,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
    flexWrap: 'nowrap',
  },

  topBarWide: {
    paddingHorizontal: 44,
    gap: 22,
  },

  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    flexShrink: 0,
  },

  mobileBrandSection: {
    gap: 0,
    flexShrink: 0,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    ...web({ cursor: 'pointer' }),
  },

  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...web({
      boxShadow: '0 3px 12px rgba(18,34,79,0.10)',
    }),
  },

  mobileLogoWrap: {
    width: 39,
    height: 39,
    borderRadius: 10,
  },

  logoImage: {
    width: '100%',
    height: '100%',
  },

  mobileLogoImage: {
    width: '100%',
    height: '100%',
  },

  logo: {
    color: NAVY,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 1.4,
    lineHeight: 29,
  },

  mobileLogo: {
    fontSize: 19,
    letterSpacing: 0.7,
    lineHeight: 23,
  },

  logoTagline: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 2,
  },

  locationBadge: {
    minHeight: 43,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: BG,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    ...web({ transition: 'border-color 0.2s ease' }),
  },

  locationPin: {
    fontSize: 17,
  },

  locationSmallText: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  locationText: {
    color: NAVY,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 1,
  },

  locationArrow: {
    color: MUTED,
    fontSize: 13,
    marginLeft: 2,
  },

  navCenter: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchContainer: {
    height: 44,
    flex: 1,
    maxWidth: 420,
    minWidth: 100,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: '#F8FAFD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    ...web({
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    }),
  },

  mobileSearchContainer: {
    height: 40,
    minWidth: 0,
    maxWidth: '100%',
    paddingHorizontal: 11,
    borderRadius: 11,
    flex: 1,
  },

  // Full-width search bar under the header on screens narrower than 390px.
  // Using flex: 0 here collapses the bar to height 0 on web (that was the
  // thin line in the screenshot), so every flex value is set explicitly.
  compactSearch: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    alignSelf: 'stretch',
    width: 'auto',
    height: 42,
    minHeight: 42,
    marginHorizontal: 14,
    marginTop: 2,
    marginBottom: 12,
  },

  searchContainerWide: {
    maxWidth: 310,
    flex: 1,
  },

  searchContainerFocused: {
    borderColor: BLUE,
    backgroundColor: WHITE,
    ...web({
      boxShadow: '0 0 0 3px rgba(47,111,237,0.10)',
    }),
  },

  searchIcon: {
    color: BLUE,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 28,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    color: TEXT,
    fontSize: 12,
    ...web({
      outlineStyle: 'none',
      backgroundColor: 'transparent',
      borderWidth: 0,
    }),
  },

  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E4E9F2',
    alignItems: 'center',
    justifyContent: 'center',
    ...web({ cursor: 'pointer' }),
  },

  clearButtonText: {
    color: '#5B6577',
    fontSize: 10,
    fontWeight: '900',
  },

  searchShortcut: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: BLUE_SOFT,
  },

  searchShortcutText: {
    color: BLUE,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  accountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    flexShrink: 0,
  },

  accountButton: {
    minHeight: 45,
    maxWidth: 190,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    ...web({
      cursor: 'pointer',
      transition: 'border-color 0.2s ease, background-color 0.2s ease',
    }),
  },

  mobileAccountButton: {
    minHeight: 38,
    width: 38,
    height: 38,
    paddingHorizontal: 0,
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: BLUE_SOFT,
    borderColor: BLUE_SOFT,
  },

  accountIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: BLUE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mobileAccountIconCircle: {
    width: 29,
    height: 29,
    backgroundColor: 'transparent',
  },

  accountIcon: {
    fontSize: 15,
  },

  accountTextContainer: {
    flexShrink: 1,
    minWidth: 0,
  },

  accountSmallText: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  accountName: {
    color: NAVY,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },

  accountArrow: {
    color: MUTED,
    fontSize: 13,
    marginLeft: 2,
  },

  loginButton: {
    minHeight: 43,
    paddingHorizontal: 17,
    borderRadius: 12,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexShrink: 0,
    ...web({
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(47,111,237,0.20)',
      transition: 'background-color 0.2s ease',
    }),
  },

  mobileLoginButton: {
    minHeight: 38,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
  },

  loginIcon: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },

  loginButtonText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '800',
  },

  hamburger: {
    width: 39,
    height: 39,
    borderRadius: 11,
    backgroundColor: BLUE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...web({
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    }),
  },

  hamburgerLines: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  // Red dot on the hamburger when there are unread messages.
  hamburgerDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: RED,
    borderWidth: 1.5,
    borderColor: BLUE_SOFT,
  },

  navigationBar: {
    width: '100%',
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#F0F3F8',
    ...web({
      boxShadow: '0 4px 10px rgba(18,34,79,0.03)',
    }),
  },

  navLinksContainer: {
    minHeight: 54,
    paddingHorizontal: 38,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 27,
    ...web({ minWidth: '100%' }),
  },

  navTrack: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 25,
  },

  navIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: BLUE,
    zIndex: 1,
  },

  navItem: {
    minHeight: 54,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...web({
      cursor: 'pointer',
      transition: 'color 0.2s ease',
    }),
  },

  mobileNavItem: {
    paddingHorizontal: 3,
  },

  navItemHover: {
    opacity: 0.75,
  },

  navItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  navItemInnerWide: {
    gap: 0,
  },

  navItemInnerActive: {
    backgroundColor: 'transparent',
  },

  navIcon: {
    color: '#7C879B',
    fontSize: 13,
    fontWeight: '700',
  },

  navIconActive: {
    color: BLUE,
  },

  navText: {
    color: '#526078',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.65,
  },

  activeNavText: {
    color: BLUE,
    fontWeight: '900',
  },

  // Unread count badge on the MESSAGES item (desktop / tablet nav).
  navBadge: {
    position: 'absolute',
    top: 8,
    right: -10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navBadgeText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
  },

  // ---------- Phone menu (rendered inside a Modal) ----------
  menuOverlay: {
    flex: 1,
  },

  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,17,40,0.45)',
  },

  menuBackdropPress: {
    flex: 1,
  },

  mobileMenu: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: WHITE,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    ...web({
      boxShadow: '0 14px 28px rgba(18,34,79,0.18)',
    }),
  },

  mobileMenuHeader: {
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 12,
  },

  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  menuHeaderText: {
    flex: 1,
    minWidth: 0,
  },

  menuClose: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: BLUE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    ...web({ cursor: 'pointer' }),
  },

  menuCloseText: {
    color: NAVY,
    fontSize: 16,
    fontWeight: '800',
  },

  mobileMenuEyebrow: {
    color: BLUE,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
  },

  mobileMenuTitle: {
    color: NAVY,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },

  mobileItem: {
    minHeight: 48,
    paddingHorizontal: 11,
    marginBottom: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WHITE,
    ...web({
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    }),
  },

  mobileItemActive: {
    backgroundColor: BLUE_SOFT,
  },

  mobileItemIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F4F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mobileItemIconBoxActive: {
    backgroundColor: '#DCE8FF',
  },

  mobileItemIcon: {
    color: NAVY,
    fontSize: 16,
    fontWeight: '700',
  },

  mobileItemLabel: {
    flex: 1,
    color: '#526078',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  mobileItemLabelActive: {
    color: BLUE,
    fontWeight: '900',
  },

  mobileItemBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mobileItemBadgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '900',
  },

  mobileItemArrow: {
    color: BLUE,
    fontSize: 23,
    fontWeight: '500',
  },

  mobileMenuFooter: {
    marginTop: 10,
    paddingTop: 15,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  mobileMenuFooterSmall: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  mobileMenuFooterText: {
    color: NAVY,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
  },
});