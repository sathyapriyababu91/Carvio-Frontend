
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { styles } from '../styles/Services.styles';

const serviceList = [
  {
    id: 'inspection',
    icon: '🔍',
    title: 'Vehicle Inspection',
    description:
      'Get help checking vehicle condition before making a purchase.',
    category: 'BUYER SUPPORT',
  },
  {
    id: 'detailing',
    icon: '✨',
    title: 'Car Care & Detailing',
    description:
      'Explore vehicle cleaning, interior care and detailing options.',
    category: 'CAR CARE',
  },
  {
    id: 'listing',
    icon: '📸',
    title: 'Premium Listing Help',
    description:
      'Get assistance preparing vehicle photos and listing information.',
    category: 'SELLER SUPPORT',
  },
  {
    id: 'loan',
    icon: '₹',
    title: 'Loan Assistance',
    description:
      'Get guidance on vehicle financing options and application steps.',
    category: 'FINANCIAL SUPPORT',
  },
  {
    id: 'rc',
    icon: '📄',
    title: 'RC Transfer Assistance',
    description:
      'Get guidance on ownership transfer and vehicle documentation.',
    category: 'DOCUMENTATION',
  },
  {
    id: 'roadside',
    icon: '🛠️',
    title: 'Roadside Assistance',
    description:
      'Request information about breakdown and roadside support.',
    category: 'VEHICLE SUPPORT',
  },
];

