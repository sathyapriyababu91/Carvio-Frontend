import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Share,
  Platform,
  useWindowDimensions,
} from 'react-native';

import { styles } from '../styles/BuyCars.styles';
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

const priceOptions = {
  Car: [
    { label: '₹15,000 - ₹1,00,000', min: 15000, max: 100000 },
    { label: '₹1,00,000 - ₹2,00,000', min: 100000, max: 200000 },
    { label: '₹2,00,000 - ₹4,00,000', min: 200000, max: 400000 },
    { label: '₹4,00,000 - ₹6,00,000', min: 400000, max: 600000 },
    { label: '₹6,00,000 - ₹10,00,000', min: 600000, max: 1000000 },
    { label: '₹10,00,000 - ₹20,00,000', min: 1000000, max: 2000000 },
    { label: '₹20,00,000 - ₹40,00,000', min: 2000000, max: 4000000 },
    { label: '₹40 - ₹60 Lakh', min: 4000000, max: 6000000 },
    { label: '₹60 - ₹80 Lakh', min: 6000000, max: 8000000 },
    { label: '₹80 Lakh - ₹1 Crore', min: 8000000, max: 10000000 },
    { label: '₹1 - ₹1.5 Crore', min: 10000000, max: 15000000 },
    { label: '₹1.5 - ₹2 Crore', min: 15000000, max: 20000000 },
    { label: '₹2 Crore+', min: 20000000, max: Infinity },
  ],

  'Two Wheeler': [
    { label: '₹5,000 - ₹25,000', min: 5000, max: 25000 },
    { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
    { label: '₹1,00,000 - ₹1,50,000', min: 100000, max: 150000 },
    { label: '₹1,50,000 - ₹2,00,000', min: 150000, max: 200000 },
    { label: '₹2,00,000 - ₹3,00,000', min: 200000, max: 300000 },
  ],

  'Commercial Vehicle': [
    { label: '₹25,000 - ₹2,00,000', min: 25000, max: 200000 },
    { label: '₹2,00,000 - ₹4,00,000', min: 200000, max: 400000 },
    { label: '₹4,00,000 - ₹6,00,000', min: 400000, max: 600000 },
    { label: '₹6,00,000 - ₹10,00,000', min: 600000, max: 1000000 },
    { label: '₹10,00,000 - ₹20,00,000', min: 1000000, max: 2000000 },
    { label: '₹20,00,000+', min: 2000000, max: Infinity },
  ],
};

const vehicleCategories = [
  { label: 'Cars', value: 'Car', icon: '🚗' },
  { label: 'Two Wheelers', value: 'Two Wheeler', icon: '🏍️' },
  { label: 'Commercial Vehicles', value: 'Commercial Vehicle', icon: '🚚' },
];

const brandOptions = [
  'Hyundai',
  'Maruti Suzuki',
  'Tata',
  'Honda',
  'Toyota',
  'Mahindra',
  'Royal Enfield',
  'Bajaj',
  'TVS',
  'Yamaha',
];

const fuelOptions = [
  'Petrol',
  'Diesel',
  'CNG',
  'Electric',
  'Hybrid',
  'PHEV',
];

const transmissionOptions = ['Manual', 'Automatic'];

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'priceLow', label: 'Price: Low to High' },
  { value: 'priceHigh', label: 'Price: High to Low' },
  { value: 'yearNew', label: 'Year: Newest First' },
  { value: 'kmsLow', label: 'Kms: Low to High' },
];

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

const CheckRow = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={styles.checkRow}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.checkLabel}>{label}</Text>

    <View style={[styles.checkbox, active && styles.checkboxActive]}>
      {active ? <Text style={styles.checkMark}>✓</Text> : null}
    </View>
  </TouchableOpacity>
);

const Accordion = ({ title, open, onToggle, children }) => (
  <View style={styles.accordion}>
    <TouchableOpacity
      style={styles.accordionHeader}
      onPress={onToggle}
      activeOpacity={0.9}
    >
      <Text style={styles.accordionTitle}>{title}</Text>
      <Text style={styles.accordionChevron}>{open ? '︿' : '﹀'}</Text>
    </TouchableOpacity>

    {open ? (
      <View style={styles.accordionBody}>{children}</View>
    ) : null}
  </View>
);

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

