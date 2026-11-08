import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

import { getToken } from "../utils/authStorage";

const getStrength = (password) => {
  if (!password) {
    return { score: 0, label: "", color: "#E5E7EB" };
  }

  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

  const levels = [
    { label: "Too short", color: "#EF4444" },
    { label: "Weak", color: "#EF4444" },
    { label: "Fair", color: "#F59E0B" },
    { label: "Good", color: "#3B82F6" },
    { label: "Strong", color: "#16A34A" },
  ];

  return { score, ...levels[score] };
};

const PasswordField = ({
  label,
  value,
  onChangeText,
  placeholder,
  visible,
  onToggle,
  helper,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.passwordContainer}>
      <Text style={styles.fieldIcon}>🔑</Text>

      <TextInput
        style={styles.passwordInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!visible}
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
        <Text style={styles.eye}>{visible ? "🙈" : "👁️"}</Text>
      </TouchableOpacity>
    </View>

    {helper}
  </View>
);

const Checklist = ({ items, dark }) => (
  <View style={styles.checklist}>
    {items.map((item) => (
      <View key={item.label} style={styles.checkRow}>
        <View
          style={[
            styles.checkDot,
            dark && styles.checkDotDark,
            item.ok && styles.checkDotOk,
          ]}
        >
          <Text style={styles.checkDotText}>{item.ok ? "✓" : ""}</Text>
        </View>

        <Text
          style={[
            styles.checkLabel,
            dark && styles.checkLabelDark,
            item.ok && (dark ? styles.checkLabelOkDark : styles.checkLabelOk),
          ]}
        >
          {item.label}
        </Text>
      </View>
    ))}
  </View>
);

const ChangePassword = ({ setActiveTab }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const redirectTimer = useRef(null);

  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const isMobile = width < 768;

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  const strength = getStrength(newPassword);

  const checklistItems = [
    {
      label: "At least 6 characters",
      ok: newPassword.length >= 6,
    },
    {
      label: "Different from current password",
      ok: newPassword.length > 0 && newPassword !== currentPassword,
    },
    {
      label: "Matches confirm password",
      ok: confirmPassword.length > 0 && newPassword === confirmPassword,
    },
  ];

  // Alert.alert does not show on web, so messages are shown inside the screen.
  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword.trim()) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      setError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        setError("Please login again.");
        setActiveTab("LOGIN");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      console.log("CHANGE PASSWORD RESPONSE:", data);

      if (!response.ok) {
        setError(data.message || "Unable to change password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password changed successfully! Redirecting...");

      redirectTimer.current = setTimeout(() => {
        setActiveTab("MY ACCOUNT");
      }, 1500);
    } catch (err) {
      console.log("CHANGE PASSWORD ERROR:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const onType = (setter) => (text) => {
    setter(text);
    if (error) setError("");
  };

  const infoPanel = (
    <View
      style={[
        styles.infoPanel,
        isWide ? styles.infoPanelWide : styles.infoPanelNarrow,
      ]}
    >
      <View pointerEvents="none" style={styles.infoGlow} />

      <View style={styles.iconCircle}>
        <Text style={styles.lockIcon}>🔒</Text>
      </View>

      <Text style={styles.infoLabel}>ACCOUNT SECURITY</Text>

      <Text style={[styles.title, isMobile && styles.titleMobile]}>
        Change Password
      </Text>

      <Text style={styles.subtitle}>Keep your account secure</Text>

      {isWide && (
        <View style={styles.infoChecklist}>
          <Text style={styles.infoChecklistTitle}>Password checklist</Text>
          <Checklist items={checklistItems} dark />
        </View>
      )}
    </View>
  );

  const formCard = (
    <View style={[styles.card, isMobile && styles.cardMobile]}>
      {error ? (
        <View style={[styles.banner, styles.bannerError]}>
          <Text style={styles.bannerIcon}>⚠️</Text>
          <Text style={[styles.bannerText, styles.bannerTextError]}>
            {error}
          </Text>
        </View>
      ) : null}

      {success ? (
        <View style={[styles.banner, styles.bannerSuccess]}>
          <Text style={styles.bannerIcon}>✅</Text>
          <Text style={[styles.bannerText, styles.bannerTextSuccess]}>
            {success}
          </Text>
        </View>
      ) : null}

      <PasswordField
        label="Current Password"
        value={currentPassword}
        onChangeText={onType(setCurrentPassword)}
        placeholder="Enter current password"
        visible={showCurrent}
        onToggle={() => setShowCurrent(!showCurrent)}
      />

      <PasswordField
        label="New Password"
        value={newPassword}
        onChangeText={onType(setNewPassword)}
        placeholder="Enter new password"
        visible={showNew}
        onToggle={() => setShowNew(!showNew)}
        helper={
          newPassword ? (
            <View style={styles.strengthWrap}>
              <View style={styles.strengthBars}>
                {[1, 2, 3, 4].map((step) => (
                  <View
                    key={step}
                    style={[
                      styles.strengthBar,
                      strength.score >= step && {
                        backgroundColor: strength.color,
                      },
                    ]}
                  />
                ))}
              </View>

              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          ) : (
            <Text style={styles.helperText}>
              Password must contain at least 6 characters.
            </Text>
          )
        }
      />

      <PasswordField
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={onType(setConfirmPassword)}
        placeholder="Confirm new password"
        visible={showConfirm}
        onToggle={() => setShowConfirm(!showConfirm)}
      />

      {!isWide && <Checklist items={checklistItems} />}

      <TouchableOpacity
        style={[styles.changeButton, loading && styles.disabledButton]}
        activeOpacity={0.85}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.loadingText}>Updating...</Text>
          </>
        ) : (
          <>
            <Text style={styles.buttonText}>Change Password</Text>
            <Text style={styles.arrow}>→</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        activeOpacity={0.85}
        onPress={() => setActiveTab("MY ACCOUNT")}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.content,
          isWide && styles.contentWide,
          isMobile && styles.contentMobile,
        ]}
      >
        {infoPanel}
        <View style={isWide ? styles.formCol : styles.formColStack}>
          {formCard}
        </View>
      </View>
    </ScrollView>
  );
};

