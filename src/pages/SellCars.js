import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import { getToken } from '../utils/authStorage';

import Gpay from '../assets/Gpay.png';
import Phonepay from '../assets/Phonepay.png';
import Bank from '../assets/Bank.png';
import Loan from '../assets/Loan.png';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { styles } from '../styles/SellCars.styles';

// react-native-maps web-ல் வேலை செய்யாது, அதனால் native-ல் மட்டும் load செய்கிறோம்
const MapsModule =
  Platform.OS !== 'web' ? require('react-native-maps') : null;

const MapView = MapsModule ? MapsModule.default : null;
const Marker = MapsModule ? MapsModule.Marker : null;
const PROVIDER_GOOGLE = MapsModule ? MapsModule.PROVIDER_GOOGLE : null;

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

const TOTAL_STEPS = 13;

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

export default function SellCars({ 
  setActiveTab, 
  goToPayment, 
  onFeedbackRequired, 
}) {
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [variant, setVariant] = useState('');

  const [brandDropdownVisible, setBrandDropdownVisible] =
    useState(false);

  const carBrands = {
    'Maruti Suzuki': [
      'Swift',
      'Baleno',
      'Wagon R',
      'Dzire',
      'Brezza',
      'Ertiga',
      'Fronx',
      'Grand Vitara',
      'Alto K10',
      'Celerio',
      'New-gen Swift',
      'S-Presso',
      'Victoris',
      'Ignis',
      'Invicto',
      'XL6',
      'Jimny',
      'e Vitara',
      '800',
      'A-star',
      'Alto',
      'Alto-800',
      'Alto-k10',
      'Celerio X',
      'Ciaz',
      'Ciaz S',
      'Eeco',
      'Esteem',
      'Estilo',
      'Gypsy',
      'Omni',
      'Ritz',
      'S Cross',
      'Swift Dzire Tour',
      'SX4',
      'Versa',
      'Vitara Brezza',
      'Zen Estilo',
    ],

    Hyundai: [
      'Alcazar',
      'Accent',
      'Avante',
      'Bayon',
      'Carlino',
      'Creta Electric',
      'Creta N Line',
      'Creta EV',
      'Exter',
      'Elantra',
      'Getz',
      'Genesis',
      'Grand i10 Nios',
      'Grand i10 Prime',
      'Kona EV',
      'Ioniq 5',
      'Ioniq 5 facelift',
      'Ioniq 6',
      'Ioniq 9',
      'Neo Fluidic Elantra',
      'New Elantra',
      'New Santa Fe',
      'Palisade',
      'Santro',
      'Santro Xing',
      'Sonata',
      'Sonata Embera',
      'Stargazer',
      'Terracan',
      'Tucson',
      'Tucson facelift',
      'Venue N Line',
      'Venue',
      'i20',
      'Verna',
      'i20 N Line',
    ],

    Tata: [
      'Altroz EV',
      'Altroz',
      'Avinya',
      'Curvv EV',
      'Harrier EV',
      'Indigo V2',
      'Indica',
      'Nexon EV Max',
      'Nexon',
      'Punch',
      'Punch EV',
      'Punch Facelift',
      'Safari',
      'Sierra',
      'Tiago EV',
      'Aria',
      'Bolt',
      'Estate',
      'H5X',
      'Harrier',
      'Hexa',
      'Indigo CS',
      'Indigo Marina',
      'Manza',
      'Nano',
      'Spacio',
      'Sumo',
      'Sumo Gold',
      'Sumo Grande',
      'Sumo Victa',
      'Tiago',
      'Tigor',
      'Tigor EV',
      'Ventura',
      'Winger',
      'Curvv',
      'Tiago NRG',
      'Xenon XT',
      'Zest',
    ],

    Mahindra: [
      'Bolero',
      'Bolero Neo',
      'Bolero Neo Plus',
      'Genio',
      'Pick Up',
      'Imperio',
      'KUV100NXT',
      'Maxx',
      'Scorpio',
      'Thar',
      'Vision S sub-4metre SUV',
      'Vision',
      'Vision SXT',
      'Vision T',
      'Vision X',
      'Scorpio N',
      'XEV 7e',
      'XEV 9s',
      'XEV 9e',
      'XUV 3XO',
      'XUV 3XO EV',
      'XUV 7XO',
      'XUV700',
      'XUV300',
      'XUV400',
      'XUV400 EV',
      'Marazzo',
      'Alturas G4',
      'Armada',
      'Bolero Power Plus',
      'E Verito',
      'e2o',
      'e2o plus',
      'Inferno',
      'Ingenio',
      'Logan',
      'Jeep',
      'Marshal',
      'NuvoSport',
      'Rexton',
      'Quanto',
      'Supro',
      'TUV 300',
      'TUV 300 Plus',
      'Willys',
      'XUV 300',
      'XUV 500',
      'Xylo',
    ],

    Toyota: [
      'Innova Crysta',
      'Innova Hycross',
      'Fortuner',
      'Glanza',
      'Urban Cruiser Hyryder',
      'Rumion',
      'Camry',
      'Vellfire',
    ],

    Honda: [
      'City',
      'Amaze',
      'Elevate',
      'WR-V',
      'Jazz',
      'Civic',
      'CR-V',
    ],

    Kia: [
      'Seltos',
      'Sonet',
      'Carens',
      'EV6',
      'Carnival',
    ],

    Renault: [
      'Kwid',
      'Triber',
      'Kiger',
      'Duster',
    ],

    Nissan: [
      'Magnite',
      'Kicks',
      'Terrano',
    ],

    Volkswagen: [
      'Polo',
      'Virtus',
      'Taigun',
      'Vento',
      'Tiguan',
    ],

    Skoda: [
      'Slavia',
      'Kushaq',
      'Kodiaq',
      'Superb',
      'Rapid',
    ],

    MG: [
      'Hector',
      'Astor',
      'ZS EV',
      'Gloster',
      'Comet EV',
    ],

    Jeep: [
      'Compass',
      'Meridian',
      'Wrangler',
      'Grand Cherokee',
    ],

    Ford: [
      'EcoSport',
      'Endeavour',
      'Figo',
      'Aspire',
      'Freestyle',
    ],

    'Ashok Leyland': [
      'Dost',
      'Dost Plus',
      'Bada Dost',
      'Partner',
    ],

    BMW: [
      '3 Series',
      '5 Series',
      '7 Series',
      'X1',
      'X3',
      'X5',
      'X7',
    ],

    'Mercedes-Benz': [
      'A-Class',
      'C-Class',
      'E-Class',
      'S-Class',
      'GLA',
      'GLC',
      'GLE',
    ],

    Audi: [
      'A3',
      'A4',
      'A6',
      'Q3',
      'Q5',
      'Q7',
    ],

    Volvo: [
      'XC40',
      'XC60',
      'XC90',
      'S90',
    ],
     Bentley: [
      'Continental GT',
      'Flying Spur',
      'Bentayga',
    ],

    Ferrari: [
      'Roma',
      '296 GTB',
      'SF90 Stradale',
      'Purosangue',
    ],

    Jaguar: [
      'XE',
      'XF',
      'XJ',
      'F-Pace',
      'F-Type',
      'I-Pace',
    ],

    Lamborghini: [
      'Urus',
      'Huracan',
      'Aventador',
      'Revuelto',
    ],

    'Land Rover': [
      'Range Rover',
      'Range Rover Sport',
      'Range Rover Velar',
      'Range Rover Evoque',
      'Discovery',
      'Defender',
    ],

    Lexus: [
      'ES',
      'NX',
      'RX',
      'LX',
      'LC',
    ],

    Maserati: [
      'Ghibli',
      'Levante',
      'Quattroporte',
      'MC20',
      'GranTurismo',
    ],

    MINI: [
      'Cooper',
      'Countryman',
      'Clubman',
      'Convertible',
    ],

    Porsche: [
      '911',
      'Cayenne',
      'Macan',
      'Panamera',
      'Taycan',
    ],

    'Multi-Brand': [],
  
  };

  const brandList = Object.keys(carBrands);

  const selectBrand = (selectedBrand) => {
    setBrand(selectedBrand);
    setBrandDropdownVisible(false);
  };
  const [bodyType, setBodyType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [owners, setOwners] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');

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
const bodyTypeOptions = [
  'Hatchback',
  'Sedan',
  'SUV',
  'MUV',
  'Luxury',
];
  const fuelOptions = [
    'Petrol',
    'Diesel',
    'CNG',
    'Electric',
  ];

  const transmissionOptions = [
    'Manual',
    'Automatic',
  ];

  const ownerOptions = [
    '1st Owner',
    '2nd Owner',
    '3rd Owner',
    '4th Owner',
    '4+ Owners',
  ];

  const conditionOptions = [
    'Used Car',
    'New',
  ];

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
      console.log('SELECTED LOCATION:', locationData);

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

      const currentLocation =
        await Location.getCurrentPositionAsync({
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

      console.log('CURRENT LOCATION:', locationData);

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

  const [carPhotos, setCarPhotos] = useState([]);

  const pickCarPhotos = async () => {
    if (carPhotos.length >= 8) {
      showAlert(
        'Photo Limit',
        'You can upload maximum 8 photos.'
      );
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      showAlert(
        'Permission Required',
        'Please allow photo access to upload car photos.'
      );
      return;
    }

    const remainingSlots = 8 - carPhotos.length;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedPhotos = result.assets.map((asset, index) => ({
        uri: asset.uri,
        // FIX: ஒரே நேரத்தில் பல photos தேர்ந்தால் file name duplicate ஆகாமல் இருக்க index சேர்த்துள்ளோம்
        fileName: asset.fileName || `car-${Date.now()}-${index}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
      }));

      setCarPhotos((currentPhotos) =>
        [...currentPhotos, ...selectedPhotos].slice(0, 8)
      );
    }
  };

  const removePhoto = (indexToRemove) => {
    setCarPhotos((currentPhotos) =>
      currentPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const uploadPhotoToCloudinary = async (photo) => {
    const formData = new FormData();

    if (Platform.OS === 'web') {
      const imageResponse = await fetch(photo.uri);

      const blob = await imageResponse.blob();

      formData.append(
        'image',
        blob,
        photo.fileName || `car-${Date.now()}.jpg`
      );
    } else {
      formData.append('image', {
        uri: photo.uri,
        name: photo.fileName || `car-${Date.now()}.jpg`,
        type: photo.mimeType || 'image/jpeg',
      });
    }

    const response = await fetch(
    'https://carvio-backend.onrender.com/upload/image',
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

  const uploadAllCarPhotos = async () => {
    const uploadedImageUrls = [];

    for (let i = 0; i < carPhotos.length; i++) {
      console.log(
        `UPLOADING CAR PHOTO ${i + 1}/${carPhotos.length}`
      );

      const imageUrl = await uploadPhotoToCloudinary(carPhotos[i]);

      uploadedImageUrls.push(imageUrl);
    }

    return uploadedImageUrls;
  };
 

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    console.log('POST MY CAR BUTTON CLICKED');

    if (
  !brand ||
  !year ||
  !variant ||
  !bodyType ||
  !fuelType ||
  !transmission ||
  !kmDriven ||
  !owners ||
  !condition ||
  !price ||
  !paymentMethod
) {
  showAlert(
    'Missing Details',
    'Please fill all required car details.'
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
        if (Number(price) < 10000) {
      showAlert(
        'Invalid Selling Price',
        'Minimum car selling price must be ₹10,000.'
      );
      return;
    }

    if (!selectedLocation) {
      showAlert(
        'Location Required',
        'Please select your car location on the map.'
      );
      return;
    }

    if (carPhotos.length === 0) {
      showAlert(
        'Photo Required',
        'Please add at least one car photo.'
      );
      return;
    }

    // FIX: பல முறை tap செய்தால் car பல முறை post ஆகாமல் தடுக்கிறது
    setSubmitting(true);

    try {
      const token = await getToken();

      console.log('LOGIN TOKEN EXISTS:', !!token);

      if (!token) {
        showAlert(
          'Login Required',
          'Please login before posting your car.'
        );
        return;
      }

      console.log('STARTING CLOUDINARY UPLOAD...');

      const uploadedImageUrls = await uploadAllCarPhotos();

      console.log('CLOUDINARY IMAGE URLS:', uploadedImageUrls);

      const carData = {
        vehicleType: 'Car',
        bodyType: bodyType,
        title: `${brand} ${variant}`,
        brand: brand,
        modelName: variant,
        year: Number(year),
        price: Number(price),
        paymentMethod: paymentMethod,
        kmsDriven: Number(kmDriven),
        fuelType: fuelType,
        transmission: transmission,

        location: [
          selectedLocation.city,
          selectedLocation.state,
          selectedLocation.pincode,
        ]
          .filter(Boolean)
          .join(', '),

        ownerType: owners,
        condition: condition,
        description: description,
        images: uploadedImageUrls,
      };

      console.log('SENDING CAR DATA:', carData);

      console.log('CALLING CAR ADD API...');

      const response = await fetch('https://carvio-backend.onrender.com/car/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(carData),
      });

      const data = await response.json();

      console.log('SERVER RESPONSE:', data);

      if (!response.ok || !data.success) {
        showAlert(
          'Failed',
          data.message || data.error || 'Unable to post your car.'
        );
        return;
      }

      if (data.paymentRequired) {
        goToPayment({
          vehicleType: 'Car',
          paymentMethod: paymentMethod,
          carId: data.carId,
        });
        return;
      }

      setBrand('');
      setYear('');
      setVariant('');
      setFuelType('');
      setBodyType('');
      setTransmission('');
      setKmDriven('');
      setOwners('');
      setCondition('');
      setPrice('');
      setPaymentMethod('');
      setDescription('');
      setSelectedLocation(null);
      setCarPhotos([]);
      setManualCity('');
      setManualState('');
      setManualPincode('');

      setBrandDropdownVisible(false);
      setMapVisible(false);

      
      showAlert(
        'Car Posted Successfully 🎉',
        data.message ||
          'Your car has been posted successfully on CARVIO.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onFeedbackRequired) {
                onFeedbackRequired();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log('POST CAR ERROR:', error);

      showAlert(
        'Upload Error',
        error.message ||
          'Unable to upload your car. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount =
  [
    brand,
    year,
    variant,
    bodyType,
    fuelType,
    transmission,
    kmDriven,
    owners,
    condition,
    price,
    paymentMethod,
  ].filter(Boolean).length +
  (selectedLocation ? 1 : 0) +
  (carPhotos.length > 0 ? 1 : 0);
  
  const progressPercent = Math.round(
    (completedCount / TOTAL_STEPS) * 100
  );

  const formattedPrice = price
    ? `₹ ${Number(price).toLocaleString('en-IN')}`
    : '';
const numericPrice = Number(price) || 0;

const listingFee =
  numericPrice < 10000
    ? 0
    : numericPrice <= 500000
    ? 250
    : numericPrice <= 1000000
    ? 300
    : 500;

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
          <Text style={styles.title}>Sell Your Car</Text>

          <Text style={styles.subtitle}>
            List your car on CARVIO and connect with genuine buyers.
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
          <SectionHeader icon="🚗" title="Car Details" />

          <Text style={styles.label}>Body Type</Text>

<ChipGroup
  options={bodyTypeOptions}
  value={bodyType}
  onChange={setBodyType}
/>

          <Text style={styles.label}>Car Brand</Text>

          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setBrandDropdownVisible(true)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.dropdownText,
                !brand && styles.dropdownPlaceholder,
              ]}
            >
              {brand || 'Select Car Brand'}
            </Text>

            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Manufacturing Year</Text>

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
            placeholder="Eg: VXI / VDI / EV"
            placeholderTextColor="#98A2B3"
            value={variant}
            onChangeText={setVariant}
            {...focusProps('variant')}
          />
        </View>

        <View style={styles.card}>
          <SectionHeader icon="⚙️" title="Car Specifications" />

          <Text style={styles.label}>Fuel Type</Text>

          <ChipGroup
            options={fuelOptions}
            value={fuelType}
            onChange={setFuelType}
          />

          <Text style={styles.label}>Transmission</Text>

          <ChipGroup
            options={transmissionOptions}
            value={transmission}
            onChange={setTransmission}
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
              placeholder="Eg: 45000"
              placeholderTextColor="#98A2B3"
              keyboardType="numeric"
              value={kmDriven}
              onChangeText={(text) => setKmDriven(onlyDigits(text))}
              {...focusProps('km')}
            />

            <Text style={styles.inputAffix}>km</Text>
          </View>

          <Text style={styles.label}>Number of Owners</Text>

          <ChipGroup
            options={ownerOptions}
            value={owners}
            onChange={setOwners}
          />

          <Text style={styles.label}>Car Condition</Text>

          <ChipGroup
            options={conditionOptions}
            value={condition}
            onChange={setCondition}
          />
        </View>

      
          
<View style={styles.card}>
  <SectionHeader icon="📍" title="Location" />

  <Text style={styles.label}>
    Where is your car located?
  </Text>

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
          <SectionHeader icon="💰" title="Selling Price" />

          <Text style={styles.label}>Selling Price</Text>

          <View
            style={[
              styles.inputRow,
              focusedField === 'price' && styles.inputFocused,
            ]}
          >
            <Text style={styles.inputAffix}>₹</Text>

            <TextInput
              style={styles.inputInner}
              placeholder="Eg: 750000"
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
    {numericPrice < 10000 ? (
      <Text style={{ color: '#D92D20', fontWeight: '600' }}>
        Minimum selling price is ₹10,000.
      </Text>
    ) : (
      <Text style={{ color: '#12224F', fontSize: 15, fontWeight: '700' }}>
        Listing Fee: {formattedListingFee}
      </Text>
    )}
  </View>
)}
</View>


        <View style={styles.card}>
          <SectionHeader icon="📷" title="Car Photos" />

          <Text style={[styles.photoDescription, { marginTop: 8 }]}>
            Add clear photos of your car. You can upload up to 8 photos.
          </Text>

          {carPhotos.length === 0 ? (
            <TouchableOpacity
              style={styles.photoUploadButton}
              onPress={pickCarPhotos}
              activeOpacity={0.8}
            >
              <View style={styles.photoUploadIconCircle}>
                <Text style={styles.photoUploadIcon}>+</Text>
              </View>

              <Text style={styles.photoUploadText}>
                Add Car Photos
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.photosContainer}>
              {carPhotos.map((photo, index) => (
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

              {carPhotos.length < 8 && (
                <TouchableOpacity
                  style={styles.addPhotoTile}
                  onPress={pickCarPhotos}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addPhotoTileIcon}>+</Text>

                  <Text style={styles.addPhotoTileText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {carPhotos.length > 0 && (
            <Text style={styles.photoCount}>
              {carPhotos.length}/8 photos added
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <SectionHeader icon="📝" title="Additional Information" />

          <Text style={styles.label}>Description</Text>

          <TextInput
            style={[
              styles.textArea,
              focusedField === 'description' && styles.inputFocused,
            ]}
            placeholder="Tell buyers about your car..."
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

          <Text style={[styles.photoDescription, { marginTop: 8 }]}>
            Select your preferred payment method
          </Text>

          <View style={styles.paymentContainer}>
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
          onPress={() => setActiveTab('HOME')}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          {formattedPrice ? (
  <View style={styles.footerPriceBox}>
    <Text style={styles.footerPriceLabel}>
      ASKING PRICE
    </Text>

    <Text style={styles.footerPrice} numberOfLines={1}>
      {formattedPrice}
    </Text>
  </View>
) : null}

{price !== '' && numericPrice >= 10000 ? (
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
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />

                <Text style={styles.submitButtonText}>
                  Posting...
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  Post My Car
                </Text>

                <Text style={styles.submitArrow}>→</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={brandDropdownVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBrandDropdownVisible(false)}
      >
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setBrandDropdownVisible(false)}
          />

          <View style={styles.dropdownModal}>
            <View style={styles.sheetHandle} />

            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>
                Select Car Brand
              </Text>

              <TouchableOpacity
                onPress={() => setBrandDropdownVisible(false)}
              >
                <Text style={styles.dropdownClose}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.dropdownOptions}>
              {brandList.map((brandName) => {
                const isSelected = brand === brandName;

                return (
                  <TouchableOpacity
                    key={brandName}
                    style={[
                      styles.dropdownOption,
                      isSelected && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => selectBrand(brandName)}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        isSelected &&
                          styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {brandName}
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

      
<Modal
  visible={mapVisible}
  animationType="slide"
  onRequestClose={() => setMapVisible(false)}
>
  <View style={styles.mapScreen}>
    <View style={styles.mapHeader}>
      <View>
        <Text style={styles.mapHeaderTitle}>
          Select Car Location
        </Text>
        <Text style={styles.mapHeaderSub}>
          Choose your preferred location method
        </Text>
      </View>

      <TouchableOpacity onPress={() => setMapVisible(false)}>
        <Text style={styles.mapClose}>×</Text>
      </TouchableOpacity>
    </View>

    {locationMode === 'manual' ? (
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={manualCity}
          onChangeText={setManualCity}
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter state"
          value={manualState}
          onChangeText={setManualState}
        />

        <Text style={styles.label}>PIN Code</Text>
        <TextInput
          style={styles.input}
          placeholder="6-digit PIN code"
          keyboardType="numeric"
          maxLength={6}
          value={manualPincode}
          onChangeText={(text) =>
            setManualPincode(text.replace(/[^0-9]/g, ''))
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

        <Text style={styles.webMapTitle}>
          Current Location
        </Text>

        <Text style={styles.webMapText}>
          You can use GPS or enter your car's location manually.
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
                title="Car Location"
                description="Your selected car location"
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