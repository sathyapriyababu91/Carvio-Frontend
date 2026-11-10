import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

import { API_URL } from "../utils/config";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register({ setActiveTab }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // UI only states
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState(null);

  // Alert does not work on web, so messages are shown inside the screen
  const showError = (text) => setMessage({ type: "error", text });
  const showSuccess = (text) => setMessage({ type: "success", text });
  const clearMessage = () => {
    if (message) setMessage(null);
  };

  // ================= REGISTER =================

  const handleRegister = async () => {
    setMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !phone || !password || !confirmPassword) {
      showError("Please fill all required fields");
      return;
    }

    if (phone.length !== 10) {
      showError("Please enter a valid 10-digit phone number");
      return;
    }

    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      showError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      console.log("REGISTER DATA SENT:", {
        name: trimmedName,
        email: trimmedEmail,
        phone,
      });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          // empty email is not sent at all
          email: trimmedEmail || undefined,
          phone: phone,
          password: password,
        }),
      });

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok || !data.success) {
        showError(
          data.message || data.error || "Unable to register"
        );
        return;
      }

      setRegistered(true);
      showSuccess("Account created! Taking you to login...");

      setTimeout(() => {
        setActiveTab("LOGIN");
      }, 1500);
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      showError("Unable to connect to the CARVIO server.");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={rs.container}
        contentContainerStyle={rs.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <View style={rs.card}>

          {/* ---------- Header ---------- */}
          <View style={rs.header}>
            <View style={rs.logoCircle}>
              <Image
                source={require("../assets/logo.png")}
                style={rs.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={rs.logo}>CARVIO</Text>
            <Text style={rs.tagline}>PREMIUM AUTO MARKET</Text>
          </View>

          <View style={rs.divider} />

          <Text style={rs.title}>Create Account</Text>

          <Text style={rs.subtitle}>
            Register to start buying & selling on CARVIO
          </Text>

          {/* ---------- Full Name ---------- */}
          <View style={rs.field}>
            <Text style={rs.label}>Full Name</Text>

            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                clearMessage();
              }}
              placeholder="Enter your full name"
              placeholderTextColor="#98A2B3"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
              style={[rs.input, focused === "name" && rs.inputFocused]}
            />
          </View>

          {/* ---------- Email ---------- */}
          <View style={rs.field}>
            <Text style={rs.label}>
              Email <Text style={rs.optional}>(Optional)</Text>
            </Text>

            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearMessage();
              }}
              placeholder="Enter your email"
              placeholderTextColor="#98A2B3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              style={[rs.input, focused === "email" && rs.inputFocused]}
            />
          </View>

          {/* ---------- Phone ---------- */}
          <View style={rs.field}>
            <Text style={rs.label}>Phone Number</Text>

            <View
              style={[rs.phoneRow, focused === "phone" && rs.inputFocused]}
            >
              <View style={rs.countryCode}>
                <Text style={rs.countryCodeText}>+91</Text>
              </View>

              <TextInput
                value={phone}
                onChangeText={(t) => {
                  setPhone(t.replace(/[^0-9]/g, ""));
                  clearMessage();
                }}
                placeholder="Enter mobile number"
                placeholderTextColor="#98A2B3"
                keyboardType="phone-pad"
                maxLength={10}
                autoComplete="tel"
                textContentType="telephoneNumber"
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused("")}
                style={rs.phoneInput}
              />
            </View>

            <Text style={rs.hint}>
              📱 You will use this number to login with OTP
            </Text>
          </View>

          {/* ---------- Password ---------- */}
          <View style={rs.field}>
            <Text style={rs.label}>Password</Text>

            <View
              style={[rs.passwordRow, focused === "password" && rs.inputFocused]}
            >
              <TextInput
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  clearMessage();
                }}
                placeholder="Min 6 characters"
                placeholderTextColor="#98A2B3"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                style={rs.passwordInput}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={rs.eyeButton}
                activeOpacity={0.7}
              >
                <Text style={rs.eyeText}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ---------- Confirm Password ---------- */}
          <View style={rs.field}>
            <Text style={rs.label}>Confirm Password</Text>

            <View
              style={[rs.passwordRow, focused === "confirm" && rs.inputFocused]}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  clearMessage();
                }}
                placeholder="Re-enter password"
                placeholderTextColor="#98A2B3"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                onFocus={() => setFocused("confirm")}
                onBlur={() => setFocused("")}
                style={rs.passwordInput}
              />

              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={rs.eyeButton}
                activeOpacity={0.7}
              >
                <Text style={rs.eyeText}>{showConfirm ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ---------- Message (error / success) ---------- */}
          {message ? (
            <View
              style={[
                rs.messageBox,
                message.type === "error"
                  ? rs.messageError
                  : rs.messageSuccess,
              ]}
            >
              <Text style={rs.messageIcon}>
                {message.type === "error" ? "⚠️" : "✅"}
              </Text>
              <Text
                style={[
                  rs.messageText,
                  message.type === "error"
                    ? rs.messageTextError
                    : rs.messageTextSuccess,
                ]}
              >
                {message.text}
              </Text>
            </View>
          ) : null}

          {/* ---------- Register Button ---------- */}
          <TouchableOpacity
            onPress={handleRegister}
            style={[rs.button, (loading || registered) && rs.buttonDisabled]}
            activeOpacity={0.85}
            disabled={loading || registered}
          >
            {loading ? (
              <View style={rs.loadingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={[rs.buttonText, { marginLeft: 10 }]}>
                  Creating Account...
                </Text>
              </View>
            ) : (
              <Text style={rs.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          {/* ---------- Login link ---------- */}
          <TouchableOpacity
            onPress={() => setActiveTab("LOGIN")}
            style={rs.loginLink}
            activeOpacity={0.7}
          >
            <Text style={rs.loginLinkText}>
              Already have an account?{" "}
              <Text style={rs.loginLinkBold}>Login</Text>
            </Text>
          </TouchableOpacity>

          <View style={rs.secureBox}>
            <Text style={rs.secureText}>
              🔒 Your details are secure with CARVIO
            </Text>
          </View>

          <Text style={rs.termsText}>
            By registering, you agree to CARVIO's Terms of Service and
            Privacy Policy.
          </Text>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ================= STYLES (Register page-ku mattum) =================

const rs = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5FB",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  card: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 26,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },

  // ----- header -----
  header: {
    alignItems: "center",
  },

  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#0F1B3D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },

  logoImage: {
    width: 56,
    height: 56,
  },

  logo: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#0F1B3D",
  },

  tagline: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#2F6FED",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF1F6",
    marginTop: 20,
    marginBottom: 20,
  },

  // ----- titles -----
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F1B3D",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#667085",
    marginBottom: 22,
  },

  // ----- fields -----
  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D2939",
    marginBottom: 8,
  },

  optional: {
    fontWeight: "500",
    color: "#98A2B3",
  },

  hint: {
    fontSize: 12,
    color: "#667085",
    marginTop: 6,
    marginLeft: 2,
  },

  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#E4E7EC",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#101828",
    backgroundColor: "#F9FAFB",
    ...Platform.select({
      web: { outlineStyle: "none" },
      default: {},
    }),
  },

  inputFocused: {
    borderColor: "#2F6FED",
    backgroundColor: "#FFFFFF",
  },

  // ----- phone -----
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1.5,
    borderColor: "#E4E7EC",
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },

  countryCode: {
    height: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF3FF",
    borderRightWidth: 1.5,
    borderRightColor: "#E4E7EC",
  },

  countryCodeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2F6FED",
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#101828",
    borderWidth: 0,
    ...Platform.select({
      web: { outlineStyle: "none" },
      default: {},
    }),
  },

  // ----- password -----
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1.5,
    borderColor: "#E4E7EC",
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    paddingLeft: 16,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#101828",
    borderWidth: 0,
    ...Platform.select({
      web: { outlineStyle: "none" },
      default: {},
    }),
  },

  eyeButton: {
    height: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  eyeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2F6FED",
  },

  // ----- message box -----
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 6,
  },

  messageError: {
    backgroundColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },

  messageSuccess: {
    backgroundColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },

  messageIcon: {
    fontSize: 15,
    marginRight: 10,
  },

  messageText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  messageTextError: {
    color: "#B42318",
  },

  messageTextSuccess: {
    color: "#067647",
  },

  // ----- button -----
  button: {
    height: 54,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#2F6FED",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2F6FED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ----- footer -----
  loginLink: {
    marginTop: 18,
    alignItems: "center",
    paddingVertical: 4,
  },

  loginLinkText: {
    fontSize: 14,
    color: "#667085",
  },

  loginLinkBold: {
    color: "#2F6FED",
    fontWeight: "700",
  },

  secureBox: {
    marginTop: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F2F7F4",
    alignItems: "center",
  },

  secureText: {
    fontSize: 12,
    color: "#027A48",
    fontWeight: "600",
  },

  termsText: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 16,
    color: "#98A2B3",
    textAlign: "center",
  },
});