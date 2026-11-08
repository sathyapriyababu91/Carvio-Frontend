import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import { getToken } from '../utils/authStorage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import Gpay from '../assets/Gpay.png';
import Phonepay from '../assets/Phonepay.png';
import Bank from '../assets/Bank.png';
import Loan from '../assets/Loan.png';

import { styles } from '../styles/SellCars.styles';

const MapsModule =
  Platform.OS !== 'web' ? require('react-native-maps') : null;

const MapView = MapsModule ? MapsModule.default : null;
const Marker = MapsModule ? MapsModule.Marker : null;
const PROVIDER_GOOGLE = MapsModule ? MapsModule.PROVIDER_GOOGLE : null;

const TWO_WHEELER_BRANDS = {
  Honda: [
    'Activa',
    'Shine',
    'SP 125',
    'Unicorn',
  ],

  Hero: [
    'Splendor',
    'Passion',
    'HF Deluxe',
    'Xpulse',
  ],

  TVS: [
    'Jupiter',
    'Apache',
    'Raider',
    'Ntorq',
  ],

  Bajaj: [
    'Pulsar',
    'Platina',
    'Avenger',
  ],

  'Royal Enfield': [
    'Classic 350',
    'Bullet 350',
    'Hunter 350',
  ],

  Yamaha: [
    'FZ',
    'R15',
    'MT-15',
  ],

  Suzuki: [
    'Access',
    'Gixxer',
  ],

  KTM: [
    'Duke',
    'RC',
  ],

  Ola: [
    'S1',
  ],

  Ather: [
    '450X',
  ],

  'Multi-Brand': [],
};

const BRAND_LIST = Object.keys(TWO_WHEELER_BRANDS);

const FUEL_OPTIONS = ['Petrol', 'Electric', 'CNG'];

const TOTAL_STEPS = 9;

// FIX: react-native-web-ல் Alert.alert எதுவும் காட்டாது.
// அதனால் web-ல் window.alert பயன்படுத்துகிறோம்.
const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);

    const okButton = buttons && buttons.find((item) => item.onPress);

    if (okButton) {
      okButton.onPress();
    }

    return;
  }

  Alert.alert(title, message, buttons);
};

function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconBox}>
        <Text style={styles.sectionIcon}>{icon}</Text>
      </View>

      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// Car page-ல் உள்ளது போல் Fuel Type chips
