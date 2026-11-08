import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

import { setAuthData } from "../utils/authStorage";
import { connectSocket } from "../utils/socket";
import { API_URL } from "../utils/config";
import {
  styles,
  getResponsiveStyles,
} from "../styles/Login.styles";

const RESEND_SECONDS = 30;

const benefits = [
  "Buy and sell vehicles easily",
  "Chat directly with sellers",
  "Manage your listings and favourites",
];

export default function Login({ setActiveTab }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const r = getResponsiveStyles(width);

  // Resend OTP countdown
  useEffect(() => {
    if (countdown <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Alert.alert does not show on web, so messages are shown inside the screen.
  const showError = (text) => setMessage({ type: "error", text });
  const showSuccess = (text) => setMessage({ type: "success", text });

  // SEND OTP

  const handleSendOTP = async () => {
    setMessage(null);

    if (!phone) {
      showError("Please enter your phone number");
      return;
    }

    if (phone.length !== 10) {
      showError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      console.log("PHONE SENT TO SERVER:", phone);

      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
        }),
      });

      const data = await response.json();

      console.log("SEND OTP STATUS:", response.status, data.success);

      // Development only: __DEV__ is false in a release build, so this
      // never prints (or exposes) the OTP in the Play Store app.
      if (__DEV__ && data.otp) {
        console.log("DEVELOPMENT OTP:", data.otp);
      }

      if (!response.ok || !data.success) {
        showError(
          data.message ||
            data.error ||
            "Unable to send OTP"
        );
        return;
      }

      setOtpSent(true);
      setOtp("");
      setCountdown(RESEND_SECONDS);

      showSuccess(data.message || "OTP sent successfully!");
    } catch (error) {
      console.log("SEND OTP ERROR:", error);

      showError("Unable to connect to the CARVIO server.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP

  const handleVerifyOTP = async () => {
    setMessage(null);

    if (!otp) {
      showError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      showError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      console.log("VERIFY PHONE:", phone);

      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          otp: otp,
        }),
      });

      const data = await response.json();

      console.log("VERIFY OTP STATUS:", response.status, data.success);

      if (!response.ok || !data.success) {
        showError(
          data.message ||
            data.error ||
            "Invalid OTP"
        );
        return;
      }

      // LOGIN SUCCESS

      await setAuthData(data.token, data.user);

      // CONNECT SOCKET AFTER LOGIN
      // A socket problem must not make a successful login look like a failure.

      try {
        await connectSocket();
      } catch (socketError) {
        console.log("SOCKET CONNECT ERROR:", socketError);
      }

      setActiveTab("HOME");
    } catch (error) {
      console.log("VERIFY OTP ERROR:", error);

      showError("Unable to connect to the CARVIO server.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setCountdown(0);
    setMessage(null);
  };

  const buttonLabel = loading
    ? otpSent
      ? "Verifying..."
      : "Sending OTP..."
    : otpSent
    ? "Verify OTP"
    : "Send OTP";

  // UI

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, r.scrollContent]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.shell, r.shell]}>
        {/* Brand panel (wide screens only) */}
        {isWide && (
          <View style={styles.brandPanel}>
            <View pointerEvents="none" style={styles.brandGlowOne} />
            <View pointerEvents="none" style={styles.brandGlowTwo} />

            <View style={styles.brandLogoCircle}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.brandLogoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.brandName}>CARVIO</Text>
            <Text style={styles.brandTagline}>PREMIUM AUTO MARKET</Text>

            <Text style={styles.brandHeading}>
              Your next vehicle is just a login away.
            </Text>

            {benefits.map((benefit) => (
              <View key={benefit} style={styles.benefitRow}>
                <View style={styles.benefitDot}>
                  <Text style={styles.benefitDotText}>✓</Text>
                </View>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Form card */}
        <View style={[styles.card, r.card]}>
          {!isWide && (
            <View style={styles.mobileBrand}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.logo}>CARVIO</Text>
              <Text style={styles.tagline}>PREMIUM AUTO MARKET</Text>
            </View>
          )}

          <Text style={[styles.title, r.title]}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            {otpSent
              ? `Enter the 6-digit OTP sent to +91 ${phone}`
              : "Login to continue to your CARVIO account"}
          </Text>

          {message ? (
            <View
              style={[
                styles.messageBox,
                message.type === "error"
                  ? styles.messageError
                  : styles.messageSuccess,
              ]}
            >
              <Text style={styles.messageIcon}>
                {message.type === "error" ? "⚠️" : "✅"}
              </Text>
              <Text
                style={[
                  styles.messageText,
                  message.type === "error"
                    ? styles.messageTextError
                    : styles.messageTextSuccess,
                ]}
              >
                {message.text}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Phone Number</Text>

          <View
            style={[
              styles.phoneRow,
              focusedField === "phone" && styles.phoneRowFocused,
              otpSent && styles.phoneRowLocked,
            ]}
          >
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>

            <TextInput
              value={phone}
              onChangeText={(text) => {
                setPhone(text.replace(/[^0-9]/g, ""));
                if (message) setMessage(null);
              }}
              placeholder="Enter mobile number"
              placeholderTextColor="#98A2B3"
              keyboardType="phone-pad"
              maxLength={10}
              editable={!otpSent}
              style={styles.input}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              onSubmitEditing={!otpSent ? handleSendOTP : undefined}
              accessibilityLabel="Phone number"
            />

            {otpSent && (
              <TouchableOpacity
                style={styles.changeNumber}
                onPress={handleChangeNumber}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Change phone number"
              >
                <Text style={styles.changeNumberText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>

          {otpSent && (
            <>
              <Text style={styles.label}>Enter OTP</Text>

              <TextInput
                value={otp}
                onChangeText={(text) => {
                  setOtp(text.replace(/[^0-9]/g, ""));
                  if (message) setMessage(null);
                }}
                placeholder="• • • • • •"
                placeholderTextColor="#C0C7D4"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                style={[
                  styles.otpInput,
                  focusedField === "otp" && styles.otpInputFocused,
                ]}
                onFocus={() => setFocusedField("otp")}
                onBlur={() => setFocusedField(null)}
                onSubmitEditing={handleVerifyOTP}
                accessibilityLabel="One time password"
              />

              <View style={styles.resendRow}>
                {countdown > 0 ? (
                  <Text style={styles.resendMuted}>
                    Resend OTP in {countdown}s
                  </Text>
                ) : (
                  <>
                    <Text style={styles.resendMuted}>
                      Didn't receive the OTP?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={handleSendOTP}
                      disabled={loading}
                      accessibilityRole="button"
                    >
                      <Text style={styles.resendLink}>Resend</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}

          <TouchableOpacity
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            style={[styles.button, loading && styles.buttonDisabled]}
            activeOpacity={0.85}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.buttonText}>{buttonLabel}</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>{buttonLabel}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.secureText}>
            🔒 Your phone number is secure with CARVIO
          </Text>

          <View style={styles.registerRow}>
            <Text style={styles.registerMuted}>New to CARVIO? </Text>

            <TouchableOpacity
              onPress={() => setActiveTab("REGISTER")}
              accessibilityRole="button"
            >
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to CARVIO's Terms of Service and
            Privacy Policy.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}