const NAVY = "#0F1C45";
const NAVY_SOFT = "#12224F";
const BLUE = "#2F6FED";
const BORDER = "#E4EAF4";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    padding: 24,
    paddingBottom: 60,
    gap: 18,
  },
  contentWide: {
    maxWidth: 1000,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 24,
    paddingTop: 40,
  },
  contentMobile: {
    padding: 14,
    paddingTop: 16,
    gap: 14,
  },

  /* Info / header panel */
  infoPanel: {
    backgroundColor: NAVY,
    borderRadius: 26,
    overflow: "hidden",
    padding: 28,
  },
  infoPanelWide: {
    width: 340,
    padding: 32,
  },
  infoPanelNarrow: {
    width: "100%",
  },
  infoGlow: {
    position: "absolute",
    top: -90,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(47,111,237,0.28)",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  lockIcon: {
    fontSize: 28,
  },
  infoLabel: {
    color: "#76A8FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  titleMobile: {
    fontSize: 26,
  },
  subtitle: {
    fontSize: 14.5,
    color: "#C9D4EE",
    marginTop: 5,
  },
  infoChecklist: {
    marginTop: 30,
    paddingTop: 22,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.14)",
  },
  infoChecklistTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },

  /* Form */
  formCol: {
    flex: 1,
    minWidth: 0,
  },
  formColStack: {
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
  },
  cardMobile: {
    padding: 18,
    borderRadius: 20,
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  bannerError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCCACA",
  },
  bannerSuccess: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF0CC",
  },
  bannerIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  bannerText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "600",
    lineHeight: 19,
  },
  bannerTextError: {
    color: "#B42318",
  },
  bannerTextSuccess: {
    color: "#15803D",
  },

  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#101B36",
    marginBottom: 8,
  },
  passwordContainer: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 12,
    backgroundColor: "#FAFBFE",
  },
  fieldIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#101B36",
    outlineStyle: "none",
  },
  eye: {
    fontSize: 19,
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 7,
  },

  strengthWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },
  strengthBars: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "800",
    minWidth: 58,
    textAlign: "right",
  },

  /* Checklist */
  checklist: {
    gap: 10,
    marginBottom: 4,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkDotDark: {
    borderColor: "rgba(255,255,255,0.35)",
  },
  checkDotOk: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
  checkDotText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 13,
  },
  checkLabel: {
    flex: 1,
    fontSize: 13,
    color: "#6B7A99",
  },
  checkLabelDark: {
    color: "#C9D4EE",
  },
  checkLabelOk: {
    color: "#15803D",
    fontWeight: "600",
  },
  checkLabelOkDark: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  /* Buttons */
  changeButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: BLUE,
    marginTop: 18,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  loadingText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  arrow: {
    fontSize: 22,
    color: "#FFFFFF",
  },
  cancelButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15.5,
    fontWeight: "700",
    color: NAVY_SOFT,
  },
});

export default ChangePassword;