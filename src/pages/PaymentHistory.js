import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';

import { getToken } from '../utils/authStorage';
import { API_URL } from '../utils/config';

const API = API_URL;

// The endpoint that returns the logged-in user's payments.
const PAYMENTS_ENDPOINT = `${API}/payment/my-payments`;

// Set to true if the server stores amounts in paise (₹1 = 100 paise).
const AMOUNT_IN_PAISE = false;

const SUCCESS_STATUSES = [
  'PAID',
  'SUCCESS',
  'SUCCESSFUL',
  'CAPTURED',
  'COMPLETED',
  'VERIFIED',
];

const PENDING_STATUSES = ['CREATED', 'PENDING', 'ATTEMPTED', 'PROCESSING'];

const formatAmount = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return '₹0';

  const rupees = AMOUNT_IN_PAISE ? number / 100 : number;

  return `₹${rupees.toLocaleString('en-IN')}`;
};

const formatDate = (value) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const shortId = (value) => {
  if (!value) return '';

  const text = String(value);

  return text.length > 18 ? `${text.slice(0, 18)}…` : text;
};

const getVehicleIcon = (vehicleType) => {
  if (vehicleType === 'Car') return '🚗';
  if (vehicleType === 'Two Wheeler') return '🏍️';
  if (vehicleType === 'Commercial Vehicle') return '🚚';

  return '💳';
};

const getStatusInfo = (status) => {
  const clean = String(status || '').trim().toUpperCase();

  if (SUCCESS_STATUSES.includes(clean)) {
    return { label: 'Paid', kind: 'success' };
  }

  if (PENDING_STATUSES.includes(clean)) {
    return { label: 'Pending', kind: 'pending' };
  }

  return { label: clean ? clean : 'Failed', kind: 'failed' };
};

// The payment record can use slightly different field names, so read
// the common ones and build one simple shape for the screen.
const formatPayment = (payment, index) => {
  const carObject =
    payment.car && typeof payment.car === 'object'
      ? payment.car
      : payment.carId && typeof payment.carId === 'object'
        ? payment.carId
        : null;

  const vehicleType =
    payment.vehicleType || carObject?.vehicleType || '';

  const carTitle = carObject
    ? carObject.title ||
      `${carObject.brand || ''} ${carObject.modelName || ''}`.trim()
    : '';

  return {
    id: payment._id || payment.id || `payment-${index}`,
    vehicleType,
    title:
      carTitle ||
      `${vehicleType || 'Vehicle'} ${
        payment.purpose === 'REACTIVATION'
          ? 'Listing Reactivation'
          : 'Listing Fee'
      }`,
    amount: payment.amount,
    status: getStatusInfo(payment.status),
    date: payment.paidAt || payment.createdAt || payment.date,
    paymentId:
      payment.razorpayPaymentId ||
      payment.razorpay_payment_id ||
      payment.paymentId ||
      '',
    orderId:
      payment.razorpayOrderId ||
      payment.razorpay_order_id ||
      payment.orderId ||
      '',
  };
};

const PaymentCard = ({ payment, width }) => (
  <View style={[styles.paymentCard, { width }]}>
    <View style={styles.cardTop}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>
          {getVehicleIcon(payment.vehicleType)}
        </Text>
      </View>

      <View style={styles.cardTitleBox}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {payment.title}
        </Text>

        <Text style={styles.cardDate}>{formatDate(payment.date)}</Text>
      </View>

      <View style={styles.amountBox}>
        <Text style={styles.amountText}>
          {formatAmount(payment.amount)}
        </Text>
      </View>
    </View>

    <View style={styles.cardBottom}>
      <View
        style={[
          styles.statusChip,
          payment.status.kind === 'success' && styles.statusSuccess,
          payment.status.kind === 'pending' && styles.statusPending,
          payment.status.kind === 'failed' && styles.statusFailed,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            payment.status.kind === 'success' && styles.statusTextSuccess,
            payment.status.kind === 'pending' && styles.statusTextPending,
            payment.status.kind === 'failed' && styles.statusTextFailed,
          ]}
        >
          {payment.status.label}
        </Text>
      </View>

      {payment.paymentId ? (
        <Text style={styles.idText} numberOfLines={1}>
          Payment ID: {shortId(payment.paymentId)}
        </Text>
      ) : payment.orderId ? (
        <Text style={styles.idText} numberOfLines={1}>
          Order ID: {shortId(payment.orderId)}
        </Text>
      ) : null}
    </View>
  </View>
);