function ChipGroup({ options, value, onChange }) {
  return (
    <View style={styles.chipRow}>
      {options.map((option) => {
        const selected = value === option;

        return (
          <TouchableOpacity
            key={option}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onChange(option)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.chipText,
                selected && styles.chipTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Brand தேர்வுக்கான bottom sheet
function OptionSheet({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.dropdownOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.dropdownModal}>
          <View style={styles.sheetHandle} />

          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>{title}</Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.dropdownClose}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.dropdownOptions}>
            {options.map((option) => {
              const isSelected = selected === option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownOption,
                    isSelected && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => onSelect(option)}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      isSelected && styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>

                  {isSelected && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function SellTwoWheeler({
  setActiveTab,
  goToPayment,
  onFeedbackRequired,
}) {
  const [vehicleName, setVehicleName] = useState('');
  const [year, setYear] = useState('');
  const [variant, setVariant] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [images, setImages] = useState([]);

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const [focusedField, setFocusedField] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [mapVisible, setMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationMode, setLocationMode] = useState('map');
const [manualCity, setManualCity] = useState('');
const [manualState, setManualState] = useState('');
const [manualPincode, setManualPincode] = useState('');

  const [mapRegion, setMapRegion] = useState({
    latitude: 11.0168,
    longitude: 76.9558,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });

  const focusProps = (name) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(''),
  });

  const onlyDigits = (text) => text.replace(/[^0-9]/g, '');

  const getLocationDetails = async (latitude, longitude) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const place = result?.[0];

      if (place) {
        return {
          latitude,
          longitude,
          city:
            place.city ||
            place.district ||
            place.subregion ||
            place.name ||
            '',
          state: place.region || '',
          country: place.country || '',
          pincode: place.postalCode || '',
          address: place.formattedAddress || '',
        };
      }
    } catch (error) {
      console.log('EXPO REVERSE GEOCODE ERROR:', error);
    }

    return null;
  };

  const getWebLocationDetails = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      const data = await response.json();

      console.log('WEB LOCATION RESPONSE:', data);

      return {
        latitude,
        longitude,
        city:
          data.city ||
          data.locality ||
          data.principalSubdivision ||
          '',
        state: data.principalSubdivision || '',
        country: data.countryName || '',
        pincode: data.postcode || '',
        address: data.localityInfo?.administrative?.[0]?.name || '',
      };
    } catch (error) {
      console.log('WEB LOCATION ERROR:', error);

      return null;
    }
  };

  const getLocationDetailsFromCoordinates = async (
    latitude,
    longitude
  ) => {
    if (Platform.OS === 'web') {
      return await getWebLocationDetails(latitude, longitude);
    }

    return await getLocationDetails(latitude, longitude);
  };

  const handleMapPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;

    const latitude = coordinate.latitude;
    const longitude = coordinate.longitude;

    const locationData =
      await getLocationDetailsFromCoordinates(latitude, longitude);

    if (locationData) {
      console.log('SELECTED TWO WHEELER LOCATION:', locationData);

      setSelectedLocation(locationData);

      setMapRegion((currentRegion) => ({
        ...currentRegion,
        latitude,
        longitude,
      }));
    } else {
      showAlert(
        'Location Error',
        'Unable to identify this location. Please try again.'
      );
    }
  };

  const useCurrentLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        showAlert(
          'Permission Required',
          'Please allow location permission.'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      console.log('CURRENT COORDINATES:', latitude, longitude);

      const locationData =
        await getLocationDetailsFromCoordinates(latitude, longitude);

      if (!locationData) {
        showAlert(
          'Location Error',
          'Unable to identify your location.'
        );
        return;
      }

      console.log('CURRENT TWO WHEELER LOCATION:', locationData);

      setSelectedLocation(locationData);

      setMapRegion((currentRegion) => ({
        ...currentRegion,
        latitude,
        longitude,
      }));

      setMapVisible(false);
    } catch (error) {
      console.log('CURRENT LOCATION ERROR:', error);

      showAlert(
        'Location Error',
        'Unable to get your current location.'
      );
    }
  };

  const confirmLocation = () => {
    if (!selectedLocation) {
      showAlert(
        'Location Required',
        'Please select a location first.'
      );
      return;
    }


    setMapVisible(false);
  };
  const saveManualLocation = () => {
  const city = manualCity.trim();
  const state = manualState.trim();
  const pincode = manualPincode.trim();

  if (!city || !state || !/^\d{6}$/.test(pincode)) {
    showAlert(
      'Invalid Location',
      'Please enter City, State and a valid 6-digit PIN Code.'
    );
    return;
  }

  setSelectedLocation({
    city,
    state,
    pincode,
    country: 'India',
    address: `${city}, ${state}, ${pincode}`,
    latitude: null,
    longitude: null,
  });

  setMapVisible(false);
};

  const pickPhotos = async () => {
    if (images.length >= 8) {
      showAlert(
        'Photo Limit',
        'You can upload maximum 8 photos.'
      );
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showAlert(
        'Permission Required',
        'Please allow photo access.'
      );
      return;
    }

    const remainingSlots = 8 - images.length;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedPhotos = result.assets.map((asset, index) => ({
        uri: asset.uri,
        fileName: asset.fileName || `bike-${Date.now()}-${index}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
      }));

      // FIX: முன்பு ஒவ்வொரு முறையும் முந்தைய photos அழிந்துவிடும். இப்போது சேர்ந்து கொண்டே போகும்.
      setImages((currentPhotos) =>
        [...currentPhotos, ...selectedPhotos].slice(0, 8)
      );
    }
  };

  const removePhoto = (indexToRemove) => {
    setImages((currentPhotos) =>
      currentPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  // FIX: முன்பு phone/browser-ல் உள்ள local uri அப்படியே server-க்கு போனது (buyers-ஆல் பார்க்க முடியாது).
  // Car page போலவே இப்போது முதலில் upload செய்து URL அனுப்புகிறோம்.
  const uploadPhotoToCloudinary = async (photo) => {
    const formData = new FormData();

    if (Platform.OS === 'web') {
      const imageResponse = await fetch(photo.uri);

      const blob = await imageResponse.blob();

      formData.append(
        'image',
        blob,
        photo.fileName || `bike-${Date.now()}.jpg`
      );
    } else {
      formData.append('image', {
        uri: photo.uri,
        name: photo.fileName || `bike-${Date.now()}.jpg`,
        type: photo.mimeType || 'image/jpeg',
      });
    }

    const response = await fetch(
      'http://localhost:8080/upload/image',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    console.log('CLOUDINARY IMAGE RESPONSE:', data);

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Image upload failed');
    }

    return data.imageUrl;
  };

  const uploadAllPhotos = async () => {
    const uploadedImageUrls = [];

    for (let i = 0; i < images.length; i++) {
      console.log(`UPLOADING PHOTO ${i + 1}/${images.length}`);

      const imageUrl = await uploadPhotoToCloudinary(images[i]);

      uploadedImageUrls.push(imageUrl);
    }

    return uploadedImageUrls;
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (!vehicleName) {
      showAlert('Missing Details', 'Please select brand.');
      return;
    }

    if (!year || !variant || !fuelType || !kmDriven || !price) {
      showAlert(
        'Missing Details',
        'Please fill all required vehicle details.'
      );
      return;
    }
    const numericPrice = Number(price);

if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
  showAlert(
    'Invalid Price',
    'Please enter a valid vehicle price.'
  );
  return;
}

    if (year.length !== 4) {
      showAlert(
        'Invalid Year',
        'Please enter a valid 4-digit manufacturing year.'
      );
      return;
    }

    const latestYear = new Date().getFullYear() + 1;

    if (Number(year) < 1980 || Number(year) > latestYear) {
      showAlert(
        'Invalid Year',
        `Manufacturing year must be between 1980 and ${latestYear}.`
      );
      return;
    }

    if (!selectedLocation) {
      showAlert(
        'Location Required',
        'Please select your two wheeler location on the map.'
      );
      return;
    }

    if (images.length === 0) {
      showAlert(
        'Photo Required',
        'Please select at least one vehicle photo.'
      );
      return;
    }

    if (!paymentMethod) {
      showAlert('Payment Method', 'Please select payment method.');
      return;
    }

    // FIX: பல முறை tap செய்தால் பல முறை post ஆகாமல் தடுக்கிறது
    setSubmitting(true);

    try {
      const token = await getToken();

      console.log('LOGIN TOKEN EXISTS:', !!token);

      if (!token) {
        showAlert(
          'Login Required',
          'Please login before posting your two wheeler.'
        );
        return;
      }

      const uploadedImageUrls = await uploadAllPhotos();

      console.log('CLOUDINARY IMAGE URLS:', uploadedImageUrls);

      const vehicleData = {
        vehicleType: 'Two Wheeler',

        title: `${vehicleName} ${variant}`,

        brand: vehicleName,

        modelName: variant,

        year: Number(year),

        price: Number(price),

        paymentMethod: paymentMethod,

        kmsDriven: Number(kmDriven),

        fuelType: fuelType,

        transmission: 'Manual',

        ownerType: '1st Owner',

        condition: 'Used',

        location: [
          selectedLocation.city,
          selectedLocation.state,
          selectedLocation.pincode,
        ]
          .filter(Boolean)
          .join(', '),

        description: description,

        images: uploadedImageUrls,
      };

      console.log('SENDING TWO WHEELER DATA:', vehicleData);

      const response = await fetch('http://localhost:8080/car/add', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(vehicleData),
      });

      const data = await response.json();

      console.log('TWO WHEELER SERVER RESPONSE:', data);

      if (!response.ok || !data.success) {
        showAlert(
          'Failed',
          data.message ||
            data.error ||
            'Unable to post your two wheeler.'
        );
        return;
      }

      if (data.paymentRequired) {
        goToPayment({
          vehicleType: 'Two Wheeler',
          paymentMethod: paymentMethod,
          carId: data.carId,
        });

        return;
      }

      setVehicleName('');
      setYear('');
      setVariant('');
      setFuelType('');
      setKmDriven('');
      setPrice('');
      setDescription('');
      setPaymentMethod('');
      setImages([]);
      setSelectedLocation(null);
      setManualCity('');
      setManualState('');
      setManualPincode('');

      showAlert(
        'Success 🎉',
        data.message ||
          'Your two wheeler has been posted successfully on CARVIO.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onFeedbackRequired) {
                onFeedbackRequired();
              } else {
                setActiveTab('MY LISTINGS');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log('POST TWO WHEELER ERROR:', error);

      showAlert(
        'Upload Error',
        'Unable to connect to the CARVIO server. Please make sure the backend server is running.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount =
    [
      vehicleName,
      year,
      variant,
      fuelType,
      kmDriven,
      price,
      paymentMethod,
    ].filter(Boolean).length +
    (selectedLocation ? 1 : 0) +
    (images.length > 0 ? 1 : 0);

  const progressPercent = Math.round(
    (completedCount / TOTAL_STEPS) * 100
  );


const formattedPrice = price
  ? `₹ ${Number(price).toLocaleString('en-IN')}`
  : '';

const listingFee = 200;

const formattedListingFee =
  `₹ ${listingFee.toLocaleString('en-IN')}`;

const locationTitle =
  selectedLocation?.city ||
  selectedLocation?.address ||
  'Location Selected';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>SELL YOUR TWO WHEELER</Text>

          <Text style={styles.subtitle}>
            List your bike or scooter on CARVIO
          </Text>

          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>
                {completedCount} of {TOTAL_STEPS} details added
              </Text>

              <Text style={styles.progressPercent}>
                {progressPercent}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader icon="🏍️" title="Two Wheeler Details" />

          <Text style={styles.label}>Brand Name</Text>

          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setShowBrandDropdown(true)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.dropdownText,
                !vehicleName && styles.dropdownPlaceholder,
              ]}
            >
              {vehicleName || 'Select Brand'}
            </Text>

            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Year</Text>

          <TextInput
            style={[
              styles.input,
              focusedField === 'year' && styles.inputFocused,
            ]}
            placeholder="Eg: 2022"
            placeholderTextColor="#98A2B3"
            keyboardType="numeric"
            maxLength={4}
            value={year}
            onChangeText={(text) => setYear(onlyDigits(text))}
            {...focusProps('year')}
          />

          <Text style={styles.label}>Variant</Text>

          <TextInput
            style={[
              styles.input,
              focusedField === 'variant' && styles.inputFocused,
            ]}
            placeholder="Eg: Activa 6G Deluxe"
            placeholderTextColor="#98A2B3"
            value={variant}
            onChangeText={setVariant}
            {...focusProps('variant')}
          />

          <Text style={styles.label}>Fuel Type</Text>

          <ChipGroup
            options={FUEL_OPTIONS}
            value={fuelType}
            onChange={setFuelType}
          />

          <Text style={styles.label}>KM Driven</Text>

          <View
            style={[
              styles.inputRow,
              focusedField === 'km' && styles.inputFocused,
            ]}
          >
            <TextInput
              style={[styles.inputInner, { paddingLeft: 0 }]}
              placeholder="Eg: 25000"
              placeholderTextColor="#98A2B3"
              keyboardType="numeric"
              value={kmDriven}
              onChangeText={(text) => setKmDriven(onlyDigits(text))}
              {...focusProps('km')}
            />

            <Text style={styles.inputAffix}>km</Text>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader icon="💰" title="Expected Price" />

          <Text style={styles.label}>Expected Price</Text>

          <View
            style={[
              styles.inputRow,
              focusedField === 'price' && styles.inputFocused,
            ]}
          >
            <Text style={styles.inputAffix}>₹</Text>

            <TextInput
              style={styles.inputInner}
              placeholder="Eg: 75000"
              placeholderTextColor="#98A2B3"
              keyboardType="numeric"
              value={price}
              onChangeText={(text) => setPrice(onlyDigits(text))}
              {...focusProps('price')}
            />
          </View>

          {formattedPrice ? (
            <Text style={styles.pricePreview}>{formattedPrice}</Text>
          ) : null}
          
{price !== '' && (
  <View
    style={{
      marginTop: 14,
      padding: 14,
      backgroundColor: '#EEF4FF',
      borderRadius: 12,
    }}
  >
    <Text
      style={{
        color: '#12224F',
        fontSize: 15,
        fontWeight: '700',
      }}
    >
      Listing Fee: {formattedListingFee}
    </Text>
  </View>
)}

        </View>

        
<View style={styles.card}>
  <SectionHeader icon="📍" title="Location" />

  <Text style={styles.label}>Location</Text>

  <TouchableOpacity
    style={styles.dropdownInput}
    onPress={useCurrentLocation}
    activeOpacity={0.8}
  >
    <Text style={styles.dropdownText}>
      📍 Use Current Location
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.dropdownInput, { marginTop: 10 }]}
    onPress={() => {
      setLocationMode('manual');
      setMapVisible(true);
    }}
    activeOpacity={0.8}
  >
    <Text style={styles.dropdownText}>
      ✍️ Enter Location Manually
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.dropdownInput, { marginTop: 10 }]}
    onPress={() => {
      setLocationMode('map');
      setMapVisible(true);
    }}
    activeOpacity={0.8}
  >
    <Text style={styles.dropdownText}>
      🗺️ Select on Map
    </Text>
  </TouchableOpacity>

  <Text style={styles.helperText}>
    Choose GPS, enter your location manually, or select on the map.
  </Text>

  {selectedLocation && (
    <View style={styles.locationSummary}>
      <Text style={styles.locationSummaryTitle}>
        📍 {locationTitle}
      </Text>

      {selectedLocation.state ? (
        <Text style={styles.locationSummarySub}>
          {selectedLocation.state}
        </Text>
      ) : null}

      {selectedLocation.pincode ? (
        <Text style={styles.locationSummarySub}>
          PIN: {selectedLocation.pincode}
        </Text>
      ) : null}
    </View>
  )}
</View>

        <View style={styles.card}>
          <SectionHeader icon="📷" title="Vehicle Photos" />

          <Text style={[styles.photoDescription, { marginTop: 8 }]}>
            Add clear photos of your vehicle. You can upload up to 8 photos.
          </Text>

          {images.length === 0 ? (
            <TouchableOpacity
              style={styles.photoUploadButton}
              onPress={pickPhotos}
              activeOpacity={0.8}
            >
              <View style={styles.photoUploadIconCircle}>
                <Text style={styles.photoUploadIcon}>+</Text>
              </View>

              <Text style={styles.photoUploadText}>
                Select Vehicle Photos
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.photosContainer}>
              {images.map((photo, index) => (
                <View
                  key={`${photo.uri}-${index}`}
                  style={styles.photoItem}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.carPhoto}
                  />

                  {index === 0 && (
                    <View style={styles.mainPhotoBadge}>
                      <Text style={styles.mainPhotoText}>
                        Main Photo
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {images.length < 8 && (
                <TouchableOpacity
                  style={styles.addPhotoTile}
                  onPress={pickPhotos}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addPhotoTileIcon}>+</Text>

                  <Text style={styles.addPhotoTileText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text style={styles.photoCount}>
            {images.length} / 8 photos selected
          </Text>
        </View>

        <View style={styles.card}>
          <SectionHeader icon="📝" title="Additional Information" />

          <Text style={styles.label}>Description</Text>

          <TextInput
            style={[
              styles.textArea,
              focusedField === 'description' && styles.inputFocused,
            ]}
            placeholder="Tell buyers about your two wheeler..."
            placeholderTextColor="#98A2B3"
            multiline
            numberOfLines={5}
            maxLength={500}
            value={description}
            onChangeText={setDescription}
            {...focusProps('description')}
          />

          <Text style={styles.characterCount}>
            {description.length}/500
          </Text>
        </View>

        <View style={styles.card}>
          <SectionHeader icon="💳" title="Payment Method" />

          <View style={[styles.paymentContainer, { marginTop: 14 }]}>
            {[
              {
                name: 'GPay',
                logo: Gpay,
              },
              {
                name: 'PhonePe',
                logo: Phonepay,
              },
              {
                name: 'Bank Transfer',
                logo: Bank,
              },
              {
                name: 'Finance / Loan',
                logo: Loan,
              },
            ].map((method) => {
              const selected = paymentMethod === method.name;

              return (
                <TouchableOpacity
                  key={method.name}
                  style={[
                    styles.paymentOption,
                    selected && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setPaymentMethod(method.name)}
                  activeOpacity={0.8}
                >
                  <View style={styles.paymentLogoBox}>
                    <Image
                      source={method.logo}
                      style={styles.paymentLogo}
                      resizeMode="contain"
                    />
                  </View>

                  <Text
                    style={[
                      styles.paymentText,
                      selected && styles.paymentTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {method.name}
                  </Text>

                  {selected && (
                    <View style={styles.paymentCheckBadge}>
                      <Text style={styles.paymentCheck}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setActiveTab('SELL CARS')}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>
            ← Back to Vehicle Categories
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          {formattedPrice ? (
            <View style={styles.footerPriceBox}>
              <Text style={styles.footerPriceLabel}>ASKING PRICE</Text>

              <Text style={styles.footerPrice} numberOfLines={1}>
                {formattedPrice}
              </Text>
            </View>
          ) : null}
          
{price !== '' ? (
  <View style={styles.footerPriceBox}>
    <Text style={styles.footerPriceLabel}>
      LISTING FEE
    </Text>

    <Text style={styles.footerPrice} numberOfLines={1}>
      {formattedListingFee}
    </Text>
  </View>
) : null}


          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />

                <Text style={styles.submitButtonText}>Posting...</Text>
              </>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Continue</Text>

                <Text style={styles.submitArrow}>→</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <OptionSheet
        visible={showBrandDropdown}
        title="Select Brand"
        options={BRAND_LIST}
        selected={vehicleName}
        onSelect={(brand) => {
          setVehicleName(brand);
          setShowBrandDropdown(false);
        }}
        onClose={() => setShowBrandDropdown(false)}
      />

      <Modal
  visible={mapVisible}
  animationType="slide"
  onRequestClose={() => setMapVisible(false)}
>
  <View style={styles.mapScreen}>
    <View style={styles.mapHeader}>
      <View>
        <Text style={styles.mapHeaderTitle}>
          {locationMode === 'manual'
            ? 'Enter Your Location'
            : 'Select Vehicle Location'}
        </Text>

        <Text style={styles.mapHeaderSub}>
          {locationMode === 'manual'
            ? 'Enter your city, state and PIN code'
            : 'Choose your vehicle location'}
        </Text>
      </View>

      <TouchableOpacity onPress={() => setMapVisible(false)}>
        <Text style={styles.mapClose}>×</Text>
      </TouchableOpacity>
    </View>

    {locationMode === 'manual' ? (
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          placeholderTextColor="#98A2B3"
          value={manualCity}
          onChangeText={setManualCity}
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter state"
          placeholderTextColor="#98A2B3"
          value={manualState}
          onChangeText={setManualState}
        />

        <Text style={styles.label}>PIN Code</Text>

<TextInput
  style={styles.input}
  placeholder="Enter 6-digit PIN code"
  placeholderTextColor="#98A2B3"
  keyboardType="numeric"
  maxLength={6}
  value={manualPincode}
  onChangeText={(text) =>
    setManualPincode(onlyDigits(text).slice(0, 6))
  }
/>
        <TouchableOpacity
          style={[styles.mapPrimaryButton, { marginTop: 20 }]}
          onPress={saveManualLocation}
        >
          <Text style={styles.mapPrimaryButtonText}>
            Save Location
          </Text>
        </TouchableOpacity>
      </ScrollView>
    ) : Platform.OS === 'web' ? (
      <View style={styles.webMapFallback}>
        <Text style={styles.webMapPin}>📍</Text>

        <Text style={styles.webMapTitle}>Choose Location</Text>

        <Text style={styles.webMapText}>
          On the website, use GPS or enter your location manually.
          Interactive map selection is available in the native app.
        </Text>

        <TouchableOpacity
          style={styles.mapPrimaryButton}
          onPress={useCurrentLocation}
        >
          <Text style={styles.mapPrimaryButtonText}>
            Use Current Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mapSecondaryButton, { marginTop: 10 }]}
          onPress={() => setLocationMode('manual')}
        >
          <Text style={styles.mapSecondaryButtonText}>
            Enter Location Manually
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={mapRegion}
          onPress={handleMapPress}
          onRegionChangeComplete={(region) =>
            setMapRegion(region)
          }
        >
          {selectedLocation &&
            selectedLocation.latitude != null &&
            selectedLocation.longitude != null && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
                title="Vehicle Location"
                description="Your selected vehicle location"
              />
            )}
        </MapView>

        <View style={styles.mapFooter}>
          {selectedLocation && (
            <View style={styles.mapSelectedCard}>
              <Text style={styles.mapSelectedTitle}>
                📍 {locationTitle}
              </Text>

              {selectedLocation.state ? (
                <Text style={styles.mapSelectedSub}>
                  {selectedLocation.state}
                </Text>
              ) : null}
            </View>
          )}

          <TouchableOpacity
            style={styles.mapSecondaryButton}
            onPress={useCurrentLocation}
          >
            <Text style={styles.mapSecondaryButtonText}>
              📍 Use My Current Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapPrimaryButton}
            onPress={confirmLocation}
          >
            <Text style={styles.mapPrimaryButtonText}>
              Confirm Location
            </Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}