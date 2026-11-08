import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  useWindowDimensions,
} from "react-native";

import * as Location from "expo-location";

import { getToken } from "../utils/authStorage";

const DEFAULT_LOCATION = {
  latitude: 11.0168,
  longitude: 76.9558,
};

// Same values as the Buy page filters, so edited listings stay filterable.
const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid", "PHEV"];
const TRANSMISSION_OPTIONS = ["Manual", "Automatic"];
const OWNER_OPTIONS = ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"];

// outlineStyle is a web-only style; keep it away from native platforms.
const WEB_NO_OUTLINE =
  Platform.OS === "web" ? { outlineStyle: "none" } : {};

const isCoordinateLocation = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }

  const parts = value.split(",");

  if (parts.length !== 2) {
    return false;
  }

  const latitude = Number(parts[0].trim());
  const longitude = Number(parts[1].trim());

  return (
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  );
};

const getCoordinatesFromLocation = (value) => {
  if (!isCoordinateLocation(value)) {
    return DEFAULT_LOCATION;
  }

  const parts = value.split(",");

  return {
    latitude: Number(parts[0].trim()),
    longitude: Number(parts[1].trim()),
  };
};

/* ---------- Small UI pieces ---------- */

const Field = ({ label, required, width, hint, children }) => (
  <View style={[styles.inputGroup, { width }]}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
    {children}
    {hint ? <Text style={styles.hint}>{hint}</Text> : null}
  </View>
);

// TextInput with a blue focus highlight (UI only)
const FormInput = ({ style, onFocus, onBlur, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      {...props}
      style={[styles.input, style, focused && styles.inputFocused]}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
    />
  );
};

