import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Share,
  Modal,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';

import { styles } from '../styles/MyAds.styles';
import { API_URL } from '../utils/config';
import CarDetails from './CarDetails';

const cities = [
  {
    name: 'All Cities',
    image:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Chennai',
    image:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Coimbatore',
    image:
      'https://i.pinimg.com/736x/2d/3b/07/2d3b075913c4cd54a3621f0851794de3.jpg',
  },
  {
    name: 'Kerala',
    image:
      'https://i.pinimg.com/736x/6c/fd/dd/6cfdddf755f67cdc9a475a9a2c941613.jpg',
  },
  {
    name: 'Bangalore',
    image:
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Hyderabad',
    image:
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Kochi',
    image:
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Madurai',
    image:
      'https://i.pinimg.com/736x/fa/dd/3f/fadd3f11badc32c17dc4836dcbea041f.jpg',
  },
  {
    name: 'Salem',
    image:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Tiruppur',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Trichy',
    image:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Pollachi',
    image:
      'https://i.pinimg.com/736x/3b/ca/e2/3bcae2b9c286e052877dd345f97fa6a9.jpg',
  },
  {
    name: 'Delhi NCR',
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Mumbai',
    image:
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Pune',
    image:
      'https://i.pinimg.com/1200x/eb/ba/fc/ebbafc3953dbe964b5fe0bdc6c4d9ce9.jpg',
  },
  {
    name: 'Ahmedabad',
    image:
      'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Gurgaon',
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Noida',
    image:
      'https://images.unsplash.com/photo-1580707221190-bd94d9087b7f?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Lucknow',
    image:
      'https://i.pinimg.com/736x/a5/b9/cc/a5b9ccddba8c931ba32c9081b5762935.jpg',
  },
  {
    name: 'Jaipur',
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Kolkata',
    image:
      'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Nagpur',
    image:
      'https://i.pinimg.com/1200x/20/17/b9/2017b99e4c08e1c235f472843bf53322.jpg',
  },
  {
    name: 'Chandigarh',
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=500&q=60',
  },
];

// The location can be a city name, a { city } object, or raw "lat,lng"
// coordinates. Only a readable city / place name is used for display and
// for the city filter.
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