export default function Services() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width < 1024;
  const cardWidth = isMobile ? '100%' : isTablet ? '48%' : '31.5%';

  const [selectedService, setSelectedService] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openBooking = (service) => {
    setSelectedService(service);
    setCustomerName('');
    setPhone('');
    setCity('');
    setVehicle('');
    setPreferredDate('');
    setSubmitting(false);
  };

  const closeBooking = () => {
    setSelectedService(null);
  };

  const submitBooking = () => {
    if (
      !customerName.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !vehicle.trim()
    ) {
      Alert.alert(
        'Missing Details',
        'Please enter your name, phone number, city and vehicle details.'
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit Indian mobile number.'
      );
      return;
    }

    if (preferredDate.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate.trim())) {
      Alert.alert(
        'Check Preferred Date',
        'Enter the date in YYYY-MM-DD format, for example 2026-11-20.'
      );
      return;
    }

    setSubmitting(true);

    Alert.alert(
      'Form Completed',
      'Your service request form is ready. Backend integration is required to save this request and send it to CARVIO administrators.',
      [
        {
          text: 'OK',
          onPress: () => {
            setSubmitting(false);
            closeBooking();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.hero,
            isMobile && styles.heroMobile,
          ]}
        >
          <View style={styles.heroContent}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowText}>
                CARVIO SERVICES
              </Text>
            </View>

            <Text
              style={[
                styles.heroTitle,
                isMobile && styles.heroTitleMobile,
              ]}
            >
              More Than Just
              {'\n'}
              <Text style={styles.heroHighlight}>
                Buying & Selling
              </Text>
            </Text>

            <Text style={styles.heroDescription}>
              Discover helpful vehicle services designed to make
              your next automotive journey simpler and more convenient.
            </Text>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() =>
                openBooking(serviceList[0])
              }
              activeOpacity={0.85}
            >
              <Text style={styles.heroButtonText}>
                Explore Services
              </Text>
              <Text style={styles.heroButtonArrow}>↗</Text>
            </TouchableOpacity>

            <View style={styles.heroNote}>
              <Text style={styles.heroNoteText}>
                BUY SMARTER. SELL BETTER.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.heroVisual,
              isMobile && styles.heroVisualMobile,
            ]}
          >
            <View style={styles.visualCircle}>
              <Text style={styles.visualCar}>🚘</Text>
            </View>

            <View style={styles.visualFloatingCard}>
              <View style={styles.visualCheck}>
                <Text style={styles.visualCheckText}>✓</Text>
              </View>
              <View style={styles.visualCardText}>
                <Text style={styles.visualCardTitle}>
                  Your Vehicle Journey
                </Text>
                <Text style={styles.visualCardSubtitle}>
                  Support at every step
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.sectionEyebrow}>
            WHAT WE OFFER
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              isMobile && styles.sectionTitleMobile,
            ]}
          >
            Services For Every Journey
          </Text>

          <Text style={styles.sectionDescription}>
            From finding your next car to preparing your vehicle
            for sale, explore support options available through CARVIO.
          </Text>

          <View style={styles.serviceGrid}>
            {serviceList.map((service, index) => (
              <View
                key={service.id}
                style={[
                  styles.serviceCard,
                  { width: cardWidth },
                ]}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.serviceIconBox}>
                    <Text style={styles.serviceIcon}>
                      {service.icon}
                    </Text>
                  </View>

                  <Text style={styles.serviceNumber}>
                    0{index + 1}
                  </Text>
                </View>

                <Text style={styles.serviceCategory}>
                  {service.category}
                </Text>

                <Text style={styles.serviceTitle}>
                  {service.title}
                </Text>

                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>

                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => openBooking(service)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bookButtonText}>
                    Enquire Now
                  </Text>
                  <Text style={styles.bookButtonArrow}>
                    →
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.processSection}>
          <Text style={styles.sectionEyebrow}>
            SIMPLE & CONVENIENT
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              isMobile && styles.sectionTitleMobile,
            ]}
          >
            How It Works
          </Text>

          <Text style={styles.sectionDescription}>
            Getting started is simple.
          </Text>

          <View
            style={[
              styles.processGrid,
              isMobile && styles.processGridMobile,
            ]}
          >
            <View style={styles.processItem}>
              <View style={styles.processNumber}>
                <Text style={styles.processNumberText}>01</Text>
              </View>
              <Text style={styles.processTitle}>
                Choose a Service
              </Text>
              <Text style={styles.processDescription}>
                Select the service you need.
              </Text>
            </View>

            <View style={styles.processItem}>
              <View style={styles.processNumber}>
                <Text style={styles.processNumberText}>02</Text>
              </View>
              <Text style={styles.processTitle}>
                Share Your Details
              </Text>
              <Text style={styles.processDescription}>
                Tell us your vehicle and contact information.
              </Text>
            </View>

            <View style={styles.processItem}>
              <View style={styles.processNumber}>
                <Text style={styles.processNumberText}>03</Text>
              </View>
              <Text style={styles.processTitle}>
                Request Assistance
              </Text>
              <Text style={styles.processDescription}>
                Submit your request for follow-up.
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.bottomCta,
            isMobile && styles.bottomCtaMobile,
          ]}
        >
          <View style={styles.bottomCtaContent}>
            <Text style={styles.bottomCtaTitle}>
              Need Help With Your Vehicle?
            </Text>
            <Text style={styles.bottomCtaDescription}>
              Choose a service and tell us how we can help.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bottomCtaButton}
            onPress={() =>
              openBooking(serviceList[0])
            }
            activeOpacity={0.85}
          >
            <Text style={styles.bottomCtaButtonText}>
              Get Started
            </Text>
            <Text style={styles.bottomCtaArrow}>↗</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={Boolean(selectedService)}
        transparent
        animationType="slide"
        onRequestClose={closeBooking}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeadingContent}>
                <Text style={styles.modalEyebrow}>
                  CARVIO SERVICES
                </Text>
                <Text style={styles.modalTitle}>
                  Service Enquiry
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedService?.title}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeBooking}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalFormScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.fieldLabel}>
                Your Name *
              </Text>
              <TextInput
                style={styles.input}
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Enter your full name"
                placeholderTextColor="#8A94A8"
                autoCapitalize="words"
              />

              <Text style={styles.fieldLabel}>
                Mobile Number *
              </Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit mobile number"
                placeholderTextColor="#8A94A8"
                keyboardType="phone-pad"
                maxLength={10}
              />

              <Text style={styles.fieldLabel}>
                City *
              </Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Enter your city"
                placeholderTextColor="#8A94A8"
                autoCapitalize="words"
              />

              <Text style={styles.fieldLabel}>
                Vehicle Details *
              </Text>
              <TextInput
                style={styles.input}
                value={vehicle}
                onChangeText={setVehicle}
                placeholder="Example: Hyundai i20, 2022"
                placeholderTextColor="#8A94A8"
              />

              <Text style={styles.fieldLabel}>
                Preferred Date (Optional)
              </Text>
              <TextInput
                style={styles.input}
                value={preferredDate}
                onChangeText={setPreferredDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#8A94A8"
              />

              <Text style={styles.formNote}>
                Submitting this form does not confirm a booking.
                Service availability must be verified separately.
              </Text>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled,
                ]}
                onPress={submitBooking}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <Text style={styles.submitButtonText}>
                  Submit Enquiry
                </Text>
                <Text style={styles.submitButtonArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeBooking}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