export default function PaymentHistory({ setActiveTab }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);

  const go = (tab) => setActiveTab?.(tab);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setNeedsLogin(false);

      const token = await getToken();

      if (!token) {
        setPayments([]);
        setNeedsLogin(true);
        return;
      }

      const response = await fetch(PAYMENTS_ENDPOINT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setPayments([]);
        setNeedsLogin(true);
        return;
      }

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Unable to load payment history');
      }

      const list = Array.isArray(data)
        ? data
        : data.payments || data.history || data.data || [];

      const formatted = list
        .filter(Boolean)
        .map(formatPayment)
        .sort(
          (a, b) =>
            (new Date(b.date).getTime() || 0) -
            (new Date(a.date).getTime() || 0)
        );

      setPayments(formatted);
    } catch (err) {
      console.log('LOAD PAYMENT HISTORY ERROR:', err);
      setPayments([]);
      setError(err.message || 'Unable to connect to CARVIO server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const totalPaid = payments
    .filter((payment) => payment.status.kind === 'success')
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  const cardWidth = isMobile ? '100%' : '48%';

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color="#2F6FED" />
          <Text style={styles.stateTitle}>Loading payments...</Text>
        </View>
      );
    }

    if (needsLogin) {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>🔐</Text>
          <Text style={styles.stateTitle}>Login required</Text>
          <Text style={styles.stateText}>
            Please login to see your payment history.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => go('LOGIN')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>⚠️</Text>
          <Text style={styles.stateTitle}>
            Unable to load payment history
          </Text>
          <Text style={styles.stateText}>{error}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={loadPayments}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (payments.length === 0) {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>🧾</Text>
          <Text style={styles.stateTitle}>No payments yet</Text>
          <Text style={styles.stateText}>
            Your listing payments will appear here once you sell a
            vehicle.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => go('SELL CARS')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Sell a Vehicle</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {payments.map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            width={cardWidth}
          />
        ))}
      </View>
    );
  };

  const showSummary = !loading && !needsLogin && !error;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isMobile && styles.contentMobile,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.banner, isMobile && styles.bannerMobile]}>
        <View pointerEvents="none" style={styles.bannerGlow} />

        <View style={styles.bannerIcon}>
          <Text style={styles.bannerIconText}>💳</Text>
        </View>

        <View style={styles.bannerText}>
          <Text style={styles.bannerLabel}>PAYMENT HISTORY</Text>

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Your Payments
          </Text>

          <Text style={styles.subtitle}>
            {showSummary
              ? `${payments.length} payment${
                  payments.length === 1 ? '' : 's'
                }${
                  totalPaid > 0
                    ? ` • ${formatAmount(totalPaid)} paid`
                    : ''
                }`
              : 'Your vehicle listing payments'}
          </Text>
        </View>
      </View>

      {renderContent()}

      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => go('MY ACCOUNT')}
      >
        <Text style={styles.backButtonText}>← Back to My Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const NAVY = '#0F1C45';
const NAVY_SOFT = '#12224F';
const BLUE = '#2F6FED';
const BORDER = '#E4EAF4';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  content: {
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
    padding: 28,
    paddingBottom: 60,
  },
  contentMobile: {
    padding: 14,
    paddingTop: 16,
  },

  /* Banner */
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
    borderRadius: 26,
    backgroundColor: NAVY,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  bannerMobile: {
    padding: 20,
    borderRadius: 20,
  },
  bannerGlow: {
    position: 'absolute',
    top: -100,
    right: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(47,111,237,0.28)',
  },
  bannerIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  bannerIconText: {
    fontSize: 30,
  },
  bannerText: {
    flex: 1,
    minWidth: 0,
  },
  bannerLabel: {
    color: '#76A8FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  titleMobile: {
    fontSize: 23,
  },
  subtitle: {
    fontSize: 14,
    color: '#C9D4EE',
    marginTop: 4,
  },

  /* Payment cards */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 21,
  },
  cardTitleBox: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#101B36',
  },
  cardDate: {
    fontSize: 12,
    color: '#6B7A99',
    marginTop: 3,
  },
  amountBox: {
    marginLeft: 10,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    color: NAVY_SOFT,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F8',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: '#E8F8EE',
  },
  statusPending: {
    backgroundColor: '#FFF4E0',
  },
  statusFailed: {
    backgroundColor: '#FDECEC',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  statusTextSuccess: {
    color: '#15803D',
  },
  statusTextPending: {
    color: '#B54708',
  },
  statusTextFailed: {
    color: '#B42318',
  },
  idText: {
    flex: 1,
    textAlign: 'right',
    fontSize: 11.5,
    color: '#98A2B3',
    marginLeft: 10,
  },

  /* States */
  stateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 44,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  stateIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: NAVY_SOFT,
    marginTop: 6,
    textAlign: 'center',
  },
  stateText: {
    fontSize: 14,
    color: '#667085',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 21,
    maxWidth: 320,
  },
  primaryButton: {
    backgroundColor: BLUE,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 13,
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  backButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: BLUE,
  },
});