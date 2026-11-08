import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";

import {
  getUser,
  getUserId,
  getToken,
  setAuthData,
} from "../utils/authStorage";

// outlineStyle is a web-only style; keep it away from native platforms.
const WEB_NO_OUTLINE =
  Platform.OS === "web" ? { outlineStyle: "none" } : {};

const Field = ({ label, children, helper, width }) => (
  <View style={[styles.inputGroup, { width }]}>
    <Text style={styles.label}>{label}</Text>
    {children}
    {helper ? <Text style={styles.helperText}>{helper}</Text> : null}
  </View>
);

// TextInput with a blue focus highlight (UI only)
const FormInput = ({ style, onFocus, onBlur, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      {...props}
      style={[styles.input, style, focused && styles.inputFocused]}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
    />
  );
};

const EditProfile = ({ setActiveTab }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [message, setMessage] = useState(null);

  const scrollRef = useRef(null);
  const redirectTimer = useRef(null);

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const half = isMobile ? "100%" : "48.5%";
  const third = isMobile ? "100%" : "31.5%";

  useEffect(() => {
    loadUser();

    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  // Alert.alert does not show on web, so messages are shown inside the screen.
  const notify = (type, text) => {
    setMessage({ type, text });
    scrollRef.current?.scrollTo?.({ y: 0, animated: true });
  };

  // LOAD USER
  const loadUser = async () => {
    try {
      const user = await getUser();

      if (user) {
        setName(user.name || "");
        setPhone(user.phone || "");
        setEmail(user.email || "");

        setCity(user.address?.city || "");
        setState(user.address?.state || "");
        setPincode(user.address?.pincode || "");
      }
    } catch (error) {
      console.log("EDIT PROFILE LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // SAVE PROFILE
  const handleSave = async () => {
    // Prevent double submit while saving or while redirecting after success
    if (saving || message?.type === "success") {
      return;
    }

    try {
      setMessage(null);

      if (!name.trim()) {
        notify("error", "Please enter your name.");
        return;
      }

      if (!email.trim()) {
        notify("error", "Please enter your email.");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        notify("error", "Please enter a valid email address.");
        return;
      }

      if (pincode && pincode.length !== 6) {
        notify("error", "Please enter a valid 6-digit pincode.");
        return;
      }

      const userId = await getUserId();
      const token = await getToken();

      if (!userId) {
        notify("error", "User ID not found. Please login again.");
        return;
      }

      if (!token) {
        notify("error", "Login token not found. Please login again.");
        return;
      }

      setSaving(true);

      const response = await fetch(
        `http://localhost:8080/user/update/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone,
            address: {
              city: city.trim(),
              state: state.trim(),
              pincode: pincode.trim(),
            },
          }),
        }
      );

      const data = await response.json();

      console.log("UPDATE PROFILE RESPONSE:", data);

      if (!response.ok) {
        notify(
          "error",
          data.message || data.error || "Unable to update profile."
        );
        return;
      }

      // UPDATE LOCAL LOGIN DATA
      if (data.user) {
        const currentToken = await getToken();

        await setAuthData(currentToken, {
          ...data.user,
          id: data.user._id || data.user.id,
        });
      }

      notify("success", "Your profile has been updated successfully!");

      redirectTimer.current = setTimeout(() => {
        setActiveTab("MY PROFILE");
      }, 1400);
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error);
      notify("error", "Unable to connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F6FED" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const initial = (name.trim()[0] || "?").toUpperCase();

  const locked = saving || message?.type === "success";

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.content, isMobile && styles.contentMobile]}>
          {/* BANNER */}
          <View style={[styles.banner, isMobile && styles.bannerMobile]}>
            <View pointerEvents="none" style={styles.bannerGlow} />

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>

            <View style={styles.bannerText}>
              <Text style={styles.bannerLabel}>EDIT PROFILE</Text>
              <Text style={[styles.title, isMobile && styles.titleMobile]}>
                {name.trim() || "Your Profile"}
              </Text>
              <Text style={styles.subtitle}>
                Update your personal details
              </Text>
            </View>
          </View>

          {/* MESSAGE */}
          {message ? (
            <View
              style={[
                styles.banner2,
                message.type === "error"
                  ? styles.banner2Error
                  : styles.banner2Success,
              ]}
            >
              <Text style={styles.banner2Icon}>
                {message.type === "error" ? "⚠️" : "✅"}
              </Text>
              <Text
                style={[
                  styles.banner2Text,
                  message.type === "error"
                    ? styles.banner2TextError
                    : styles.banner2TextSuccess,
                ]}
              >
                {message.text}
              </Text>
            </View>
          ) : null}

          {/* PERSONAL DETAILS */}
          <View style={[styles.card, isMobile && styles.cardMobile]}>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <View style={styles.grid}>
              <Field label="Name" width={half}>
                <FormInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#9CA3AF"
                />
              </Field>

              <Field label="Email" width={half}>
                <FormInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Field>

              <Field
                label="Phone Number"
                width="100%"
                helper="Phone number cannot be changed because it is used for login."
              >
                <View style={[styles.input, styles.disabledInput, styles.lockedRow]}>
                  <TextInput
                    style={styles.lockedInput}
                    value={phone}
                    editable={false}
                    placeholder="Phone number"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              </Field>
            </View>
          </View>

          {/* ADDRESS */}
          <View style={[styles.card, isMobile && styles.cardMobile]}>
            <Text style={styles.sectionTitle}>Address</Text>

            <View style={styles.grid}>
              <Field label="City" width={third}>
                <FormInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                  placeholderTextColor="#9CA3AF"
                />
              </Field>

              <Field label="State" width={third}>
                <FormInput
                  value={state}
                  onChangeText={setState}
                  placeholder="Enter your state"
                  placeholderTextColor="#9CA3AF"
                />
              </Field>

              <Field label="Pincode" width={third}>
                <FormInput
                  value={pincode}
                  onChangeText={(text) =>
                    setPincode(text.replace(/[^0-9]/g, ""))
                  }
                  placeholder="6-digit pincode"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={6}
                />
              </Field>
            </View>
          </View>

          {/* ACTIONS */}
          <View style={[styles.actions, isMobile && styles.actionsMobile]}>
            <TouchableOpacity
              style={[styles.cancelButton, isMobile && styles.fullButton]}
              activeOpacity={0.85}
              onPress={() => setActiveTab("MY PROFILE")}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                isMobile && styles.fullButton,
                locked && styles.disabledButton,
              ]}
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={locked}
            >
              {saving ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.savingText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                  <Text style={styles.arrow}>→</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const NAVY = "#0F1C45";
const NAVY_SOFT = "#12224F";
const BLUE = "#2F6FED";
const BORDER = "#E4EAF4";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  container: {
    flex: 1,
  },

  content: {
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
    padding: 28,
    paddingBottom: 60,
  },
  contentMobile: {
    padding: 14,
    paddingTop: 16,
  },

  /* Banner */
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 28,
    borderRadius: 26,
    backgroundColor: NAVY,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  bannerMobile: {
    padding: 18,
    borderRadius: 20,
  },
  bannerGlow: {
    position: "absolute",
    top: -100,
    right: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(47,111,237,0.28)",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: BLUE,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  bannerText: {
    flex: 1,
    minWidth: 0,
  },
  bannerLabel: {
    color: "#76A8FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  titleMobile: {
    fontSize: 23,
  },
  subtitle: {
    fontSize: 14,
    color: "#C9D4EE",
    marginTop: 4,
  },

  /* Message */
  banner2: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  banner2Error: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCCACA",
  },
  banner2Success: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF0CC",
  },
  banner2Icon: {
    fontSize: 16,
    marginRight: 10,
  },
  banner2Text: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "600",
    lineHeight: 19,
  },
  banner2TextError: {
    color: "#B42318",
  },
  banner2TextSuccess: {
    color: "#15803D",
  },

  /* Cards */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 26,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cardMobile: {
    padding: 18,
    borderRadius: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: NAVY_SOFT,
    marginBottom: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#101B36",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#101B36",
    backgroundColor: "#FAFBFE",
    ...WEB_NO_OUTLINE,
  },
  inputFocused: {
    borderColor: BLUE,
    backgroundColor: "#FFFFFF",
  },
  disabledInput: {
    backgroundColor: "#F1F3F7",
    borderColor: "#E5E7EB",
  },
  lockedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lockedInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: "#6B7280",
    ...WEB_NO_OUTLINE,
  },
  lockIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 7,
  },

  /* Actions */
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 4,
  },
  actionsMobile: {
    flexDirection: "column-reverse",
  },
  fullButton: {
    width: "100%",
  },
  cancelButton: {
    height: 54,
    minWidth: 140,
    paddingHorizontal: 26,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15.5,
    fontWeight: "700",
    color: NAVY_SOFT,
  },
  saveButton: {
    height: 54,
    minWidth: 200,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  savingText: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  arrow: {
    fontSize: 20,
    color: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8FC",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
});

export default EditProfile;