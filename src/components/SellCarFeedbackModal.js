
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';

const API_URL = 'https://carvio-backend.onrender.com';

const showFeedbackAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function SellCarFeedbackModal({
  visible,
  onClose,
  setActiveTab,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('General Support');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setPhone('');
    setCategory('General Support');
    setMessage('');
    setRating(5);
  };

  const closeAndContinue = () => {
    onClose();
    setActiveTab('MY LISTINGS');
  };

  const submitFeedback = async () => {
    if (submitting) return;

    if (!name.trim() || !phone.trim() || !message.trim()) {
      showFeedbackAlert(
        'Missing Details',
        'Please enter your name, mobile number and feedback message.'
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      showFeedbackAlert(
        'Invalid Mobile Number',
        'Enter a valid 10-digit mobile number.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          category,
          message: `Sell Car Experience | Rating: ${rating}/5 | ${message.trim()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to submit feedback.'
        );
      }

      resetForm();
      closeAndContinue();

      showFeedbackAlert(
        'Thank You!',
        'Your feedback has been submitted successfully to CARVIO Support.'
      );
    } catch (error) {
      showFeedbackAlert(
        'Feedback Error',
        error.message || 'Unable to submit feedback. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const skipFeedback = () => {
    if (submitting) return;
    resetForm();
    closeAndContinue();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={skipFeedback}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(10,20,45,0.65)',
          justifyContent: 'center',
          padding: 18,
        }}
      >
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            padding: 22,
            maxHeight: '90%',
          }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#12224F' }}>
              How was your experience?
            </Text>

            <Text style={{ color: '#667085', marginTop: 8, marginBottom: 18 }}>
              Help us improve CARVIO. Your feedback is optional.
            </Text>

            <Text style={{ fontWeight: '700', marginBottom: 8 }}>
              Rate your experience
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 18 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={{ paddingRight: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 32,
                      color: star <= rating ? '#F5A623' : '#D0D5DD',
                    }}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ fontWeight: '700', marginBottom: 6 }}>
              Your Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              style={{
                borderWidth: 1,
                borderColor: '#D0D5DD',
                borderRadius: 10,
                padding: 12,
                marginBottom: 14,
              }}
            />

            <Text style={{ fontWeight: '700', marginBottom: 6 }}>
              Mobile Number
            </Text>
            <TextInput
              value={phone}
              onChangeText={(value) =>
                setPhone(value.replace(/[^0-9]/g, '').slice(0, 10))
              }
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              style={{
                borderWidth: 1,
                borderColor: '#D0D5DD',
                borderRadius: 10,
                padding: 12,
                marginBottom: 14,
              }}
            />

            <Text style={{ fontWeight: '700', marginBottom: 6 }}>
              Feedback Category
            </Text>

            {[
              'General Support',
              'Payment Issue',
              'Car Listing Issue',
              'Account Issue',
              'Other',
            ].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={{
                  padding: 11,
                  marginBottom: 6,
                  borderRadius: 9,
                  borderWidth: 1,
                  borderColor: category === item ? '#2F6FED' : '#E4E7EC',
                  backgroundColor: category === item ? '#EEF4FF' : '#FFFFFF',
                }}
              >
                <Text style={{ color: '#12224F' }}>
                  {category === item ? '✓  ' : '   '}
                  {item}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={{ fontWeight: '700', marginTop: 12, marginBottom: 6 }}>
              Your Feedback
            </Text>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us about your selling experience..."
              multiline
              maxLength={2000}
              style={{
                borderWidth: 1,
                borderColor: '#D0D5DD',
                borderRadius: 10,
                padding: 12,
                minHeight: 100,
                textAlignVertical: 'top',
                marginBottom: 16,
              }}
            />

            <TouchableOpacity
              onPress={submitFeedback}
              disabled={submitting}
              style={{
                backgroundColor: '#2F6FED',
                padding: 15,
                borderRadius: 12,
                alignItems: 'center',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>
                  Submit Feedback
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={skipFeedback}
              disabled={submitting}
              style={{ padding: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#667085', fontWeight: '600' }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
