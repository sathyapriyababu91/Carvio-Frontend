
import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';

import { getToken } from '../utils/authStorage';

const API_URL = 'http://localhost:8080';

const BOOSTER_PACKS = {
  '15_DAYS': {
    title: '15 Days Booster',
    duration: '15 Days',
  },
  '30_DAYS': {
    title: '30 Days Booster',
    duration: '30 Days',
  },
};

const notify = (title, message, onOk) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);

    if (typeof onOk === 'function') {
      onOk();
    }
  } else {
    Alert.alert(
      title,
      message,
      onOk ? [{ text: 'OK', onPress: onOk }] : undefined
    );
  }
};

const getVehicleIcon = (vehicleType) => {
  if (vehicleType === 'Car') return '🚗';
  if (vehicleType === 'Two Wheeler') return '🏍️';
  if (vehicleType === 'Commercial Vehicle') return '🚚';

  return '🚘';
};

export default function PaymentPage({
  setActiveTab,
  vehicleType,
  paymentMethod,
  carId = null,
  onPaymentSuccess,

  // VEHICLE_LISTING or BOOSTER_PACK
  purpose = 'VEHICLE_LISTING',

  // Required for BOOSTER_PACK
  boostType = null,

  // Optional navigation destination
  backTab = 'SELL CARS',
}) {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [amount, setAmount] = useState(null);

  const isBoosterPayment = purpose === 'BOOSTER_PACK';

  const selectedBooster = boostType
    ? BOOSTER_PACKS[boostType]
    : null;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (loading || verifying) return;

    if (Platform.OS !== 'web') {
      notify(
        'Payment Unavailable',
        'Online payment is currently available only on the web version of CARVIO.'
      );
      return;
    }

    if (!carId) {
      notify(
        'Payment Error',
        'Vehicle information is missing.'
      );
      return;
    }

    if (
      isBoosterPayment &&
      !BOOSTER_PACKS[boostType]
    ) {
      notify(
        'Payment Error',
        'Please select a valid Booster Pack.'
      );
      return;
    }

    if (
      purpose !== 'VEHICLE_LISTING' &&
      purpose !== 'BOOSTER_PACK'
    ) {
      notify(
        'Payment Error',
        'Invalid payment purpose.'
      );
      return;
    }

    try {
      setLoading(true);
      setAmount(null);

      const token = await getToken();

      if (!token) {
        notify(
          'Login Required',
          'Your session has expired. Please login again.'
        );

        setActiveTab('LOGIN');
        return;
      }

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        notify(
          'Payment Error',
          'Razorpay could not be loaded. Please try again.'
        );
        return;
      }

      // CREATE ORDER
      const orderPayload = {
        purpose,
        carId,
      };

      if (isBoosterPayment) {
        orderPayload.boostType = boostType;
      } else {
        orderPayload.vehicleType = vehicleType;
      }

      const response = await fetch(
        `${API_URL}/payment/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        }
      );

      const data = await response.json();

      console.log('CREATE ORDER RESPONSE:', data);

      if (!response.ok || !data.success) {
        notify(
          'Payment Error',
          data.message || 'Unable to create payment order.'
        );
        return;
      }

      const backendAmount = Number(data.amount);

      if (
        !backendAmount ||
        backendAmount <= 0 ||
        !data.order ||
        !data.order.id ||
        !data.keyId
      ) {
        notify(
          'Payment Error',
          'Invalid payment details received from server.'
        );
        return;
      }

      setAmount(backendAmount);

      const paymentDescription = isBoosterPayment
        ? `${selectedBooster.title} - Vehicle Promotion`
        : `${vehicleType} Listing Fee`;

      // RAZORPAY OPTIONS
      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency || 'INR',

        name: 'CARVIO',
        description: paymentDescription,
        order_id: data.order.id,

        prefill: {
          name: 'CARVIO User',
        },

        notes: {
          purpose,
          vehicleType: vehicleType || '',
          boostType: boostType || '',
          paymentMethod: paymentMethod || '',
        },

        theme: {
          color: '#2F6FED',
        },

        // PAYMENT SUCCESS
        handler: async (paymentResponse) => {
          console.log(
            'RAZORPAY PAYMENT RESPONSE:',
            paymentResponse
          );

          setVerifying(true);

          try {
            // VERIFY PAYMENT WITH BACKEND
            const verifyResponse = await fetch(
              `${API_URL}/payment/verify`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            console.log(
              'VERIFY STATUS:',
              verifyResponse.status
            );

            console.log(
              'VERIFY RESPONSE:',
              verifyData
            );

            if (
              !verifyResponse.ok ||
              !verifyData.success
            ) {
              notify(
                'Verification Failed',
                verifyData.message ||
                  'Payment verification failed. Please check your payment status.'
              );
              return;
            }

            console.log(
              'PAYMENT VERIFIED SUCCESSFULLY'
            );

            if (
              typeof onPaymentSuccess === 'function'
            ) {
              onPaymentSuccess({
                purpose,
                vehicleType,
                carId,
                boostType,
                amount: backendAmount,
                paymentResponse,
                verifyData,
              });
            } else {
              notify(
                'Payment Successful',
                `₹${backendAmount.toLocaleString('en-IN')} payment verified successfully.`,
                () => {
                  setActiveTab(
                    isBoosterPayment
                      ? 'MY ADS'
                      : 'MY LISTINGS'
                  );
                }
              );
            }
          } catch (error) {
            console.error(
              'VERIFY PAYMENT ERROR:',
              error
            );

            notify(
              'Verification Error',
              'Payment was completed, but verification could not be confirmed. Please check your payment status before trying again.'
            );
          } finally {
            setVerifying(false);
          }
        },

        // USER CLOSES RAZORPAY
        modal: {
          ondismiss: () => {
            console.log(
              'Razorpay payment popup closed'
            );

            setLoading(false);
            setVerifying(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error('PAYMENT ERROR:', error);

      notify(
        'Payment Error',
        'Something went wrong while starting payment.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getPaymentButtonText = () => {
    if (verifying) return 'VERIFYING PAYMENT...';
    if (loading) return 'PROCESSING...';

    if (amount !== null) {
      return `PAY ₹${amount.toLocaleString('en-IN')}`;
    }

    return 'CONTINUE TO PAYMENT';
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner */}
      <View style={styles.banner}>
        <View
          pointerEvents="none"
          style={styles.bannerGlow}
        />

        <Text style={styles.bannerLabel}>
          SECURE CHECKOUT
        </Text>

        <Text style={styles.title}>
          CARVIO Payment
        </Text>

        <Text style={styles.subtitle}>
          {isBoosterPayment
            ? 'Boost your vehicle listing and get more visibility'
            : 'Pay the listing fee to publish your vehicle'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Order Summary
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIconBox}>
            <Text style={styles.infoIcon}>
              {getVehicleIcon(vehicleType)}
            </Text>
          </View>

          <View style={styles.infoTextBox}>
            <Text style={styles.label}>
              Vehicle Type
            </Text>

            <Text style={styles.value}>
              {vehicleType || 'Vehicle'}
            </Text>
          </View>
        </View>

        {isBoosterPayment ? (
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Text style={styles.infoIcon}>🚀</Text>
            </View>

            <View style={styles.infoTextBox}>
              <Text style={styles.label}>
                Booster Pack
              </Text>

              <Text style={styles.value}>
                {selectedBooster?.title || 'Not selected'}
              </Text>

              <Text style={styles.duration}>
                {selectedBooster?.duration || ''}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Text style={styles.infoIcon}>💳</Text>
            </View>

            <View style={styles.infoTextBox}>
              <Text style={styles.label}>
                Payment Method
              </Text>

              <Text style={styles.value}>
                {paymentMethod || 'Online Payment'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>
            {isBoosterPayment
              ? 'Booster Pack Fee'
              : 'Listing Fee'}
          </Text>

          {amount === null ? (
            <Text style={styles.calculating}>
              Amount will be confirmed by CARVIO
            </Text>
          ) : (
            <Text style={styles.amount}>
              ₹{amount.toLocaleString('en-IN')}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.payButton,
            (loading || verifying) &&
              styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          activeOpacity={0.85}
          disabled={loading || verifying}
        >
          {loading || verifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              {getPaymentButtonText()}
            </Text>
          )}
        </TouchableOpacity>

        {verifying ? (
          <Text style={styles.verifyNote}>
            Please do not close or refresh this page
            while we confirm your payment.
          </Text>
        ) : (
          <Text style={styles.secureNote}>
            🔒 Secure payment powered by Razorpay
          </Text>
        )}

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => {
            if (!loading && !verifying) {
              setActiveTab(backTab);
            }
          }}
          disabled={loading || verifying}
        >
          <Text style={styles.backButtonText}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const NAVY = '#0F1C45';
const NAVY_SOFT = '#12224F';
const BLUE = '#2F6FED';
const BORDER = '#E4EAF4';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  container: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: 20,
    paddingTop: 24,
    paddingBottom: 50,
  },

  banner: {
    padding: 26,
    borderRadius: 24,
    backgroundColor: NAVY,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },

  bannerGlow: {
    position: 'absolute',
    top: -100,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(47,111,237,0.28)',
  },

  bannerLabel: {
    color: '#76A8FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    color: '#C9D4EE',
    marginTop: 5,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: NAVY_SOFT,
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  infoIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  infoIcon: {
    fontSize: 21,
  },

  infoTextBox: {
    flex: 1,
    minWidth: 0,
  },

  label: {
    fontSize: 12.5,
    color: '#6B7A99',
    fontWeight: '600',
    marginBottom: 3,
  },

  value: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#101B36',
  },

  duration: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F6FED',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF2F8',
    marginVertical: 10,
  },

  amountBox: {
    backgroundColor: '#EEF4FF',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    alignItems: 'center',
  },

  amountLabel: {
    textAlign: 'center',
    fontSize: 13.5,
    fontWeight: '700',
    color: '#526079',
  },

  calculating: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#667085',
    marginTop: 8,
  },

  amount: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: '800',
    color: BLUE,
    marginTop: 4,
  },

  payButton: {
    backgroundColor: BLUE,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },

  payButtonDisabled: {
    opacity: 0.7,
  },

  payButtonText: {
    color: '#fff',
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  secureNote: {
    textAlign: 'center',
    fontSize: 12.5,
    color: '#667085',
    marginTop: 14,
  },

  verifyNote: {
    textAlign: 'center',
    fontSize: 12.5,
    fontWeight: '600',
    color: '#B54708',
    marginTop: 14,
    lineHeight: 18,
  },

  backButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  backButtonText: {
    color: BLUE,
    fontSize: 14.5,
    fontWeight: '700',
  },
});