const VehicleCard = ({
  vehicle,
  isLiked,
  onLike,
  onShare,
  onView,
  cardStyle,
  imageStyle,
}) => {
  const vehicleImage =
    Array.isArray(vehicle.images) && vehicle.images.length > 0
      ? getValidImageUrl(vehicle.images[0])
      : null;

  return (
    <View style={[styles.vehicleCard, cardStyle]}>
      <View style={[styles.vehicleImageContainer, imageStyle]}>
        {vehicleImage ? (
          <Image
            source={{ uri: vehicleImage }}
            style={styles.vehicleImage}
            resizeMode="cover"
            onError={() =>
              console.log('Unable to load vehicle image:', vehicleImage)
            }
          />
        ) : (
          <View style={styles.vehicleImagePlaceholder}>
            <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
            <Text style={styles.vehicleImageText}>
              No Image Available
            </Text>
          </View>
        )}

        <View style={styles.preOwnedBadge}>
          <Text style={styles.preOwnedBadgeText}>Pre-owned</Text>
        </View>
      </View>

      <View style={styles.vehicleDetails}>
        <View style={styles.titleShareRow}>
          <Text style={styles.vehicleTitle} numberOfLines={2}>
            {vehicle.title || 'Used Vehicle'}
          </Text>

          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onLike(vehicle.id)}
              accessibilityLabel={
                isLiked ? 'Remove from favourites' : 'Add to favourites'
              }
            >
              <Text style={styles.iconText}>
                {isLiked ? '❤️' : '♡'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onShare(vehicle)}
              accessibilityLabel="Share vehicle"
            >
              <Text style={styles.iconText}>⤴</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.vehicleSubTitle} numberOfLines={1}>
          {[vehicle.fuelType, vehicle.transmission]
            .filter(Boolean)
            .join(' • ')}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.vehiclePrice}>
            ₹{formatNumber(vehicle.price)}*
          </Text>

          <View style={styles.otherChargesRow}>
            <Text style={styles.otherChargesText}>Other Charges</Text>
            <View style={styles.infoDot}>
              <Text style={styles.infoDotText}>i</Text>
            </View>
          </View>
        </View>

        <View style={styles.motoSpecsRow}>
          <View style={styles.specItem}>
            <Text style={styles.specIcon}>📅</Text>
            <Text style={styles.specText}>
              {vehicle.year || '-'}
            </Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specIcon}>👤</Text>
            <Text style={styles.specText}>
              {vehicle.ownerType || '-'}
            </Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specIcon}>⛽</Text>
            <Text style={styles.specText}>
              {vehicle.fuelType || '-'}
            </Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specIcon}>⏱️</Text>
            <Text style={styles.specText}>
              {formatNumber(vehicle.kmsDriven)} kms
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => onView(vehicle)}
          activeOpacity={0.85}
        >
          <Text style={styles.buyNowButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default function BuyCars({
  setActiveTab,
  searchQuery: externalSearchQuery = '',
  searchFilters = {},
  onClearSearchFilters,
}) {
  const [vehicleType, setVehicleType] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // The box always shows what the person typed. A search sent from the
  // top bar or from the Home page is copied into it, so it can be edited
  // or cleared. (Before, a non-empty top-bar search froze this box.)
  useEffect(() => {
    if (typeof externalSearchQuery === 'string') {
      setLocalSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Home page quick search: a model / variant name such as "VXI".
  useEffect(() => {
    if (searchFilters?.keyword) {
      setLocalSearchQuery(String(searchFilters.keyword));
    }
  }, [searchFilters?.keyword]);

  const searchText = localSearchQuery;

  const setSearchText = (value) => {
    setLocalSearchQuery(value);
  };
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');

  const [sortBy, setSortBy] = useState('default');
  const [sortOpen, setSortOpen] = useState(false);

  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
    fuel: false,
    transmission: false,
  });

  const [likedVehicles, setLikedVehicles] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1100;

  // Phone: one card per row. Tablet / laptop: cards sit side by side
  // (2 per row, 3 per row on very wide screens). Percentages work on the
  // web and on Android / iOS alike.
  const cardStyle = isMobile
    ? { width: '100%', minWidth: 0 }
    : isTablet
      ? { width: '48%', minWidth: 0 }
      : screenWidth >= 1500
        ? { width: '31%', minWidth: 0 }
        : { width: '48%', minWidth: 0 };

  // On wider cards the picture keeps a fixed shape, so the whole car stays
  // visible instead of being cropped.
  const imageStyle = isMobile
    ? null
    : { height: 'auto', aspectRatio: 1.6 };

  const gridStyle = isMobile
    ? null
    : {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 16,
        rowGap: 16,
      };

  const toggleSection = (key) => {
    setOpenSections((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API}/car/all`);
      const data = await response.json();
      console.log("BUY CARS RESPONSE:", data);

console.log(
  "BOOST STATUS:",
  JSON.stringify(
    data.cars?.map(car => ({
      title: car.title,
      boostStatus: car.boostStatus,
      boostEndDate: car.boostEndDate,
    })),
    null,
    2
  )
);

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load vehicles');
      }

      if (!data.success) {
        setVehicles([]);
        setError(data.message || 'No vehicles found');
        return;
      }

      const formatted = (data.cars || [])
        .filter((car) => !car.status || car.status === 'ACTIVE')
        .map((car) => ({
          id: car._id,
          seller:
            typeof car.seller === 'object'
              ? car.seller?._id
              : car.seller,
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
          images: Array.isArray(car.images)
            ? car.images.filter(Boolean)
            : [],
          condition: car.condition || 'Used Vehicle',
          ownerType: car.ownerType || '1st Owner',
          description: car.description || '',
          expiresAt: car.expiresAt,
          status: car.status,
          boostStatus: car.boostStatus || 'NONE',
boostEndDate: car.boostEndDate || null,
        }));

      setVehicles(formatted);
    } catch (err) {
      console.error('FETCH VEHICLES ERROR:', err);
      setVehicles([]);
      setError('Unable to connect to CARVIO server.');
    } finally {
      setLoading(false);
    }
  };

  const loadFavourites = async () => {
    try {
      const token = await getToken();

      if (!token) return;

      const response = await fetch(`${API}/user/favourites`, {
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
            .map((item) =>
              typeof item === 'string' ? item : item?._id
            )
            .filter(Boolean)
        );
      }
    } catch (err) {
      console.log('LOAD FAVOURITES ERROR:', err);
    }
  };

  useEffect(() => {
    fetchVehicles();
    loadFavourites();
  }, []);

  const clearFilters = () => {
  setVehicleType('');
  setLocalSearchQuery('');
  setSelectedPrice('');
  setSelectedBrands([]);
  setSelectedFuel('');
  setSelectedTransmission('');
  setSortBy('default');
  setSortOpen(false);

  if (typeof onClearSearchFilters === 'function') {
    onClearSearchFilters();
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
          data.message || 'Unable to update favourite'
        );
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
      console.log('FAVOURITE ERROR:', err);
      notify(
        'Error',
        err.message || 'Unable to update favourite'
      );
    }
  };

  const handleShare = async (vehicle) => {
    const shareMessage =
      `${vehicle.title}\n` +
      `₹${formatNumber(vehicle.price)}\n` +
      `${vehicle.year || '-'} • ${vehicle.fuelType || '-'} • ${vehicle.transmission || '-'}\n` +
      `${formatNumber(vehicle.kmsDriven)} km\n` +
      `${vehicle.locationText || 'India'}\n\n` +
      'Listed on CARVIO';

    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
        if (typeof navigator.share === 'function') {
          await navigator.share({
            title: vehicle.title,
            text: shareMessage,
          });

          return;
        }

        // Browsers without the share sheet: copy the details instead.
        try {
          await navigator.clipboard.writeText(shareMessage);
          window.alert('Vehicle details copied to clipboard.');
        } catch (clipboardError) {
          window.alert(shareMessage);
        }

        return;
      }

      await Share.share({ message: shareMessage });
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.log('SHARE ERROR:', err);
      }
    }
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((previous) =>
      previous.includes(brand)
        ? previous.filter((item) => item !== brand)
        : [...previous, brand]
    );
  };

  const currentPriceOptions = vehicleType
    ? priceOptions[vehicleType] || []
    : [];

  const filteredVehicles = vehicles
    .filter((vehicle) => {
      if (vehicleType && vehicle.type !== vehicleType) {
        return false;
      }

      // Home page: Brand filter
const heroBrand = String(searchFilters.brand || '')
  .trim()
  .toLowerCase();

if (
  heroBrand &&
  !String(vehicle.brand || '').toLowerCase().includes(heroBrand)
) {
  return false;
}

// Home page: Budget filter
const heroBudget = searchFilters.budget;

if (heroBudget && typeof heroBudget === 'object') {
  const min = Number(heroBudget.min);
  const max = heroBudget.max;

  if (Number.isFinite(min) && vehicle.price < min) {
    return false;
  }

  if (
    max !== null &&
    max !== undefined &&
    Number.isFinite(Number(max)) &&
    vehicle.price >= Number(max)
  ) {
    return false;
  }
}

// Home page: Body Type filter
const heroBodyType = String(searchFilters.bodyType || '')
  .trim()
  .toLowerCase();

if (heroBodyType) {
  const bodyType = String(vehicle.bodyType || '')
    .trim()
    .toLowerCase();

  const fuelType = String(vehicle.fuelType || '')
    .trim()
    .toLowerCase();

  if (heroBodyType === 'electric') {
    if (fuelType !== 'electric') {
      return false;
    }
  } else if (heroBodyType === 'luxury') {
    const luxuryBrands = [
      'bmw',
      'mercedes-benz',
      'audi',
      'bentley',
      'ferrari',
      'jaguar',
      'lamborghini',
      'land rover',
      'lexus',
      'maserati',
      'porsche',
      'volvo',
    ];

    const brand = String(vehicle.brand || '').toLowerCase();

    if (
      !luxuryBrands.includes(brand) &&
      bodyType !== 'luxury'
    ) {
      return false;
    }
  } else if (bodyType !== heroBodyType) {
    return false;
  }
}

const search = searchText.trim().toLowerCase();

const searchableText = [
  vehicle.title,
  vehicle.brand,
  vehicle.model,
  vehicle.type,
  vehicle.fuelType,
  vehicle.transmission,
  vehicle.locationText,
  vehicle.year,
]
  .filter(Boolean)
  .join(' ')
  .toLowerCase();

if (search && !searchableText.includes(search)) {
  return false;
}

      if (
        selectedBrands.length > 0 &&
        !selectedBrands.includes(vehicle.brand)
      ) {
        return false;
      }

      if (selectedFuel && vehicle.fuelType !== selectedFuel) {
        return false;
      }

      if (
        selectedTransmission &&
        vehicle.transmission !== selectedTransmission
      ) {
        return false;
      }

      if (selectedPrice) {
        const selected = currentPriceOptions.find(
          (option) => option.label === selectedPrice
        );

        if (selected) {
          // Lower boundary included; upper boundary excluded.
          // This prevents vehicles appearing in two adjacent ranges.
          if (vehicle.price < selected.min) return false;

          if (
            selected.max !== Infinity &&
            vehicle.price >= selected.max
          ) {
            return false;
          }
        }
      }

      return true;
    })
    .sort((a, b) => {
  const now = new Date();

  const aBoostActive =
    a.boostStatus === 'ACTIVE' &&
    a.boostEndDate &&
    new Date(a.boostEndDate) > now;

  const bBoostActive =
    b.boostStatus === 'ACTIVE' &&
    b.boostEndDate &&
    new Date(b.boostEndDate) > now;

  if (aBoostActive && !bBoostActive) return -1;
  if (!aBoostActive && bBoostActive) return 1;

  switch (sortBy) {
    case 'priceLow':
      return a.price - b.price;

    case 'priceHigh':
      return b.price - a.price;

    case 'yearNew':
      return (Number(b.year) || 0) - (Number(a.year) || 0);

    case 'kmsLow':
      return a.kmsDriven - b.kmsDriven;

    default:
      return 0;
  }
});
  if (selectedVehicle) {
    return (
      <CarDetails
        key={selectedVehicle.id}
        car={selectedVehicle}
        onBack={() => setSelectedVehicle(null)}
      />
    );
  }

  const sortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ||
    'Default';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        isMobile && {
          paddingHorizontal: 12,
          paddingTop: 14,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.typeRow}>
        {vehicleCategories.map((item) => {
          const active = vehicleType === item.value;

          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.typeTab,
                active && styles.typeTabActive,
              ]}
              activeOpacity={0.85}
              onPress={() => {
                setVehicleType(active ? '' : item.value);
                setSelectedPrice('');
                setSelectedBrands([]);
                setSelectedFuel('');
                setSelectedTransmission('');
              }}
            >
              <Text>{item.icon}</Text>

              <Text
                style={[
                  styles.typeTabText,
                  active && styles.typeTabTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={[
          styles.topBar,
          isMobile && {
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 14,
          },
        ]}
      >
        <View
          style={[
            styles.searchPill,
            isMobile && {
              width: '100%',
              height: 48,
            },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
  style={styles.searchInput}
  placeholder="Search car by brand or model"
  placeholderTextColor="#9AA3B2"
  value={searchText}
  onChangeText={setSearchText}
  returnKeyType="search"
/>
        </View>

        <View
          style={[
            styles.fuelCenter,
            isMobile && {
              minWidth: 0,
              width: '100%',
              flex: 0,
            },
          ]}
        >
          <Text style={styles.discoverText}>
            Discover Preowned Car by
          </Text>

          <View
            style={[
              styles.fuelRow,
              isMobile && {
                gap: 12,
                flexWrap: 'wrap',
                justifyContent: 'center',
              },
            ]}
          >
            <TouchableOpacity onPress={() => setSelectedFuel('')}>
              <Text
                style={[
                  styles.fuelAll,
                  selectedFuel !== '' && styles.fuelAllInactive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {fuelOptions.map((fuel) => {
              const active = selectedFuel === fuel;

              return (
                <TouchableOpacity
                  key={fuel}
                  style={[
                    styles.fuelBadge,
                    active && styles.fuelBadgeActive,
                  ]}
                  onPress={() =>
                    setSelectedFuel(active ? '' : fuel)
                  }
                >
                  <Text
                    style={[
                      styles.fuelBadgeText,
                      active && styles.fuelBadgeTextActive,
                    ]}
                  >
                    {fuel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.sortWrap,
            isMobile && {
              width: '100%',
              marginTop: 8,
            },
          ]}
        >
          <Text style={styles.sortLabelSmall}>Sort By</Text>

          <TouchableOpacity
            style={styles.sortBox}
            onPress={() => setSortOpen((previous) => !previous)}
            activeOpacity={0.8}
          >
            <Text style={styles.sortValue} numberOfLines={1}>
              {sortLabel}
            </Text>

            <Text style={styles.sortValue}>▾</Text>
          </TouchableOpacity>

          {sortOpen ? (
            <View style={styles.sortMenu}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortItem,
                    sortBy === option.value &&
                      styles.sortItemActive,
                  ]}
                  onPress={() => {
                    setSortBy(option.value);
                    setSortOpen(false);
                  }}
                >
                  <Text style={styles.sortItemText}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.marketplaceContainer,
          isMobile && {
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 12,
          },
        ]}
      >
        <View
          style={[
            styles.filterPanel,
            isMobile && { width: '100%' },
          ]}
        >
          <View style={styles.filterHeaderDark}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={isMobile ? 0.85 : 1}
              onPress={() =>
                isMobile &&
                setFiltersOpen((previous) => !previous)
              }
            >
              <Text style={styles.filterTitleDark}>
                ⚙️ All Filters
                {isMobile ? (filtersOpen ? '  ︿' : '  ﹀') : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearAllDark}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {!isMobile || filtersOpen ? (
            <View>
              {vehicleType ? (
                <Accordion
                  title="Price Range"
                  open={openSections.price}
                  onToggle={() => toggleSection('price')}
                >
                  {currentPriceOptions.map((option) => (
                    <CheckRow
                      key={option.label}
                      label={option.label}
                      active={selectedPrice === option.label}
                      onPress={() =>
                        setSelectedPrice(
                          selectedPrice === option.label
                            ? ''
                            : option.label
                        )
                      }
                    />
                  ))}
                </Accordion>
              ) : (
                <View style={styles.filterHint}>
                  <Text style={styles.filterHintIcon}>💡</Text>

                  <Text style={styles.filterHintText}>
                    Select a vehicle type to see price ranges.
                  </Text>
                </View>
              )}

              <Accordion
                title="Brand"
                open={openSections.brand}
                onToggle={() => toggleSection('brand')}
              >
                {brandOptions.map((brand) => (
                  <CheckRow
                    key={brand}
                    label={brand}
                    active={selectedBrands.includes(brand)}
                    onPress={() => toggleBrand(brand)}
                  />
                ))}

                <TouchableOpacity
                  style={styles.clearSmallButton}
                  onPress={() => setSelectedBrands([])}
                >
                  <Text style={styles.clearSmallText}>Clear</Text>
                </TouchableOpacity>
              </Accordion>

              <Accordion
                title="Fuel Type"
                open={openSections.fuel}
                onToggle={() => toggleSection('fuel')}
              >
                {fuelOptions.map((fuel) => (
                  <CheckRow
                    key={fuel}
                    label={fuel}
                    active={selectedFuel === fuel}
                    onPress={() =>
                      setSelectedFuel(
                        selectedFuel === fuel ? '' : fuel
                      )
                    }
                  />
                ))}
              </Accordion>

              <Accordion
                title="Transmission"
                open={openSections.transmission}
                onToggle={() => toggleSection('transmission')}
              >
                {transmissionOptions.map((transmission) => (
                  <CheckRow
                    key={transmission}
                    label={transmission}
                    active={selectedTransmission === transmission}
                    onPress={() =>
                      setSelectedTransmission(
                        selectedTransmission === transmission
                          ? ''
                          : transmission
                      )
                    }
                  />
                ))}
              </Accordion>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.listingsContainer,
            isMobile && {
              width: '100%',
              flex: 0,
            },
          ]}
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {vehicleType
                ? `${vehicleType} Listings`
                : 'Latest Listings'}
            </Text>

            <Text style={styles.resultsCount}>
              {filteredVehicles.length} vehicles available
            </Text>
          </View>

          {loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#121826" />

              <Text style={styles.emptyTitle}>
                Loading vehicles...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>⚠️</Text>

              <Text style={styles.emptyTitle}>
                Unable to load vehicles
              </Text>

              <Text style={styles.emptyText}>{error}</Text>

              <TouchableOpacity
                style={styles.emptyClearButton}
                onPress={fetchVehicles}
              >
                <Text style={styles.emptyClearText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : filteredVehicles.length > 0 ? (
            <View style={[styles.cardsGrid, gridStyle]}>
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isLiked={likedVehicles.includes(vehicle.id)}
                  onLike={handleLike}
                  onShare={handleShare}
                  onView={setSelectedVehicle}
                  cardStyle={cardStyle}
                  imageStyle={imageStyle}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🚘</Text>

              <Text style={styles.emptyTitle}>
                No vehicles found
              </Text>

              <Text style={styles.emptyText}>
                Try changing your filters or search.
              </Text>

              <TouchableOpacity
                style={styles.emptyClearButton}
                onPress={clearFilters}
              >
                <Text style={styles.emptyClearText}>
                  Clear Filters
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}