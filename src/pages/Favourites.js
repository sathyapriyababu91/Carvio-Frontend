import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';

import { getToken } from '../utils/authStorage';
import { API_URL } from '../utils/config';
import CarDetails from './CarDetails';

const API = API_URL;

// Alert.alert does nothing on react-native-web, so use window.alert there.
const notify = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('en-IN') : '0';
};

// The location can be a city name, a { city } object, or raw "lat,lng"
// coordinates. Only a readable place name is shown to people.
const getLocationText = (location) => {
  if (!location) return '';

  if (typeof location === 'object') {
    return location.city || location.address || '';
  }

  const text = String(location).trim();
  const parts = text.split(',');

  const looksLikeCoordinates =
    parts.length === 2 &&
    parts.every(
      (part) =>
        part.trim() !== '' && !Number.isNaN(Number(part.trim()))
    );

  return looksLikeCoordinates ? '' : text;
};

const getValidImageUrl = (image) => {
  if (!image || typeof image !== 'string') return null;

  const clean = image.trim();

  if (
    !clean ||
    clean.startsWith('blob:') ||
    clean.startsWith('data:')
  ) {
    return null;
  }

  return clean;
};

// Same shape the Buy Cars page uses, so the details screen works for both.
const formatCar = (car) => ({
  id: car._id,
  seller:
    typeof car.seller === 'object' ? car.seller?._id : car.seller,
  type: car.vehicleType,
  bodyType: car.bodyType || car.bodyTypeName || car.carType || '',
  icon:
    car.vehicleType === 'Car'
      ? '🚗'
      : car.vehicleType === 'Two Wheeler'
        ? '🏍️'
        : '🚚',
  title:
    car.title ||
    `${car.brand || ''} ${car.modelName || ''}`.trim() ||
    'Used Vehicle',
  brand: car.brand || '',
  model: car.modelName || '',
  year: car.year,
  fuelType: car.fuelType || '',
  transmission: car.transmission || '',
  kmsDriven: Number(car.kmsDriven) || 0,
  price: Number(car.price) || 0,
  location: car.location || 'Location not available',
  locationText: getLocationText(car.location),
  images: Array.isArray(car.images) ? car.images.filter(Boolean) : [],
  condition: car.condition || 'Used Vehicle',
  ownerType: car.ownerType || '1st Owner',
  description: car.description || '',
  expiresAt: car.expiresAt,
  status: car.status,
});

