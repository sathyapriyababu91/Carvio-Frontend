import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert,
  useWindowDimensions,
} from "react-native";

import {
  styles,
  getResponsiveStyles,
} from "../styles/CarDetails.styles";

import ChatScreen from "./ChatScreen";

import {
  getToken,
  getUserId,
} from "../utils/authStorage";

const formatPrice = (value) => {
  const number = Number(value);

  if (!value || Number.isNaN(number)) {
    return "Price on request";
  }

  return `₹${number.toLocaleString("en-IN")}`;
};

const formatKm = (value) => {
  const number = Number(value);

  if (value === "" || value === undefined || value === null) {
    return "—";
  }

  if (Number.isNaN(number)) {
    return String(value);
  }

  return `${number.toLocaleString("en-IN")} km`;
};

export default function CarDetails({
  car,
  onBack,
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const { width } = useWindowDimensions();
  const r = getResponsiveStyles(width);
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  if (!car) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🚗</Text>

        <Text style={styles.emptyTitle}>
          Car details not found
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>
            ← Back to Cars
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get seller ID safely
  const sellerId =
    typeof car.seller === "object"
      ? car.seller?._id
      : car.seller;

  // Open Chat Screen
  if (showChat) {
    return (
      <ChatScreen
        car={car}
        sellerId={sellerId}
        onBack={() => setShowChat(false)}
      />
    );
  }

  const carImages =
    car.images?.length
      ? car.images
      : car.image
      ? [car.image]
      : [];

  const carName = car.name || car.title || "Vehicle";
  const carVariant = car.variant || car.modelName || "";
  const carYear = car.year || "";
  const carFuel = car.fuel || car.fuelType || "";
  const carTransmission = car.transmission || "";
  const carKm = car.km || car.kmsDriven || "";
  const carOwner = car.owners || car.ownerType || "";
  const carPrice = car.price || "";
  const carLocation = car.location || "";

  const showPrevImage = () =>
    setSelectedImage(
      (selectedImage - 1 + carImages.length) % carImages.length
    );

  const showNextImage = () =>
    setSelectedImage((selectedImage + 1) % carImages.length);

  const shareCar = async () => {
    try {
      await Share.share({
        message:
          `🚗 ${carName} ${carVariant}\n\n` +
          `💰 Price: ₹${Number(carPrice).toLocaleString("en-IN")}\n` +
          `📅 Year: ${carYear}\n` +
          `⛽ Fuel: ${carFuel}\n` +
          `⚙️ Transmission: ${carTransmission}\n` +
          `🛣️ KM: ${carKm}\n` +
          `👤 ${carOwner}\n` +
          `📍 Location: ${carLocation}\n\n` +
          `View this vehicle on CARVIO - PREMIUM AUTO MARKET`,
      });
    } catch (error) {
      console.log("SHARE ERROR:", error);
    }
  };

  const handleChatWithSeller = async () => {
    console.log("CHAT BUTTON CLICKED");

    try {
      const token = await getToken();
      const userId = await getUserId();

      console.log("CHAT TOKEN EXISTS:", !!token);
      console.log("CHAT USER ID:", userId);
      console.log("CHAT SELLER ID:", sellerId);

      if (!token || !userId) {
        Alert.alert(
          "Login Required",
          "Please login to chat with the seller."
        );
        return;
      }

      if (!sellerId) {
        Alert.alert(
          "Seller unavailable",
          "Seller information is not available for this vehicle."
        );
        return;
      }

      if (String(userId) === String(sellerId)) {
        Alert.alert(
          "Your Listing",
          "You cannot chat with yourself about your own listing."
        );
        return;
      }

      setShowChat(true);
    } catch (error) {
      console.log("CHAT BUTTON ERROR:", error);
    }
  };

  const overviewItems = [
    { icon: "📅", label: "Year", value: carYear || "—" },
    { icon: "🛣️", label: "KM Driven", value: formatKm(carKm) },
    { icon: "⛽", label: "Fuel Type", value: carFuel || "—" },
    { icon: "⚙️", label: "Transmission", value: carTransmission || "—" },
    { icon: "👤", label: "Owner", value: carOwner || "—" },
    { icon: "📍", label: "Location", value: carLocation || "—" },
  ];

  const quickChips = [
    carYear,
    carFuel,
    carTransmission,
    carKm ? formatKm(carKm) : "",
  ].filter(Boolean);

  /* ---------------- Sections ---------------- */

  const gallery = (
    <View>
      <View style={[styles.gallery, r.gallery]}>
        {carImages.length > 0 ? (
          <>
            <Image
              source={{ uri: carImages[selectedImage] }}
              style={styles.mainImage}
              resizeMode="cover"
            />

            <View style={styles.usedBadge}>
              <Text style={styles.usedBadgeText}>USED VEHICLE</Text>
            </View>

            {carImages.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.arrowButton, styles.arrowLeft, r.arrowButton]}
                  onPress={showPrevImage}
                  activeOpacity={0.85}
                >
                  <Text style={styles.arrowText}>‹</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.arrowButton, styles.arrowRight, r.arrowButton]}
                  onPress={showNextImage}
                  activeOpacity={0.85}
                >
                  <Text style={styles.arrowText}>›</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImage + 1} / {carImages.length}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🚗</Text>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
      </View>

      {carImages.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailContainer}
          style={{ marginTop: 12 }}
        >
          {carImages.map((image, index) => (
            <TouchableOpacity
              key={`${image}-${index}`}
              style={[
                styles.thumbnailButton,
                r.thumbnailButton,
                selectedImage === index && styles.thumbnailButtonActive,
              ]}
              onPress={() => setSelectedImage(index)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: image }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const summary = (
    <View style={[styles.card, r.card]}>
      <Text style={[styles.carTitle, r.carTitle]}>{carName}</Text>

      {carVariant ? (
        <Text style={styles.variant}>{carVariant}</Text>
      ) : null}

      <Text style={[styles.price, r.price]}>{formatPrice(carPrice)}</Text>
      <Text style={styles.priceNote}>Other charges may apply</Text>

      {quickChips.length > 0 && (
        <View style={styles.chipRow}>
          {quickChips.map((chip) => (
            <View key={chip} style={styles.specChip}>
              <Text style={styles.specChipText}>{chip}</Text>
            </View>
          ))}
        </View>
      )}

      {carLocation ? (
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{carLocation}</Text>
        </View>
      ) : null}

      {!isMobile && (
        <>
          <TouchableOpacity
            style={styles.chatButton}
            activeOpacity={0.85}
            onPress={handleChatWithSeller}
          >
            <Text style={styles.chatButtonText}>💬 Chat with Seller</Text>
          </TouchableOpacity>

          <Text style={styles.chatHint}>
            Interested in this vehicle? Chat with the seller for more
            information.
          </Text>
        </>
      )}
    </View>
  );

  const overview = (
    <View style={[styles.card, r.card]}>
      <Text style={styles.sectionTitle}>Vehicle Overview</Text>

      <View style={styles.overviewGrid}>
        {overviewItems.map((item) => (
          <View key={item.label} style={[styles.overviewItem, r.overviewItem]}>
            <Text style={styles.overviewIcon}>{item.icon}</Text>
            <Text style={styles.overviewLabel}>{item.label}</Text>
            <Text style={styles.overviewValue} numberOfLines={2}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const seller = (
    <View style={[styles.card, r.card]}>
      <Text style={styles.sectionTitle}>Seller Information</Text>

      <View style={styles.sellerRow}>
        <View style={styles.sellerAvatar}>
          <Text style={styles.sellerAvatarText}>👤</Text>
        </View>

        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>CARVIO Seller</Text>

          {carLocation ? (
            <Text style={styles.sellerLocation}>📍 {carLocation}</Text>
          ) : null}

          <Text style={styles.verifiedText}>✓ Verified Seller</Text>
        </View>
      </View>
    </View>
  );

  const about = (
    <View style={[styles.card, r.card]}>
      <Text style={styles.sectionTitle}>About This Vehicle</Text>

      <Text style={styles.description}>
        {car.description ||
          `This ${carName} is available for sale on CARVIO. Check the vehicle details, pricing, location and seller information before contacting the seller.`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, r.contentContainer]}
      >
        <View style={[styles.inner, r.inner]}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backIconButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <Text style={styles.topBarTitle}>Vehicle Details</Text>

            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.topActionButton}
                onPress={() => setIsFavourite(!isFavourite)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.topActionIcon,
                    isFavourite && styles.topActionIconActive,
                  ]}
                >
                  {isFavourite ? "♥" : "♡"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.topActionButton}
                onPress={shareCar}
                activeOpacity={0.8}
              >
                <Text style={styles.topActionIcon}>↗</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Body */}
          {isDesktop ? (
            <View style={[styles.mainRow, r.mainRow]}>
              <View style={[styles.leftCol, r.leftCol]}>
                {gallery}
                {overview}
                {about}
                {seller}
              </View>

              <View style={[styles.rightCol, r.rightCol]}>{summary}</View>
            </View>
          ) : (
            <View style={[styles.mainRow, r.mainRow]}>
              <View style={[styles.leftCol, r.leftCol]}>
                {gallery}
                {summary}
                {overview}
                {seller}
                {about}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.bottomBackButton}
            onPress={onBack}
            activeOpacity={0.85}
          >
            <Text style={styles.bottomBackButtonText}>← Back to Cars</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky price + chat bar on mobile */}
      {isMobile && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomBarPriceLabel}>Price</Text>
            <Text style={styles.bottomBarPrice}>{formatPrice(carPrice)}</Text>
          </View>

          <TouchableOpacity
            style={styles.bottomBarButton}
            activeOpacity={0.85}
            onPress={handleChatWithSeller}
          >
            <Text style={styles.bottomBarButtonText}>💬 Chat with Seller</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}