export default function MyAds({ setActiveTab }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchText, setSearchText] = useState('');
  const [favourites, setFavourites] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const [locatingUser, setLocatingUser] = useState(false);

  // GET ALL CARS FROM BACKEND
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      setLoadError('');

      console.log("Fetching cars from:", `${API_URL}/car/all`);

      const response = await fetch(`${API_URL}/car/all`);

      console.log("Response status:", response.status);

      const data = await response.json();

      console.log('Cars API Response:', data);

      if (data.success) {
        const formattedCars = (data.cars || []).map((car) => ({
          id: car._id,

          name: car.title || car.brand || 'Car',

          variant: car.modelName || '',

          year: car.year?.toString() || '',

          fuel: car.fuelType || '',

          transmission: car.transmission || '',

          km: car.kmsDriven
            ? `${Number(car.kmsDriven).toLocaleString('en-IN')} km`
            : '',

          owners: car.ownerType || '1st Owner',

          price: car.price
            ? `₹${Number(car.price).toLocaleString('en-IN')}`
            : '',

          location: car.location || '',

          locationText: getLocationText(car.location),

          image:
            car.images && car.images.length > 0
              ? car.images[0]
              : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',

          images: car.images || [],
        }));

        setCars(formattedCars);
      } else {
        setCars([]);
        setLoadError(data.message || 'Unable to load cars.');
      }
    } catch (error) {
      console.log('Fetch cars error:', error);
      setCars([]);
      setLoadError('Unable to connect to the server.');
    } finally {
      setLoadingCars(false);
    }
  };

  const toggleFavourite = (carId) => {
    setFavourites((current) => {
      if (current.includes(carId)) {
        return current.filter((id) => id !== carId);
      }

      return [...current, carId];
    });
  };

  const shareCar = async (car) => {
    try {
      const message =
        `🚗 ${car.name} ${car.variant}\n\n` +
        `💰 Price: ${car.price}\n` +
        `📅 Year: ${car.year}\n` +
        `⛽ Fuel: ${car.fuel}\n` +
        `⚙️ Transmission: ${car.transmission}\n` +
        `🛣️ KM: ${car.km}\n` +
        `👤 ${car.owners}\n` +
        `📍 Location: ${car.locationText || 'India'}\n\n` +
        `View this car on CARVIO - PREMIUM AUTO MARKET`;

      // Browsers without the share sheet: copy the details instead.
      if (
        Platform.OS === 'web' &&
        typeof navigator !== 'undefined' &&
        typeof navigator.share !== 'function'
      ) {
        try {
          await navigator.clipboard.writeText(message);
          window.alert('Car details copied to clipboard.');
        } catch (clipboardError) {
          window.alert(message);
        }

        return;
      }

      await Share.share({ message });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const openCityModal = () => {
    setModalSearchText('');
    setManualModalVisible(true);
  };

  const closeCityModal = () => {
    setManualModalVisible(false);
    setModalSearchText('');
  };

  const selectCity = (cityName) => {
    setSelectedCity(cityName);
    closeCityModal();
  };

  const useCurrentLocation = async () => {
    try {
      setLocatingUser(true);

      selectCity('All Cities');
    } catch (error) {
      console.log('Location error:', error);
    } finally {
      setLocatingUser(false);
    }
  };

  const filteredModalCities = cities.filter((city) =>
    city.name.toLowerCase().includes(modalSearchText.toLowerCase())
  );

  const filteredCars = cars.filter((car) => {
    const cityMatch =
      selectedCity === 'All Cities' ||
      car.locationText
        .toLowerCase()
        .includes(selectedCity.toLowerCase());

    const searchMatch =
      car.name.toLowerCase().includes(searchText.toLowerCase()) ||
      car.variant.toLowerCase().includes(searchText.toLowerCase());

    return cityMatch && searchMatch;
  });

  // OPEN CAR DETAILS
  if (selectedCar) {
    return (
      <CarDetails
        car={selectedCar}
        onBack={() => setSelectedCar(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          isMobile && styles.contentContainerMobile,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Find Your Perfect Car
          </Text>

          <Text style={styles.subtitle}>
            Explore quality used cars from trusted sellers
          </Text>
        </View>

        {/* CITY SECTION */}
        <View style={styles.filterCard}>
          <View style={styles.cityHeaderRow}>
            <Text style={styles.filterLabel}>
              📍 Select Your City
            </Text>

            <TouchableOpacity onPress={openCityModal} hitSlop={8}>
              <Text style={styles.viewAllCitiesText}>
                View all cities
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cityList}
          >
            {cities.map((item) => {
              const isSelected =
                selectedCity === item.name;

              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.cityCardItem,
                    isSelected && styles.cityCardActive,
                  ]}
                  onPress={() =>
                    setSelectedCity(item.name)
                  }
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cityCardImage}
                  />

                  <Text
                    style={[
                      styles.cityCardText,
                      isSelected &&
                        styles.cityCardTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by car name or model"
            placeholderTextColor="#98A2B3"
            value={searchText}
            onChangeText={setSearchText}
          />

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              hitSlop={10}
              accessibilityLabel="Clear search"
            >
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* RESULTS HEADER */}
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.resultsTitle}>
              {selectedCity === 'All Cities'
                ? 'Cars Available'
                : `Cars in ${selectedCity}`}
            </Text>

            <Text style={styles.resultsCount}>
              {loadingCars
                ? 'Loading cars...'
                : `${filteredCars.length} cars available`}
            </Text>
          </View>
        </View>

        {/* LOADING */}
        {loadingCars && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2F6FED" />
          </View>
        )}

        {/* LOAD ERROR */}
        {!loadingCars && !!loadError && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>⚠️</Text>

            <Text style={styles.noResultsTitle}>
              Something went wrong
            </Text>

            <Text style={styles.noResultsText}>{loadError}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchCars}
              activeOpacity={0.85}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CAR GRID */}
        {!loadingCars && !loadError && (
          <View style={styles.carGrid}>
            {filteredCars.map((car) => {
              const isFavourite =
                favourites.includes(car.id);

              return (
                <View
                  key={car.id}
                  style={[
                    styles.carCard,
                    isMobile && styles.carCardMobile,
                  ]}
                >
                  {/* IMAGE */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: car.image }}
                      style={styles.carImage}
                      resizeMode="cover"
                    />

                    {/* FAVOURITE */}
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() =>
                        toggleFavourite(car.id)
                      }
                      activeOpacity={0.8}
                      accessibilityLabel={
                        isFavourite
                          ? 'Remove from favourites'
                          : 'Add to favourites'
                      }
                    >
                      <Text
                        style={[
                          styles.favoriteIcon,
                          isFavourite &&
                            styles.favoriteIconActive,
                        ]}
                      >
                        {isFavourite ? '♥' : '♡'}
                      </Text>
                    </TouchableOpacity>

                    {/* USED CAR BADGE */}
                    <View style={styles.usedBadge}>
                      <Text style={styles.usedBadgeText}>
                        USED CAR
                      </Text>
                    </View>
                  </View>

                  {/* CARD CONTENT */}
                  <View style={styles.cardContent}>
                    <View style={styles.carTitleRow}>
                      <View
                        style={styles.carNameContainer}
                      >
                        <Text
                          style={styles.carName}
                          numberOfLines={1}
                        >
                          {car.name}
                        </Text>

                        <Text style={styles.variant}>
                          {car.variant}
                        </Text>
                      </View>

                      {/* SHARE */}
                      <TouchableOpacity
                        style={styles.shareButton}
                        onPress={() =>
                          shareCar(car)
                        }
                        activeOpacity={0.8}
                        accessibilityLabel="Share car"
                      >
                        <Text style={styles.shareIcon}>
                          ↗
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* PRICE */}
                    <Text style={styles.price}>
                      {car.price}
                    </Text>

                    {/* DETAILS */}
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailText}>
                        📅 {car.year}
                      </Text>

                      <Text style={styles.detailText}>
                        🛣️ {car.km}
                      </Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <Text style={styles.detailText}>
                        ⛽ {car.fuel}
                      </Text>

                      <Text style={styles.detailText}>
                        ⚙️ {car.transmission}
                      </Text>
                    </View>

                    <Text style={styles.ownerText}>
                      👤 {car.owners}
                    </Text>

                    {/* LOCATION */}
                    <View style={styles.locationRow}>
                      <Text
                        style={styles.locationText}
                        numberOfLines={1}
                      >
                        📍 {car.locationText || 'Location not available'}
                      </Text>
                    </View>

                    {/* VIEW DETAILS */}
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() =>
                        setSelectedCar(car)
                      }
                      activeOpacity={0.85}
                    >
                      <Text
                        style={styles.viewButtonText}
                      >
                        View Details
                      </Text>

                      <Text style={styles.viewArrow}>
                        →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* NO RESULTS */}
        {!loadingCars &&
          !loadError &&
          filteredCars.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsIcon}>
                🚗
              </Text>

              <Text style={styles.noResultsTitle}>
                No cars found
              </Text>

              <Text style={styles.noResultsText}>
                Try selecting another city or searching
                for a different car.
              </Text>
            </View>
          )}

        {/* SELL CTA */}
        <View
          style={[
            styles.sellBanner,
            isMobile && styles.sellBannerMobile,
          ]}
        >
          <View style={styles.sellBannerContent}>
            <Text style={styles.sellBannerTitle}>
              Want to sell your car?
            </Text>

            <Text style={styles.sellBannerText}>
              List your car on CARVIO and connect with
              genuine buyers.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.sellButton}
            onPress={() =>
              setActiveTab('SELL CARS')
            }
            activeOpacity={0.85}
          >
            <Text style={styles.sellButtonText}>
              Sell My Car
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CITY MODAL */}
      <Modal
        visible={manualModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCityModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* HEADER */}
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                Select your city to view cars
              </Text>

              <TouchableOpacity
                onPress={closeCityModal}
                activeOpacity={0.7}
                hitSlop={10}
              >
                <Text style={styles.modalCloseIcon}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* USE LOCATION + SEARCH */}
            <View style={styles.modalTopRow}>
              <TouchableOpacity
                style={styles.useLocationRow}
                onPress={useCurrentLocation}
                activeOpacity={0.8}
              >
                <Text style={styles.useLocationIcon}>
                  🧭
                </Text>

                <Text style={styles.useLocationText}>
                  {locatingUser
                    ? 'Locating...'
                    : 'Use current location'}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalSearchBox}>
                <Text style={styles.searchIcon}>
                  🔍
                </Text>

                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search for your city"
                  placeholderTextColor="#98A2B3"
                  value={modalSearchText}
                  onChangeText={setModalSearchText}
                />
              </View>
            </View>

            {/* POPULAR CITIES */}
            <Text style={styles.popularCitiesLabel}>
              {modalSearchText
                ? 'Search results'
                : 'Popular cities'}
            </Text>

            {/* CITY GRID */}
            <ScrollView
              style={styles.modalCityScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalCityGrid}>
                {filteredModalCities.map((city) => {
                  const isSelected =
                    selectedCity === city.name;

                  return (
                    <TouchableOpacity
                      key={city.name}
                      style={styles.modalCityItem}
                      onPress={() =>
                        selectCity(city.name)
                      }
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: city.image }}
                        style={[
                          styles.modalCityImage,
                          isSelected &&
                            styles.modalCityImageActive,
                        ]}
                      />

                      <Text
                        style={[
                          styles.modalCityText,
                          isSelected &&
                            styles.modalCityTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {city.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {filteredModalCities.length === 0 && (
                  <Text style={styles.modalNoCityText}>
                    No cities found. Try a different name.
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}