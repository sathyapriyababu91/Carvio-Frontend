import { StyleSheet, Platform } from "react-native";

const NAVY = "#0F1C45";
const NAVY_SOFT = "#12224F";
const BLUE = "#2F6FED";
const BORDER = "#E4EAF4";

// "outlineStyle" only exists on the web; it is invalid on Android / iOS.
const noOutline = Platform.OS === "web" ? { outlineStyle: "none" } : {};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },

  shell: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
  },

  /* ---------- Brand panel (desktop) ---------- */
  brandPanel: {
    flex: 1,
    backgroundColor: NAVY,
    padding: 44,
    overflow: "hidden",
    justifyContent: "center",
  },
  brandGlowOne: {
    position: "absolute",
    top: -120,
    right: -90,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(47,111,237,0.26)",
  },
  brandGlowTwo: {
    position: "absolute",
    bottom: -140,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(118,168,255,0.10)",
  },
  brandLogoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  brandLogoImage: {
    width: 62,
    height: 62,
  },
  brandName: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 3,
  },
  brandTagline: {
    color: "#76A8FF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.5,
    marginTop: 6,
  },
  brandHeading: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
    marginTop: 34,
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  benefitDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(118,168,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  benefitDotText: {
    color: "#76A8FF",
    fontSize: 13,
    fontWeight: "800",
  },
  benefitText: {
    flex: 1,
    color: "#D5DEF3",
    fontSize: 14.5,
    lineHeight: 21,
  },

  /* ---------- Form card ---------- */
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 28,
    paddingVertical: 34,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: NAVY_SOFT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },

  /* Compact brand header inside the card (mobile / tablet) */
  mobileBrand: {
    alignItems: "center",
    marginBottom: 22,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: NAVY_SOFT,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  logoImage: {
    width: 58,
    height: 58,
  },
  logo: {
    fontSize: 26,
    fontWeight: "800",
    color: NAVY_SOFT,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 11.5,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    letterSpacing: 2,
    marginTop: 4,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#101B36",
    marginBottom: 7,
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 14.5,
    color: "#667085",
    lineHeight: 22,
    marginBottom: 26,
  },

  /* Message banner */
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  messageError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCCACA",
  },
  messageSuccess: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF0CC",
  },
  messageIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  messageText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "600",
    lineHeight: 19,
  },
  messageTextError: {
    color: "#B42318",
  },
  messageTextSuccess: {
    color: "#15803D",
  },

  label: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#101B36",
    marginBottom: 9,
  },

  phoneRow: {
    flexDirection: "row",
    height: 56,
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    borderRadius: 16,
    backgroundColor: "#FAFBFE",
    marginBottom: 20,
    overflow: "hidden",
  },
  phoneRowFocused: {
    borderColor: BLUE,
    backgroundColor: "#FFFFFF",
  },
  phoneRowLocked: {
    backgroundColor: "#F1F3F7",
  },

  countryCode: {
    width: 68,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#E4E8F0",
    backgroundColor: "#F3F6FB",
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#101B36",
  },

  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#101B36",
    ...noOutline,
  },

  changeNumber: {
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  changeNumberText: {
    color: BLUE,
    fontSize: 13,
    fontWeight: "800",
  },

  otpInput: {
    height: 60,
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    borderRadius: 16,
    backgroundColor: "#FAFBFE",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 10,
    color: "#101B36",
    marginBottom: 12,
    ...noOutline,
  },
  otpInputFocused: {
    borderColor: BLUE,
    backgroundColor: "#FFFFFF",
  },

  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  resendMuted: {
    fontSize: 13,
    color: "#667085",
  },
  resendLink: {
    fontSize: 13,
    fontWeight: "800",
    color: BLUE,
  },

  button: {
    height: 56,
    backgroundColor: BLUE,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  secureText: {
    fontSize: 12.5,
    color: "#98A2B3",
    textAlign: "center",
    marginTop: 18,
  },

  registerRow: {
    marginTop: 22,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  registerMuted: {
    fontSize: 14,
    color: "#667085",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "800",
    color: BLUE,
  },

  termsText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: "#98A2B3",
    textAlign: "center",
    marginTop: 16,
  },
});

/**
 * wide   : >= 900  -> brand panel + form side by side
 * narrow : <  900  -> single centered card
 */
export function getResponsiveStyles(width) {
  if (width >= 900) {
    return {
      shell: {
        maxWidth: 980,
        flexDirection: "row",
        alignItems: "stretch",
        borderRadius: 28,
        overflow: "hidden",
        shadowColor: NAVY_SOFT,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.12,
        shadowRadius: 36,
      },
      card: {
        flex: 1,
        borderRadius: 0,
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        paddingHorizontal: 44,
        paddingVertical: 48,
        justifyContent: "center",
      },
    };
  }

  if (width < 390) {
    return {
      scrollContent: { paddingHorizontal: 12, paddingVertical: 18 },
      card: { paddingHorizontal: 18, paddingVertical: 26, borderRadius: 20 },
      title: { fontSize: 24 },
    };
  }

  return {};
}