import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';

const API = 'http://localhost:8080/feedbacks';

// outlineStyle is a web-only style; keep it away from native platforms.
const WEB_NO_OUTLINE =
  Platform.OS === 'web' ? { outlineStyle: 'none' } : {};

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

export default function HelpSupport({ setActiveTab }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('General Support');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'General Support',
    'Payment Issue',
    'Car Listing Issue',
    'Account Issue',
    'Other',
  ];

  const showMessage = (title, text) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${text}`);
    } else {
      Alert.alert(title, text);
    }
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !phone.trim() ||
      !message.trim()
    ) {
      showMessage(
        'Missing Details',
        'Please enter your name, phone number and feedback message.'
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      showMessage(
        'Invalid Phone Number',
        'Please enter a valid 10-digit Indian mobile number.'
      );
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          category,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const serverError = new Error(
          data.message || 'Unable to submit feedback.'
        );

        // Mark errors that came from the server so the real reason is shown
        serverError.fromServer = true;

        throw serverError;
      }

      showMessage(
        'Thank You!',
        'Your feedback has been submitted successfully to CARVIO Support.'
      );

      setName('');
      setPhone('');
      setCategory('General Support');
      setMessage('');
    } catch (error) {
      console.error('FEEDBACK SUBMISSION ERROR:', error);

      showMessage(
        'Submission Failed',
        error.fromServer
          ? error.message
          : 'Unable to submit feedback. Please check that the CARVIO backend is running and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View pointerEvents="none" style={styles.heroGlow} />

        <Text style={styles.tag}>
          CARVIO SUPPORT CENTER
        </Text>

        <Text style={styles.title}>
          Help & Support
        </Text>

        <Text style={styles.subtitle}>
          Need help with CARVIO? Tell us your issue or share your feedback.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Send Your Feedback
        </Text>

        <Text style={styles.description}>
          Fill in the details below so our support team can understand your concern.
        </Text>

        <Text style={styles.label}>Full Name *</Text>

        <FormInput
          placeholder="Enter your name"
          placeholderTextColor="#8A94A6"
          value={name}
          onChangeText={setName}
          maxLength={100}
        />

        <Text style={styles.label}>Mobile Number *</Text>

        <FormInput
          placeholder="Enter 10-digit mobile number"
          placeholderTextColor="#8A94A6"
          value={phone}
          onChangeText={(value) =>
            setPhone(value.replace(/\D/g, '').slice(0, 10))
          }
          keyboardType="phone-pad"
          maxLength={10}
        />

        <Text style={styles.label}>
          Feedback Category *
        </Text>

        <View style={styles.categoryList}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                category === item && styles.categorySelected,
              ]}
              onPress={() => setCategory(item)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item &&
                    styles.categoryTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          Describe Your Issue *
        </Text>

        <FormInput
          style={styles.messageInput}
          placeholder="Tell us how we can help..."
          placeholderTextColor="#8A94A6"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
          maxLength={2000}
        />

        <Text style={styles.counter}>
          {message.length}/2000 characters
        </Text>

        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              Submit Feedback
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          * Required fields
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          How can we help?
        </Text>

        <Text style={styles.infoText}>
          • Payment and listing fee questions
        </Text>

        <Text style={styles.infoText}>
          • Problems posting or editing a vehicle
        </Text>

        <Text style={styles.infoText}>
          • Login and account-related issues
        </Text>

        <Text style={styles.infoText}>
          • Suggestions to improve CARVIO
        </Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => setActiveTab('HOME')}
      >
        <Text style={styles.backButtonText}>
          ← Back to Home
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  hero: {
    backgroundColor: '#0F1C45',
    borderRadius: 24,
    padding: 28,
    marginBottom: 22,
    overflow: 'hidden',
    shadowColor: '#0F1C45',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  heroGlow: {
    position: 'absolute',
    top: -100,
    right: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(47,111,237,0.28)',
  },
  tag: {
    color: '#76A8FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    color: '#C9D4EE',
    fontSize: 15,
    lineHeight: 23,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E4EAF4',
    marginBottom: 20,
    shadowColor: '#0F1C45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cardTitle: {
    color: '#12224F',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    color: '#667085',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },
  label: {
    color: '#25345A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    width: '100%',
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: '#D6DCE8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#12224F',
    backgroundColor: '#FAFBFE',
    ...WEB_NO_OUTLINE,
  },
  inputFocused: {
    borderColor: '#2F6FED',
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    minHeight: 130,
    paddingTop: 14,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    borderWidth: 1.5,
    borderColor: '#D6DCE8',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  categorySelected: {
    backgroundColor: '#EAF1FF',
    borderColor: '#2F6FED',
  },
  categoryText: {
    color: '#526079',
    fontSize: 13.5,
    fontWeight: '700',
  },
  categoryTextSelected: {
    color: '#2459C5',
  },
  counter: {
    color: '#7A8498',
    textAlign: 'right',
    fontSize: 12,
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#2F6FED',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    shadowColor: '#2F6FED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
  },
  note: {
    color: '#7A8498',
    fontSize: 12,
    marginTop: 12,
  },
  infoCard: {
    backgroundColor: '#EEF4FF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCE7FF',
  },
  infoTitle: {
    color: '#12224F',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 12,
  },
  infoText: {
    color: '#34466D',
    fontSize: 14,
    lineHeight: 25,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: '#2F6FED',
    fontSize: 14,
    fontWeight: '700',
  },
});