const FavouriteCard = ({
  vehicle,
  width,
  removing,
  onRemove,
  onView,
}) => {
  const image =
    vehicle.images.length > 0
      ? getValidImageUrl(vehicle.images[0])
      : null;

  return (
    <View style={[styles.vehicleCard, { width }]}>
      <View style={styles.imageBox}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>{vehicle.icon}</Text>
            <Text style={styles.placeholderText}>
              No Image Available
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.heartButton, removing && styles.heartDisabled]}
          onPress={() => onRemove(vehicle.id)}
          activeOpacity={0.8}
          disabled={removing}
          accessibilityLabel="Remove from favourites"
        >
          {removing ? (
            <ActivityIndicator size="small" color="#E5383B" />
          ) : (
            <Text style={styles.heartIcon}>❤️</Text>
          )}
        </TouchableOpacity>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Pre-owned</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.vehicleTitle} numberOfLines={2}>
          {vehicle.title}
        </Text>

        <Text style={styles.vehicleSub} numberOfLines={1}>
          {[vehicle.fuelType, vehicle.transmission]
            .filter(Boolean)
            .join(' • ')}
        </Text>

        <Text style={styles.price}>₹{formatNumber(vehicle.price)}*</Text>

        <View style={styles.specsRow}>
          <View style={styles.specChip}>
            <Text style={styles.specText}>📅 {vehicle.year || '-'}</Text>
          </View>

          <View style={styles.specChip}>
            <Text style={styles.specText}>
              ⏱️ {formatNumber(vehicle.kmsDriven)} kms
            </Text>
          </View>

          <View style={styles.specChip}>
            <Text style={styles.specText}>👤 {vehicle.ownerType}</Text>
          </View>
        </View>

        {vehicle.locationText ? (
          <Text style={styles.locationText} numberOfLines={1}>
            📍 {vehicle.locationText}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onView(vehicle)}
          activeOpacity={0.85}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Favourites({ setActiveTab }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const go = (tab) => setActiveTab?.(tab);

  const loadFavourites = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setNeedsLogin(false);

      const token = await getToken();

      if (!token) {
        setVehicles([]);
        setNeedsLogin(true);
        return;
      }

      const response = await fetch(`${API}/user/favourites`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setVehicles([]);
        setNeedsLogin(true);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load favourites');
      }

      const items = (data.favourites || []).filter(Boolean);

      // The server may send full car objects or only car ids.
      let cars = items.filter((item) => typeof item === 'object');
      const ids = items.filter((item) => typeof item === 'string');

      if (ids.length > 0) {
        const carsResponse = await fetch(`${API}/car/all`);
        const carsData = await carsResponse.json();

        const allCars = carsResponse.ok ? carsData.cars || [] : [];

        cars = [
          ...cars,
          ...allCars.filter((car) => ids.includes(car._id)),
        ];
      }

      setVehicles(
        cars
          .filter((car) => !car.status || car.status === 'ACTIVE')
          .map(formatCar)
      );
    } catch (err) {
      console.log('LOAD FAVOURITES ERROR:', err);
      setVehicles([]);
      setError(err.message || 'Unable to connect to CARVIO server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  const handleRemove = async (vehicleId) => {
    if (removingId) return;

    try {
      setRemovingId(vehicleId);

      const token = await getToken();

      if (!token) {
        setNeedsLogin(true);
        return;
      }

      // The same endpoint the heart button on Buy Cars uses (toggle).
      const response = await fetch(
        `${API}/user/favourite/${vehicleId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to remove from favourites'
        );
      }

      if (!data.isFavourite) {
        setVehicles((previous) =>
          previous.filter((vehicle) => vehicle.id !== vehicleId)
        );
      }
    } catch (err) {
      console.log('REMOVE FAVOURITE ERROR:', err);
      notify(
        'Error',
        err.message || 'Unable to remove from favourites'
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (selectedVehicle) {
    return (
      <CarDetails
        key={selectedVehicle.id}
        car={selectedVehicle}
        onBack={() => setSelectedVehicle(null)}
      />
    );
  }

  const cardWidth = isMobile ? '100%' : '48%';

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color="#2F6FED" />
          <Text style={styles.stateTitle}>Loading favourites...</Text>
        </View>
      );
    }

    if (needsLogin) {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>🔐</Text>
          <Text style={styles.stateTitle}>Login required</Text>
          <Text style={styles.stateText}>
            Please login to see the vehicles you have saved.
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
          <Text style={styles.stateTitle}>Unable to load favourites</Text>
          <Text style={styles.stateText}>{error}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={loadFavourites}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (vehicles.length === 0) {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>🤍</Text>
          <Text style={styles.stateTitle}>No favourites yet</Text>
          <Text style={styles.stateText}>
            Tap the heart on any vehicle to save it here.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => go('BUY CARS')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Browse Vehicles</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {vehicles.map((vehicle) => (
          <FavouriteCard
            key={vehicle.id}
            vehicle={vehicle}
            width={cardWidth}
            removing={removingId === vehicle.id}
            onRemove={handleRemove}
            onView={setSelectedVehicle}
          />
        ))}
      </View>
    );
  };

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
          <Text style={styles.bannerIconText}>❤️</Text>
        </View>

        <View style={styles.bannerText}>
          <Text style={styles.bannerLabel}>MY FAVOURITES</Text>

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Saved Vehicles
          </Text>

          <Text style={styles.subtitle}>
            {loading || needsLogin || error
              ? 'Vehicles you have liked'
              : `${vehicles.length} vehicle${
                  vehicles.length === 1 ? '' : 's'
                } saved`}
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

  /* Cards */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  imageBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#EEF2F8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  placeholderText: {
    fontSize: 12.5,
    color: '#98A2B3',
    marginTop: 6,
    fontWeight: '600',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  heartDisabled: {
    opacity: 0.7,
  },
  heartIcon: {
    fontSize: 19,
  },
  badge: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: 'rgba(15,28,69,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  vehicleTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: NAVY_SOFT,
  },
  vehicleSub: {
    fontSize: 13,
    color: '#667085',
    marginTop: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: BLUE,
    marginTop: 10,
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  specChip: {
    backgroundColor: '#F1F5FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  specText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34466D',
  },
  locationText: {
    fontSize: 12.5,
    color: '#667085',
    marginTop: 10,
  },
  viewButton: {
    height: 46,
    borderRadius: 13,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 9,
    elevation: 3,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
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