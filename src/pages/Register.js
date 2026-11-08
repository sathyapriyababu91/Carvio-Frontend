import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

// Alert.alert web-la work aagaadhu, so web-ku window.alert use panrom
const showAlert = (title, message) => {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
};

export default function Register({ setActiveTab }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // UI only states
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ================= REGISTER =================

  const handleRegister = async () => {

    if (!name || !phone || !password || !confirmPassword) {
      showAlert("Error", "Please fill all required fields");
      return;
    }

    if (phone.length !== 10) {
      showAlert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    if (password.length < 6) {
      showAlert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      console.log("REGISTER DATA SENT:", { name, email, phone });

      const response = await fetch(
        "http://localhost:8080/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok || !data.success) {
        showAlert(
          "Registration Failed",
          data.message || data.error || "Unable to register"
        );
        return;
      }

      showAlert(
        "Registration Successful",
        "Your account has been created! Please login to continue."
      );
      setActiveTab("LOGIN");

    } catch (error) {
      console.log("REGISTER ERROR:", error);

      showAlert(
        "Connection Error",
        "Unable to connect to the CARVIO server."
      );
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
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#98A2B3"
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
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#98A2B3"
              keyboardType="email-address"
              autoCapitalize="none"
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
                onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ""))}
                placeholder="Enter mobile number"
                placeholderTextColor="#98A2B3"
                keyboardType="phone-pad"
                maxLength={10}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused("")}
                style={rs.phoneInput}
              />
            </View>
          </View>

          {/* ---------- Password ---------- */}
          <View style={rs.field}>
            <Text style={rs.label}>Password</Text>

            <View
              style={[rs.passwordRow, focused === "password" && rs.inputFocused]}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min 6 characters"
                placeholderTextColor="#98A2B3"
                secureTextEntry={!showPassword}
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
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor="#98A2B3"
                secureTextEntry={!showConfirm}
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

          {/* ---------- Register Button ---------- */}
          <TouchableOpacity
            onPress={handleRegister}
            style={[rs.button, loading && rs.buttonDisabled]}
            activeOpacity={0.85}
            disabled={loading}
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

  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#E4E7EC",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#101828",
    backgroundColor: "#F9FAFB",
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
    outlineStyle: "none",
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
    outlineStyle: "none",
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
});