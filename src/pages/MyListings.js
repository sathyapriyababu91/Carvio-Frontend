import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Share,
  Platform,
  RefreshControl,
} from "react-native";

import * as Location from "expo-location";

import { getToken } from "../utils/authStorage";
import { API_URL } from "../utils/config";

// Alert.alert does nothing on react-native-web, so use window.alert there.
const showAlert = (title, message) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

const MyListings = ({ setActiveTab, openEditCar, onBoostPress }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    fetchMyListings();
  }, []);

  const isCoordinateLocation = (value) => {
    if (!value) return false;

    const parts = String(value).split(",");

    if (parts.length !== 2) return false;

    const latitude = Number(parts[0].trim());
    const longitude = Number(parts[1].trim());

    return (
      !Number.isNaN(latitude) &&
      !Number.isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  };

  const getReadableLocation = async (locationValue) => {
    if (!locationValue) {
      return "Location not available";
    }

    const locationText = String(locationValue).trim();

    if (!isCoordinateLocation(locationText)) {
      return locationText;
    }

    try {
      const parts = locationText.split(",");

      const latitude = Number(parts[0].trim());
      const longitude = Number(parts[1].trim());

      console.log("REVERSE GEOCODING COORDINATES:", latitude, longitude);

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
          throw new Error("Unable to get location details");
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

        if (city && state && city !== state) {
          return `${city}, ${state}`;
        }

        if (city) {
          return city;
        }

        if (state) {
          return state;
        }

        return "Location not available";
      }

      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      console.log("REVERSE GEOCODING RESULT:", result);

      const place = result?.[0];

      if (!place) {
        return "Location not available";
      }

      const city = place.city || place.district || place.subregion || "";

      const state = place.region || place.administrativeArea || "";

      if (city && state && city !== state) {
        return `${city}, ${state}`;
      }

      if (city) {
        return city;
      }

      if (state) {
        return state;
      }

      return "Location not available";
    } catch (error) {
      console.log("LOCATION DISPLAY ERROR:", error);

      return "Location not available";
    }
  };

  const fetchMyListings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = await getToken();

      if (!token) {
        setActiveTab("LOGIN");
        return;
      }

      const response = await fetch(`${API_URL}/car/my-ads`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("MY LISTINGS RESPONSE:", data);

      if (!response.ok) {
        setError(data.message || "Unable to load your listings.");
        return;
      }

      const vehicleListings = data.cars || data.listings || [];

      const formattedListings = await Promise.all(
        vehicleListings.map(async (listing) => {
          console.log("DATABASE LOCATION:", listing.location);

          const readableLocation = await getReadableLocation(
            listing.location
          );

          console.log("DISPLAY LOCATION:", readableLocation);

          return {
            ...listing,
            displayLocation: readableLocation,
          };
        })
      );

      setListings(formattedListings);
    } catch (error) {
      console.log("MY LISTINGS ERROR:", error);

      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusText = (status) => {
    if (status === "ACTIVE") return "Active";
    if (status === "DEACTIVATED") return "Deactivated";
    if (status === "PENDING_PAYMENT") return "Payment Pending";

    return status || "Unknown";
  };

  const getStatusStyle = (status) => {
    if (status === "ACTIVE") {
      return styles.activeStatus;
    }

    if (status === "DEACTIVATED") {
      return styles.deactivatedStatus;
    }

    return styles.pendingStatus;
  };

  const getStatusDotStyle = (status) => {
    if (status === "ACTIVE") {
      return styles.activeDot;
    }

    if (status === "DEACTIVATED") {
      return styles.deactivatedDot;
    }

    return styles.pendingDot;
  };

  const formatPrice = (price) => {
    if (!price) {
      return "₹0";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const getVehicleIcon = (vehicleType) => {
    if (vehicleType === "Two Wheeler") {
      return "🏍️";
    }

    if (vehicleType === "Commercial Vehicle") {
      return "🚚";
    }

    return "🚗";
  };

  
const isBoostActive = (listing) => {
  if (listing.boostStatus !== "ACTIVE") return false;

  if (!listing.boostEndDate) return false;

  return new Date(listing.boostEndDate).getTime() > Date.now();
};

const formatBoostDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const handleBoostPress = (listing, boostType) => {
  if (listing.status !== "ACTIVE") {
    showAlert("Not Available", "Only active listings can be boosted.");
    return;
  }

  if (isBoostActive(listing)) {
    showAlert(
      "Booster Active",
      `Your ad is already boosted until ${formatBoostDate(listing.boostEndDate)}.`
    );
    return;
  }

  if (typeof onBoostPress !== "function") {
    showAlert("Error", "Booster payment navigation is not configured.");
    return;
  }

  onBoostPress({
    carId: listing._id,
    vehicleType: listing.vehicleType,
    boostType,
  });
};


  const handleShare = async (listing) => {
    try {
      const vehicleName =
        listing.title ||
        `${listing.brand || ""} ${listing.modelName || ""}`;

      const message =
        `Check out this ${vehicleName} on CARVIO.\n\n` +
        `Price: ${formatPrice(listing.price)}\n` +
        `Year: ${listing.year || "-"}\n` +
        `KM Driven: ${listing.kmsDriven || "-"} km\n` +
        `Location: ${listing.displayLocation || "India"}`;

      // Browsers without the share sheet: copy the details instead.
      if (
        Platform.OS === "web" &&
        typeof navigator !== "undefined" &&
        typeof navigator.share !== "function"
      ) {
        try {
          await navigator.clipboard.writeText(message);
          showAlert("Copied", "Listing details copied to clipboard.");
        } catch (clipboardError) {
          showAlert("Share", message);
        }

        return;
      }

      await Share.share({ message });
    } catch (error) {
      console.log("SHARE ERROR:", error);
    }
  };

  const deleteListing = async (listingId) => {
    try {
      const token = await getToken();

      if (!token) {
        setActiveTab("LOGIN");
        return;
      }

      const response = await fetch(`${API_URL}/car/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showAlert(
          "Delete Failed",
          data.message || "Unable to delete listing."
        );

        return;
      }

      setListings((current) =>
        current.filter((item) => item._id !== listingId)
      );

      showAlert("Deleted", "Your listing has been deleted successfully.");
    } catch (error) {
      console.log("DELETE LISTING ERROR:", error);

      showAlert("Error", "Unable to connect to server.");
    }
  };

  const handleDelete = (listingId) => {
    const question = "Are you sure you want to delete this listing?";

    if (Platform.OS === "web") {
      if (window.confirm(question)) {
        deleteListing(listingId);
      }

      return;
    }

    Alert.alert("Delete Listing", question, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteListing(listingId),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F6FED" />

        <Text style={styles.loadingText}>Loading your listings...</Text>
      </View>
    );
  }

  const activeCount = listings.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchMyListings(true)}
          colors={["#2F6FED"]}
          tintColor="#2F6FED"
        />
      }
    >
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBox}>
            <Text style={styles.headerIcon}>🚘</Text>
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>My Listings</Text>

            <Text style={styles.subtitle}>Manage your vehicles</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addNewButton}
          onPress={() => setActiveTab("SELL CARS")}
          activeOpacity={0.8}
        >
          <Text style={styles.addNewButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>TOTAL ADS</Text>

          <Text style={styles.statValue}>{listings.length}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ACTIVE</Text>

          <Text style={styles.statValue}>{activeCount}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>INACTIVE</Text>

          <Text style={styles.statValue}>
            {listings.length - activeCount}
          </Text>
        </View>
      </View>

      {error ? (
        <View style={styles.centerCard}>
          <Text style={styles.centerIcon}>⚠️</Text>

          <Text style={styles.centerTitle}>Something went wrong</Text>

          <Text style={styles.centerText}>{error}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => fetchMyListings()}
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.centerCard}>
          <Text style={styles.centerIcon}>🚗</Text>

          <Text style={styles.centerTitle}>No Vehicles Listed</Text>

          <Text style={styles.centerText}>
            You haven't posted any vehicle listings yet.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setActiveTab("SELL CARS")}
          >
            <Text style={styles.primaryButtonText}>Sell a Vehicle →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listingsContainer}>
          {listings.map((listing) => {
            const vehicleImage =
              listing.images &&
              listing.images.length > 0 &&
              !failedImages[listing._id]
                ? listing.images[0]
                : null;

            const vehicleName =
              (
                listing.title ||
                `${listing.brand || ""} ${listing.modelName || ""}`
              ).trim() || "Vehicle";

            return (
              <View key={listing._id} style={styles.listingCard}>
                <View style={styles.imageContainer}>
                  {vehicleImage ? (
                    <Image
                      source={{
                        uri: vehicleImage,
                      }}
                      style={styles.vehicleImage}
                      resizeMode="cover"
                      onError={() =>
                        setFailedImages((previous) => ({
                          ...previous,
                          [listing._id]: true,
                        }))
                      }
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderIcon}>
                        {getVehicleIcon(listing.vehicleType)}
                      </Text>

                      <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.statusBadge,
                      getStatusStyle(listing.status),
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        getStatusDotStyle(listing.status),
                      ]}
                    />

                    <Text style={styles.statusText}>
                      {getStatusText(listing.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.vehicleNameContainer}>
                      <Text style={styles.vehicleTitle} numberOfLines={1}>
                        {vehicleName}
                      </Text>

                      <Text style={styles.vehicleType}>
                        {listing.vehicleType || "Car"}
                      </Text>
                    </View>

                    <Text style={styles.priceText}>
                      {formatPrice(listing.price)}
                    </Text>
                  </View>

                  <View style={styles.specificationsRow}>
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>YEAR</Text>

                      <Text style={styles.specVal}>
                        {listing.year || "-"}
                      </Text>
                    </View>

                    <View style={styles.specDivider} />

                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>KM DRIVEN</Text>

                      <Text style={styles.specVal}>
                        {listing.kmsDriven
                          ? `${Number(listing.kmsDriven).toLocaleString(
                              "en-IN"
                            )} km`
                          : "-"}
                      </Text>
                    </View>

                    <View style={styles.specDivider} />

                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>CONDITION</Text>

                      <Text style={styles.specVal} numberOfLines={1}>
                        {listing.condition
                          ? listing.condition.replace(" Car", "")
                          : "-"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationContainer}>
                    <View style={styles.locationIconBox}>
                      <Text style={styles.locationIcon}>📍</Text>
                    </View>

                    <View style={styles.locationTextContainer}>
                      <Text style={styles.locationLabel}>LOCATION</Text>

                      <Text style={styles.locationText} numberOfLines={1}>
                        {listing.displayLocation || "Location not available"}
                      </Text>
                    </View>
                  </View>
                  
{listing.status === "ACTIVE" && (
  <View style={styles.boosterContainer}>
    {isBoostActive(listing) ? (
      <View style={styles.boostActiveBox}>
        <Text style={styles.boostActiveTitle}>
          🚀 BOOST ACTIVE
        </Text>

        <Text style={styles.boostActiveText}>
          Your ad is boosted until {formatBoostDate(listing.boostEndDate)}
        </Text>
      </View>
    ) : (
      <>
        <Text style={styles.boosterTitle}>🚀 Boost Your Ad</Text>

        <Text style={styles.boosterSubtitle}>
          Get better visibility for your vehicle listing.
        </Text>

        <View style={styles.boosterButtons}>
          <TouchableOpacity
            style={styles.boosterButton}
            onPress={() => handleBoostPress(listing, "15_DAYS")}
            activeOpacity={0.8}
          >
            <Text style={styles.boosterDays}>15 DAYS</Text>
            <Text style={styles.boosterPrice}>₹250</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.boosterButtonPremium}
            onPress={() => handleBoostPress(listing, "30_DAYS")}
            activeOpacity={0.8}
          >
            <Text style={styles.boosterDaysPremium}>30 DAYS</Text>
            <Text style={styles.boosterPricePremium}>₹500</Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </View>
)}


                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => openEditCar?.(listing)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.editBtnText}>✏️ Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.shareBtn}
                      onPress={() => handleShare(listing)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.shareBtnText}>↗ Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(listing._id)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Delete listing"
                    >
                      <Text style={styles.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setActiveTab("MY ACCOUNT")}
      >
        <Text style={styles.backButtonText}>← Back to My Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },

  content: {
    padding: 14,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
  },

  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5EAF2",
    shadowColor: "#12224F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  headerIcon: {
    fontSize: 24,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#12224F",
  },

  subtitle: {
    fontSize: 12,
    color: "#667085",
    marginTop: 3,
  },

  addNewButton: {
    minHeight: 44,
    backgroundColor: "#2F6FED",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 12,
  },

  addNewButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  statsCard: {
    backgroundColor: "#12224F",
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    fontSize: 9,
    color: "#AEBBD5",
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  statValue: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "800",
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#33436A",
  },

  listingsContainer: {
    width: "100%",
  },

  listingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#12224F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1.55,
    backgroundColor: "#EEF2F7",
    position: "relative",
  },

  vehicleImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderIcon: {
    fontSize: 48,
  },

  placeholderText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 7,
    fontWeight: "600",
  },

  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  activeStatus: {
    backgroundColor: "#DCFCE7",
  },

  deactivatedStatus: {
    backgroundColor: "#FEE2E2",
  },

  pendingStatus: {
    backgroundColor: "#FEF3C7",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  activeDot: {
    backgroundColor: "#16A34A",
  },

  deactivatedDot: {
    backgroundColor: "#DC2626",
  },

  pendingDot: {
    backgroundColor: "#D97706",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1E293B",
  },

  cardContent: {
    padding: 16,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  vehicleNameContainer: {
    flex: 1,
    paddingRight: 10,
  },

  vehicleTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#101B36",
  },

  vehicleType: {
    fontSize: 12,
    color: "#667085",
    marginTop: 4,
    fontWeight: "600",
  },

  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2F6FED",
  },

  specificationsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 14,
  },

  specItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },

  specLabel: {
    fontSize: 8,
    color: "#94A3B8",
    fontWeight: "800",
  },

  specVal: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "700",
    marginTop: 4,
  },

  specDivider: {
    width: 1,
    height: 25,
    backgroundColor: "#E2E8F0",
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
  },

  locationIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  locationIcon: {
    fontSize: 16,
  },

  locationTextContainer: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },

  locationText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
    marginTop: 2,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 8,
  },

  editBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EEF4FF",
    borderWidth: 1,
    borderColor: "#DCE7FF",
    justifyContent: "center",
    alignItems: "center",
  },

  editBtnText: {
    fontSize: 13,
    color: "#2F6FED",
    fontWeight: "800",
  },

  shareBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },

  shareBtnText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "800",
  },

  deleteBtn: {
    width: 52,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteBtnText: {
    fontSize: 16,
  },

  centerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 35,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  centerIcon: {
    fontSize: 45,
  },

  centerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#12224F",
    marginTop: 12,
  },

  centerText: {
    fontSize: 13,
    color: "#667085",
    textAlign: "center",
    marginTop: 7,
    marginBottom: 20,
    lineHeight: 20,
  },

  primaryButton: {
    minHeight: 46,
    backgroundColor: "#2F6FED",
    paddingHorizontal: 22,
    justifyContent: "center",
    borderRadius: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FC",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#667085",
  },

  backButton: {
    alignItems: "center",
    padding: 15,
    marginTop: 4,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2F6FED",
  },
  
boosterContainer: {
  marginTop: 14,
  padding: 14,
  backgroundColor: "#F4F7FF",
  borderRadius: 15,
  borderWidth: 1,
  borderColor: "#DCE7FF",
},

boosterTitle: {
  fontSize: 15,
  fontWeight: "800",
  color: "#12224F",
},

boosterSubtitle: {
  fontSize: 11,
  color: "#667085",
  marginTop: 5,
},

boosterButtons: {
  flexDirection: "row",
  gap: 10,
  marginTop: 12,
},

boosterButton: {
  flex: 1,
  minHeight: 65,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#2F6FED",
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
},

boosterButtonPremium: {
  flex: 1,
  minHeight: 65,
  backgroundColor: "#12224F",
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
},

boosterDays: {
  fontSize: 11,
  fontWeight: "800",
  color: "#2F6FED",
},

boosterPrice: {
  fontSize: 18,
  fontWeight: "800",
  color: "#12224F",
  marginTop: 3,
},

boosterDaysPremium: {
  fontSize: 11,
  fontWeight: "800",
  color: "#AFC8FF",
},

boosterPricePremium: {
  fontSize: 18,
  fontWeight: "800",
  color: "#FFFFFF",
  marginTop: 3,
},

boostActiveBox: {
  backgroundColor: "#E8F8EF",
  borderRadius: 12,
  padding: 13,
},

boostActiveTitle: {
  fontSize: 14,
  fontWeight: "800",
  color: "#15803D",
},

boostActiveText: {
  fontSize: 12,
  color: "#166534",
  marginTop: 5,
},

});

export default MyListings;