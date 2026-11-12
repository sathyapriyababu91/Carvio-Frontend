import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { styles } from '../styles/HomeListings.styles';
import { getToken } from '../utils/authStorage';
import { API_URL } from '../utils/config';

const HOME_LIMIT = 8;

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
// coordinates. Only a readable place name is shown.
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

// The seller's phone number may be saved on the car or on the seller.
const getPhone = (car) => {
  const seller = typeof car.seller === 'object' ? car.seller || {} : {};

  const value =
    car.phone ||
    car.mobile ||
    car.contactNumber ||
    car.sellerPhone ||
    seller.phone ||
    seller.mobile ||
    seller.phoneNumber ||
    '';

  return String(value).replace(/[^\d+]/g, '');
};

const getValidImageUrl = (image) => {
  if (!image || typeof image !== 'string') return null;

  const clean = image.trim();

  if (!clean || clean.startsWith('blob:') || clean.startsWith('data:')) {
    return null;
  }

  return clean;
};

const isBoostActive = (vehicle) =>
  vehicle.boostStatus === 'ACTIVE' &&
  vehicle.boostEndDate &&
  new Date(vehicle.boostEndDate).getTime() > Date.now();

const formatPosted = (date) => {
  if (!date) return '';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '';

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
};

export default function HomeListings({
  vehicleType = '',
  setActiveTab,
  onOpenVehicle,
}) {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isWideScreen = width >= 1500;

  const cardWidth = isMobile
    ? '100%'
    : isWideScreen
      ? '31%'
      : '48%';

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [failedImages, setFailedImages] = useState({});
  const [likedVehicles, setLikedVehicles] = useState([]);

  const loadFavourites = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) return;

      const response = await fetch(`${API_URL}/user/favourites`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();

      if (data.success) {
        setLikedVehicles(
          (data.favourites || [])
            .map((item) => (typeof item === 'string' ? item : item?._id))
            .filter(Boolean)
        );
      }
    } catch (err) {
      console.log('HOME LOAD FAVOURITES ERROR:', err);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/car/all`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setVehicles([]);
        setError(data.message || 'Unable to load vehicles.');
        return;
      }

      const formatted = (data.cars || [])
        .filter((car) => !car.status || car.status === 'ACTIVE')
        .map((car) => ({
          id: car._id,
          _id: car._id,
          seller:
            typeof car.seller === 'object' ? car.seller?._id : car.seller,
          phone: getPhone(car),
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
            `${car.brand || ''} ${car.modelName || car.model || ''}`.trim() ||
            'Used Vehicle',
          brand: car.brand || '',
          model: car.modelName || car.model || '',
          variant: car.variant || '',
          year: car.year,
          fuelType: car.fuelType || '',
          transmission: car.transmission || '',
          kmsDriven: Number(car.kmsDriven) || 0,
          price: Number(car.price) || 0,
          location: car.location || 'Location not available',
          locationText: getLocationText(car.location),
          images: Array.isArray(car.images)
            ? car.images.filter(Boolean)
            : [],
          condition: car.condition || 'Used Vehicle',
          ownerType: car.ownerType || '1st Owner',
          description: car.description || '',
          expiresAt: car.expiresAt,
          status: car.status,
          createdAt: car.createdAt || null,
          boostStatus: car.boostStatus || 'NONE',
          boostEndDate: car.boostEndDate || null,
        }));

      setVehicles(formatted);
    } catch (err) {
      console.log('HOME LISTINGS ERROR:', err);
      setVehicles([]);
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    loadFavourites();
  }, [fetchVehicles, loadFavourites]);

  // Boosted ads first, then the newest ads.
  const visibleVehicles = vehicles
    .filter((vehicle) => !vehicleType || vehicle.type === vehicleType)
    .sort((a, b) => {
      const aBoost = isBoostActive(a);
      const bBoost = isBoostActive(b);

      if (aBoost && !bBoost) return -1;
      if (!aBoost && bBoost) return 1;

      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });

  const shownVehicles = visibleVehicles.slice(0, HOME_LIMIT);

  const openVehicle = (vehicle) => {
    if (typeof onOpenVehicle === 'function') {
      onOpenVehicle(vehicle);
    } else if (typeof setActiveTab === 'function') {
      setActiveTab('BUY CARS');
    }
  };

  const handleLike = async (vehicleId) => {
    try {
      const token = await getToken();

      if (!token) {
        notify(
          'Login Required',
          'Please login to add vehicles to favourites.'
        );

        if (typeof setActiveTab === 'function') {
          setActiveTab('LOGIN');
        }

        return;
      }

      const response = await fetch(
        `${API_URL}/user/favourite/${vehicleId}`,
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
        throw new Error(data.message || 'Unable to update favourite');
      }

      setLikedVehicles((previous) => {
        if (data.isFavourite) {
          return previous.includes(vehicleId)
            ? previous
            : [...previous, vehicleId];
        }

        return previous.filter((id) => id !== vehicleId);
      });
    } catch (err) {
      console.log('HOME FAVOURITE ERROR:', err);
      notify('Error', err.message || 'Unable to update favourite');
    }
  };

  const handleCall = async (vehicle) => {
    if (!vehicle.phone) {
      notify(
        'Number not available',
        'The seller has not shared a phone number. Please use Chat.'
      );
      return;
    }

    try {
      await Linking.openURL(`tel:${vehicle.phone}`);
    } catch (err) {
      console.log('HOME CALL ERROR:', err);
      notify('Call failed', 'Unable to open the phone dialer.');
    }
  };

  const heading =
    vehicleType === 'Car'
      ? 'Cars for you'
      : vehicleType === 'Two Wheeler'
        ? 'Two wheelers for you'
        : vehicleType === 'Commercial Vehicle'
          ? 'Commercial vehicles for you'
          : 'Fresh recommendations';

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <View style={styles.headingTextWrap}>
          <Text style={styles.heading}>{heading}</Text>

          {!loading && !error ? (
            <Text style={styles.headingCount}>
              {visibleVehicles.length} vehicles available
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={() => setActiveTab && setActiveTab('BUY CARS')}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Text style={styles.viewAll}>View all →</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color="#2F6FED" />
          <Text style={styles.stateText}>Loading vehicles...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>⚠️</Text>
          <Text style={styles.stateTitle}>Something went wrong</Text>
          <Text style={styles.stateText}>{error}</Text>

          <Pressable style={styles.stateButton} onPress={fetchVehicles}>
            <Text style={styles.stateButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : shownVehicles.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>🚘</Text>
          <Text style={styles.stateTitle}>No vehicles found</Text>
          <Text style={styles.stateText}>
            No listings in this category yet. Check back soon.
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {shownVehicles.map((vehicle) => {
            const image =
              !failedImages[vehicle.id] && vehicle.images.length > 0
                ? getValidImageUrl(vehicle.images[0])
                : null;

            const posted = formatPosted(vehicle.createdAt);
            const featured = isBoostActive(vehicle);
            const isLiked = likedVehicles.includes(vehicle.id);

            return (
              <View
                key={vehicle.id}
                style={[styles.card, { width: cardWidth }]}
              >
                <Pressable
                  onPress={() => openVehicle(vehicle)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${vehicle.title}`}
                >
                  <View style={styles.imageWrap}>
                    {image ? (
                      <Image
                        source={{ uri: image }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={() =>
                          setFailedImages((previous) => ({
                            ...previous,
                            [vehicle.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Text style={styles.placeholderIcon}>
                          {vehicle.icon}
                        </Text>
                        <Text style={styles.placeholderText}>
                          No Image Available
                        </Text>
                      </View>
                    )}

                    {featured ? (
                      <View style={styles.featuredBadge}>
                        <Text style={styles.featuredBadgeText}>
                          FEATURED
                        </Text>
                      </View>
                    ) : null}

                    <Pressable
                      style={({ pressed }) => [
                        styles.likeButton,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => handleLike(vehicle.id)}
                      hitSlop={6}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isLiked
                          ? 'Remove from favourites'
                          : 'Add to favourites'
                      }
                    >
                      <Text
                        style={[
                          styles.likeIcon,
                          isLiked && styles.likeIconActive,
                        ]}
                      >
                        {isLiked ? '♥' : '♡'}
                      </Text>
                    </Pressable>

                    {vehicle.images.length > 1 ? (
                      <View style={styles.photoCount}>
                        <Text style={styles.photoCountText}>
                          1/{vehicle.images.length}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>
                        ₹ {formatNumber(vehicle.price)}
                      </Text>

                      {posted ? (
                        <Text style={styles.posted}>{posted}</Text>
                      ) : null}
                    </View>

                    <Text style={styles.title} numberOfLines={1}>
                      {vehicle.title}
                    </Text>

                    <Text style={styles.meta} numberOfLines={1}>
                      {[
                        vehicle.year,
                        vehicle.fuelType,
                        vehicle.kmsDriven
                          ? `${formatNumber(vehicle.kmsDriven)} km`
                          : '',
                        vehicle.transmission,
                      ]
                        .filter(Boolean)
                        .join('  •  ')}
                    </Text>

                    <Text style={styles.location} numberOfLines={1}>
                      📍 {vehicle.locationText || 'Location not available'}
                    </Text>
                  </View>
                </Pressable>

                <View style={styles.actionRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.callButton,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleCall(vehicle)}
                    accessibilityRole="button"
                    accessibilityLabel="Call seller"
                  >
                    <Text style={styles.callButtonText}>📞  Call</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {!loading && !error && visibleVehicles.length > HOME_LIMIT ? (
        <Pressable
          style={({ pressed }) => [
            styles.moreButton,
            pressed && styles.pressed,
          ]}
          onPress={() => setActiveTab && setActiveTab('BUY CARS')}
          accessibilityRole="button"
        >
          <Text style={styles.moreButtonText}>
            View all {visibleVehicles.length} vehicles →
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}