const ChipSelect = ({ options, value, onChange }) => {
  // Keep an existing value visible even if it is not in the default list
  const allOptions =
    value && !options.includes(value) ? [...options, value] : options;

  return (
    <View style={styles.chipWrap}>
      {allOptions.map((option) => {
        const active = value === option;

        return (
          <TouchableOpacity
            key={option}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(active ? "" : option)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MessageBanner = ({ message }) => {
  if (!message) {
    return null;
  }

  const isError = message.type === "error";

  return (
    <View
      style={[
        styles.messageBox,
        isError ? styles.messageError : styles.messageSuccess,
      ]}
    >
      <Text style={styles.messageIcon}>{isError ? "⚠️" : "✅"}</Text>
      <Text
        style={[
          styles.messageText,
          isError ? styles.messageTextError : styles.messageTextSuccess,
        ]}
      >
        {message.text}
      </Text>
    </View>
  );
};

const EditCar = ({ car, setActiveTab }) => {
  const MapView =
    Platform.OS !== "web"
      ? require("react-native-maps").default
      : null;

  const Marker =
    Platform.OS !== "web"
      ? require("react-native-maps").Marker
      : null;

  const PROVIDER_GOOGLE =
    Platform.OS !== "web"
      ? require("react-native-maps").PROVIDER_GOOGLE
      : null;

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const half = isMobile ? "100%" : "48.5%";

  const scrollRef = useRef(null);
  const redirectTimer = useRef(null);

  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const [brand, setBrand] = useState(car?.brand || "");

  const [year, setYear] = useState(
    car?.year ? String(car.year) : ""
  );

  const [variant, setVariant] = useState(
    car?.modelName || ""
  );

  const [fuelType, setFuelType] = useState(
    car?.fuelType || ""
  );

  const [transmission, setTransmission] = useState(
    car?.transmission || ""
  );

  const [kmDriven, setKmDriven] = useState(
    car?.kmsDriven ? String(car.kmsDriven) : ""
  );

  const [owners, setOwners] = useState(
    car?.ownerType || ""
  );

  const [condition, setCondition] = useState(
    car?.condition || ""
  );

  const [price, setPrice] = useState(
    car?.price ? String(car.price) : ""
  );

  const [location, setLocation] = useState(
    car?.location || ""
  );

  const [description, setDescription] = useState(
    car?.description || ""
  );

  const initialCoordinates =
    getCoordinatesFromLocation(car?.location);

  const [mapVisible, setMapVisible] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState({
      latitude: initialCoordinates.latitude,
      longitude: initialCoordinates.longitude,
      city: isCoordinateLocation(car?.location)
        ? ""
        : car?.location || "",
      state: "",
      country: "",
      pincode: "",
      address: isCoordinateLocation(car?.location)
        ? ""
        : car?.location || "",
    });

  const [mapRegion, setMapRegion] = useState({
    latitude: initialCoordinates.latitude,
    longitude: initialCoordinates.longitude,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  // Alert.alert does not show on web, so messages are shown inside the screen.
  const notify = (type, text) => {
    setMessage({ type, text });

    if (!mapVisible) {
      scrollRef.current?.scrollTo?.({ y: 0, animated: true });
    }
  };

  const getReadableLocation = async (
    latitude,
    longitude
  ) => {
    try {
      if (Platform.OS === "web") {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to get location details"
          );
        }

        const data = await response.json();

        const address = data?.address || {};

        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.suburb ||
          address.district ||
          "";

        const state = address.state || "";

        const pincode = address.postcode || "";

        const country = address.country || "";

        const readableAddress = [
          city,
          state,
          pincode,
        ]
          .filter(Boolean)
          .join(", ");

        return {
          latitude,
          longitude,
          city,
          state,
          country,
          pincode,
          address:
            readableAddress ||
            data?.display_name ||
            "",
        };
      }

      const result =
        await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

      const place = result?.[0];

      if (!place) {
        return null;
      }

      const city =
        place.city ||
        place.district ||
        place.subregion ||
        "";

      const state =
        place.region ||
        place.administrativeArea ||
        "";

      const pincode =
        place.postalCode || "";

      const address = [
        city,
        state,
        pincode,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        latitude,
        longitude,
        city,
        state,
        country: place.country || "",
        pincode,
        address,
      };
    } catch (error) {
      console.log(
        "EDIT LOCATION ERROR:",
        error
      );

      return null;
    }
  };

  const createLocationText = (locationData) => {
    if (!locationData) {
      return "";
    }

    const parts = [
      locationData.city,
      locationData.state,
      locationData.pincode,
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(", ");
    }

    if (locationData.address) {
      return locationData.address;
    }

    return "";
  };

  useEffect(() => {
    const loadExistingLocation = async () => {
      if (!car?.location) {
        return;
      }

      const existingLocation =
        String(car.location).trim();

      if (!isCoordinateLocation(existingLocation)) {
        setLocation(existingLocation);

        setSelectedLocation((current) => ({
          ...current,
          city: existingLocation,
          address: existingLocation,
        }));

        return;
      }

      const coordinates =
        getCoordinatesFromLocation(
          existingLocation
        );

      setMapRegion((current) => ({
        ...current,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }));

      const locationData =
        await getReadableLocation(
          coordinates.latitude,
          coordinates.longitude
        );

      if (locationData) {
        setSelectedLocation(locationData);

        const readableLocation =
          createLocationText(locationData);

        if (readableLocation) {
          setLocation(readableLocation);
        }
      }
    };

    loadExistingLocation();
  }, [car]);

  const handleMapPress = async (event) => {
    const coordinate =
      event.nativeEvent.coordinate;

    const latitude = coordinate.latitude;
    const longitude = coordinate.longitude;

    console.log(
      "SELECTED COORDINATES:",
      latitude,
      longitude
    );

    const locationData =
      await getReadableLocation(
        latitude,
        longitude
      );

    if (!locationData) {
      notify(
        "error",
        "Unable to identify this location. Please select another location."
      );

      return;
    }

    console.log(
      "SELECTED LOCATION DATA:",
      locationData
    );

    setMessage(null);
    setSelectedLocation(locationData);

    setMapRegion((currentRegion) => ({
      ...currentRegion,
      latitude,
      longitude,
    }));
  };

  const confirmLocation = () => {
    if (!selectedLocation) {
      notify("error", "Please select a location.");

      return;
    }

    const readableLocation =
      createLocationText(selectedLocation);

    if (!readableLocation) {
      notify("error", "Location not found. Please select another location.");

      return;
    }

    console.log(
      "CONFIRMED LOCATION:",
      readableLocation
    );

    setMessage(null);
    setLocation(readableLocation);

    setSelectedLocation((current) => ({
      ...current,
      city:
        current.city ||
        readableLocation,
    }));

    setMapVisible(false);
  };

  const handleWebLocation = async () => {
    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        notify("error", "Please allow location permission.");

        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.Balanced,
        });

      const latitude =
        currentLocation.coords.latitude;

      const longitude =
        currentLocation.coords.longitude;

      console.log(
        "CURRENT LOCATION:",
        latitude,
        longitude
      );

      const locationData =
        await getReadableLocation(
          latitude,
          longitude
        );

      if (!locationData) {
        notify("error", "Unable to identify your current location.");

        return;
      }

      const readableLocation =
        createLocationText(locationData);

      if (!readableLocation) {
        notify("error", "Unable to find city and state.");

        return;
      }

      console.log(
        "WEB LOCATION:",
        readableLocation
      );

      setMessage(null);
      setSelectedLocation(locationData);

      setLocation(readableLocation);

      setMapRegion((currentRegion) => ({
        ...currentRegion,
        latitude,
        longitude,
      }));

      setMapVisible(false);
    } catch (error) {
      console.log(
        "WEB LOCATION ERROR:",
        error
      );

      notify("error", "Unable to detect your current location.");
    }
  };

  const handleUpdate = async () => {
    // Prevent double submit while saving or while redirecting after success
    if (saving || message?.type === "success") {
      return;
    }

    try {
      setMessage(null);

      const finalLocation =
        location.trim();

      if (
        !brand.trim() ||
        !year.trim() ||
        !variant.trim() ||
        !price.trim()
      ) {
        notify("error", "Please fill all required fields.");

        return;
      }

      if (!/^\d{4}$/.test(year.trim())) {
        notify("error", "Please enter a valid 4-digit year.");

        return;
      }

      if (!(Number(price) > 0)) {
        notify("error", "Please enter a valid selling price.");

        return;
      }

      if (!finalLocation) {
        notify("error", "Please select your vehicle location.");

        return;
      }

      if (isCoordinateLocation(finalLocation)) {
        notify(
          "error",
          "Please select a readable location such as Coimbatore, Tamil Nadu."
        );

        return;
      }

      const token = await getToken();

      if (!token) {
        notify("error", "Please login again.");

        return;
      }

      console.log(
        "UPDATING LOCATION:",
        finalLocation
      );

      const updateData = {
        brand: brand.trim(),
        modelName: variant.trim(),
        year: Number(year),
        condition,
        kmsDriven:
          Number(kmDriven) || 0,
        fuelType,
        transmission,
        ownerType: owners,
        price: Number(price),
        location: finalLocation,
        description,
      };

      console.log(
        "UPDATE DATA:",
        updateData
      );

      setSaving(true);

      const response = await fetch(
        `http://localhost:8080/car/${car._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            updateData
          ),
        }
      );

      const data =
        await response.json();

      console.log(
        "UPDATE CAR RESPONSE:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        notify(
          "error",
          data.message || "Unable to update vehicle."
        );

        return;
      }

      notify("success", "Vehicle details updated successfully.");

      redirectTimer.current = setTimeout(() => {
        setActiveTab("MY LISTINGS");
      }, 1400);
    } catch (error) {
      console.log(
        "UPDATE CAR ERROR:",
        error
      );

      notify("error", "Unable to update vehicle. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!car) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          No car selected for editing.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            setActiveTab(
              "MY LISTINGS"
            )
          }
        >
          <Text style={styles.backButtonText}>
            ← Back to My Listings
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pricePreview =
    price && !Number.isNaN(Number(price))
      ? `₹${Number(price).toLocaleString("en-IN")}`
      : "";

  const hasLocationDetails =
    selectedLocation &&
    (selectedLocation.city || selectedLocation.state);

  const locked = saving || message?.type === "success";

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          isMobile && styles.contentMobile,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner */}
        <View style={[styles.banner, isMobile && styles.bannerMobile]}>
          <View pointerEvents="none" style={styles.bannerGlow} />

          <Text style={styles.bannerLabel}>EDIT LISTING</Text>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Edit Vehicle
          </Text>
          <Text style={styles.subtitle}>
            Update your vehicle details easily
          </Text>
        </View>

        {!mapVisible && <MessageBanner message={message} />}

        {/* Vehicle information */}
        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>

          <View style={styles.grid}>
            <Field label="Brand" required width={half}>
              <FormInput
                value={brand}
                onChangeText={setBrand}
                placeholder="Enter brand"
                placeholderTextColor="#98A2B3"
              />
            </Field>

            <Field label="Variant / Model" required width={half}>
              <FormInput
                value={variant}
                onChangeText={setVariant}
                placeholder="Enter variant"
                placeholderTextColor="#98A2B3"
              />
            </Field>

            <Field label="Year" required width={half}>
              <FormInput
                value={year}
                onChangeText={(text) =>
                  setYear(text.replace(/[^0-9]/g, ""))
                }
                placeholder="Enter year"
                placeholderTextColor="#98A2B3"
                keyboardType="numeric"
                maxLength={4}
              />
            </Field>

            <Field label="KM Driven" width={half}>
              <FormInput
                value={kmDriven}
                onChangeText={(text) =>
                  setKmDriven(text.replace(/[^0-9]/g, ""))
                }
                placeholder="Enter KM driven"
                placeholderTextColor="#98A2B3"
                keyboardType="numeric"
              />
            </Field>

            <Field
              label="Selling Price"
              required
              width={half}
              hint={pricePreview}
            >
              <FormInput
                value={price}
                onChangeText={(text) =>
                  setPrice(text.replace(/[^0-9]/g, ""))
                }
                placeholder="Enter selling price"
                placeholderTextColor="#98A2B3"
                keyboardType="numeric"
              />
            </Field>

            <Field label="Condition" width={half}>
              <FormInput
                value={condition}
                onChangeText={setCondition}
                placeholder="Used / New"
                placeholderTextColor="#98A2B3"
              />
            </Field>
          </View>
        </View>

        {/* Specifications */}
        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <Text style={styles.sectionTitle}>Specifications</Text>

          <Field label="Fuel Type" width="100%">
            <ChipSelect
              options={FUEL_OPTIONS}
              value={fuelType}
              onChange={setFuelType}
            />
          </Field>

          <Field label="Transmission" width="100%">
            <ChipSelect
              options={TRANSMISSION_OPTIONS}
              value={transmission}
              onChange={setTransmission}
            />
          </Field>

          <Field label="Owner" width="100%">
            <ChipSelect
              options={OWNER_OPTIONS}
              value={owners}
              onChange={setOwners}
            />
          </Field>
        </View>

        {/* Location */}
        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <Text style={styles.sectionTitle}>
            Location<Text style={styles.required}> *</Text>
          </Text>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => {
              setMessage(null);
              setMapVisible(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.locationIconBox}>
              <Text style={styles.locationIcon}>📍</Text>
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationButtonText}>
                {location || "Select Car Location"}
              </Text>

              <Text style={styles.locationButtonHint}>
                Tap to change location
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {hasLocationDetails ? (
            <View style={styles.selectedLocationBox}>
              <Text style={styles.selectedLocationTitle}>
                📍 {selectedLocation.city || "Selected Location"}
              </Text>

              {selectedLocation.state ? (
                <Text style={styles.selectedLocationText}>
                  {selectedLocation.state}
                </Text>
              ) : null}

              {selectedLocation.pincode ? (
                <Text style={styles.selectedLocationText}>
                  PIN: {selectedLocation.pincode}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* Description */}
        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <Text style={styles.sectionTitle}>Description</Text>

          <FormInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell buyers about your vehicle"
            placeholderTextColor="#98A2B3"
            multiline
            numberOfLines={5}
          />
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionBarInner}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setActiveTab("MY LISTINGS")}
            activeOpacity={0.85}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.updateButton, locked && styles.disabledButton]}
            onPress={handleUpdate}
            activeOpacity={0.85}
            disabled={locked}
          >
            <Text style={styles.updateButtonText}>
              {saving ? "Updating..." : "Update Vehicle"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={mapVisible}
        animationType="slide"
        onRequestClose={() =>
          setMapVisible(false)
        }
      >
        <View style={styles.modalContainer}>
          <View style={styles.mapHeader}>
            <View>
              <Text style={styles.mapHeaderTitle}>Select Location</Text>

              <Text style={styles.mapHeaderSubtitle}>
                Tap on the map to select
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                setMapVisible(false)
              }
              style={styles.closeButton}
            >
              <Text style={styles.mapClose}>×</Text>
            </TouchableOpacity>
          </View>

          {mapVisible && message ? (
            <View style={styles.modalMessage}>
              <MessageBanner message={message} />
            </View>
          ) : null}

          {Platform.OS === "web" ? (
            <View style={styles.webMapContainer}>
              <Text style={styles.webMapIcon}>📍</Text>

              <Text style={styles.webMapTitle}>Location Selection</Text>

              <Text style={styles.webMapText}>
                Your vehicle location will be saved using a readable city and
                state.
              </Text>

              <TouchableOpacity
                style={styles.useLocationButton}
                onPress={handleWebLocation}
              >
                <Text style={styles.useLocationButtonText}>
                  Use This Location
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={mapRegion}
              onPress={handleMapPress}
              onRegionChangeComplete={(
                region
              ) =>
                setMapRegion(region)
              }
            >
              {selectedLocation ? (
                <Marker
                  coordinate={{
                    latitude:
                      selectedLocation.latitude,
                    longitude:
                      selectedLocation.longitude,
                  }}
                  title="Vehicle Location"
                  description="Selected vehicle location"
                />
              ) : null}
            </MapView>
          )}

          <View style={styles.mapConfirmContainer}>
            <TouchableOpacity
              style={styles.mapConfirmButton}
              onPress={confirmLocation}
              activeOpacity={0.85}
            >
              <Text style={styles.mapConfirmText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const NAVY = "#0F1C45";
const NAVY_SOFT = "#12224F";
const BLUE = "#2F6FED";
const BORDER = "#E4EAF4";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  container: {
    flex: 1,
  },

  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 28,
    paddingBottom: 40,
  },
  contentMobile: {
    padding: 14,
    paddingTop: 16,
  },

  /* Banner */
  banner: {
    padding: 28,
    borderRadius: 26,
    backgroundColor: NAVY,
    overflow: "hidden",
    marginBottom: 18,
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
    position: "absolute",
    top: -100,
    right: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(47,111,237,0.28)",
  },
  bannerLabel: {
    color: "#76A8FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  titleMobile: {
    fontSize: 25,
  },
  subtitle: {
    fontSize: 14,
    color: "#C9D4EE",
    marginTop: 5,
  },

  /* Message */
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  messageError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCCACA",
  },
  messageSuccess: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF0CC",
  },
  messageIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  messageText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "600",
    lineHeight: 19,
  },
  messageTextError: {
    color: "#B42318",
  },
  messageTextSuccess: {
    color: "#15803D",
  },
  modalMessage: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  /* Cards + fields */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 26,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cardMobile: {
    padding: 18,
    borderRadius: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: NAVY_SOFT,
    marginBottom: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#344054",
    marginBottom: 8,
  },
  required: {
    color: "#E5383B",
  },
  hint: {
    fontSize: 12.5,
    color: BLUE,
    fontWeight: "700",
    marginTop: 6,
  },
  input: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#101B36",
    backgroundColor: "#FAFBFE",
    ...WEB_NO_OUTLINE,
  },
  inputFocused: {
    borderColor: BLUE,
    backgroundColor: "#FFFFFF",
  },
  descriptionInput: {
    height: 130,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: NAVY_SOFT,
    borderColor: NAVY_SOFT,
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: NAVY_SOFT,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },

  /* Location */
  locationButton: {
    minHeight: 74,
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFBFE",
  },
  locationIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  locationIcon: {
    fontSize: 22,
  },
  locationContent: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },
  locationButtonText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#101B36",
  },
  locationButtonHint: {
    fontSize: 12,
    color: "#667085",
    marginTop: 4,
  },
  arrow: {
    fontSize: 28,
    color: "#98A2B3",
    marginLeft: 8,
  },
  selectedLocationBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
  },
  selectedLocationTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: NAVY_SOFT,
  },
  selectedLocationText: {
    fontSize: 12.5,
    color: "#667085",
    marginTop: 4,
  },

  /* Sticky action bar */
  actionBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  actionBarInner: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    maxWidth: 180,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D6DCE8",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: NAVY_SOFT,
    fontSize: 15,
    fontWeight: "700",
  },
  updateButton: {
    flex: 2,
    maxWidth: 280,
    height: 52,
    borderRadius: 14,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  /* Map modal */
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mapHeader: {
    minHeight: 72,
    paddingTop: Platform.OS === "ios" ? 44 : 0,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5EAF2",
  },
  mapHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: NAVY_SOFT,
  },
  mapHeaderSubtitle: {
    fontSize: 12,
    color: "#667085",
    marginTop: 3,
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
  },
  mapClose: {
    fontSize: 27,
    color: "#344054",
    lineHeight: 30,
  },
  map: {
    flex: 1,
  },
  mapConfirmContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 34 : 22,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  mapConfirmButton: {
    width: "100%",
    maxWidth: 520,
    height: 54,
    backgroundColor: BLUE,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  mapConfirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  webMapContainer: {
    flex: 1,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  webMapIcon: {
    fontSize: 50,
    marginBottom: 16,
  },
  webMapTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: NAVY_SOFT,
    textAlign: "center",
    marginBottom: 8,
  },
  webMapText: {
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 340,
    marginBottom: 24,
  },
  useLocationButton: {
    backgroundColor: BLUE,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 13,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },
  useLocationButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  /* Empty */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#F6F8FC",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: BLUE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

export default EditCar;