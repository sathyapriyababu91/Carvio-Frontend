import React, { useState } from "react";

import {View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView,} from "react-native";

import { styles } from "../styles/Login.styles";

export default function Register({ setActiveTab }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= REGISTER =================

  const handleRegister = async () => {

    if (!name || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
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
        Alert.alert(
          "Registration Failed",
          data.message || data.error || "Unable to register"
        );
        return;
      }

      Alert.alert(
        "Registration Successful",
        "Your account has been created! Please login to continue.",
        
      );
      setActiveTab("LOGIN");

    } catch (error) {
      console.log("REGISTER ERROR:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the CARVIO server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >

      <View style={styles.card}>

        <Text style={styles.logo}>CARVIO</Text>
        <Text style={styles.tagline}>PREMIUM AUTO MARKET</Text>

        <View style={styles.logoCircle}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Register to start buying & selling on CARVIO
        </Text>

        <Text style={styles.label}>Full Name</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#98A2B3"
          style={styles.input}
        />

        <Text style={styles.label}>Email (Optional)</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#98A2B3"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Phone Number</Text>

        <View style={styles.phoneRow}>

          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter mobile number"
            placeholderTextColor="#98A2B3"
            keyboardType="phone-pad"
            maxLength={10}
            style={styles.input}
          />

        </View>

        <Text style={styles.label}>Password</Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password (min 6 characters)"
          placeholderTextColor="#98A2B3"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirm Password</Text>

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter password"
          placeholderTextColor="#98A2B3"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating Account..." : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("LOGIN")}
          style={{ marginTop: 15, alignItems: "center" }}
        >
          <Text style={{ color: "#2F6FED", fontSize: 14 }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>

        <Text style={styles.secureText}>
          🔒 Your details are secure with CARVIO
        </Text>

      </View>

    </ScrollView>
  );
}