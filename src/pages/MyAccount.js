import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { getUser, clearAuth } from "../utils/authStorage";

const profileItems = [
  {
    icon: "👤",
    title: "My Profile",
    subtitle: "View your personal details",
    tab: "MY PROFILE",
  },
  {
    icon: "✏️",
    title: "Edit Profile",
    subtitle: "Update your name, phone and address",
    tab: "EDIT PROFILE",
  },
  {
    icon: "🔐",
    title: "Change Password",
    subtitle: "Update your account password",
    tab: "CHANGE PASSWORD",
  },
];

const activityItems = [
  {
    icon: "🚗",
    title: "My Listings",
    subtitle: "View vehicles you have listed for sale",
    tab: "MY LISTINGS",
  },
  {
    icon: "❤️",
    title: "Favourites",
    subtitle: "Vehicles you have saved",
    tab: "FAVOURITES",
  },
  {
    icon: "💳",
    title: "Payment History",
    subtitle: "View your listing payments",
    tab: "PAYMENT HISTORY",
  },
];

const supportItems = [
  {
    icon: "✉️",
    title: "Messages",
    subtitle: "Chats with buyers and sellers",
    tab: "MESSAGES",
  },
  {
    icon: "❔",
    title: "Help & Support",
    subtitle: "Get help with your account",
    tab: "HELP & SUPPORT",
  },
];

const quickActions = [
  { icon: "🚗", label: "My Listings", tab: "MY LISTINGS" },
  { icon: "❤️", label: "Favourites", tab: "FAVOURITES" },
  { icon: "✏️", label: "Edit Profile", tab: "EDIT PROFILE" },
  { icon: "💳", label: "Payments", tab: "PAYMENT HISTORY" },
];

const MenuGroup = ({ title, items, onSelect }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>

    {items.map((item, index) => (
      <TouchableOpacity
        key={item.tab}
        style={[
          styles.menuItem,
          index === items.length - 1 && styles.menuItemLast,
        ]}
        onPress={() => onSelect(item.tab)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View style={styles.menuIconBox}>
          <Text style={styles.menuIcon}>{item.icon}</Text>
        </View>

        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const MyAccount = ({ setActiveTab }) => {
  const { width } = useWindowDimensions();

  const [user, setUser] = useState(null);

  const isMobile = width < 768;
  const isSmall = width < 390;

  const go = (tab) => setActiveTab?.(tab);

  // Clear the saved token/user first, otherwise the app thinks the
  // user is still logged in and opens HOME again after a refresh.
  const handleLogout = async () => {
    try {
      await clearAuth();
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    } finally {
      go("LOGIN");
    }
  };

  // Show the logged-in user's name in the banner.
  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const savedUser = await getUser();

        if (active) {
          setUser(savedUser || null);
        }
      } catch (error) {
        console.log("MY ACCOUNT USER ERROR:", error);
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const initial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "";

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.content,
          isMobile && {
            paddingHorizontal: isSmall ? 14 : 16,
            paddingTop: 16,
          },
        ]}
      >
        {/* HEADER BANNER */}
        <View style={[styles.banner, isMobile && styles.bannerMobile]}>
          <View pointerEvents="none" style={styles.bannerGlow} />

          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>
              {initial || "👤"}
            </Text>
          </View>

          <View style={styles.bannerText}>
            <Text style={styles.bannerLabel}>CARVIO ACCOUNT</Text>

            <Text
              style={[styles.title, isMobile && styles.titleMobile]}
              numberOfLines={1}
            >
              {user?.name || "My Account"}
            </Text>

            <Text style={styles.subtitle} numberOfLines={1}>
              {user?.email ||
                user?.phone ||
                "Manage your account and listings"}
            </Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.tab}
              style={[
                styles.quickTile,
                { width: isMobile ? "48.5%" : "23.8%" },
              ]}
              onPress={() => go(action.tab)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <View style={styles.quickIconBox}>
                <Text style={styles.quickIcon}>{action.icon}</Text>
              </View>

              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MENU GROUPS */}
        <View style={[styles.groupsRow, isMobile && styles.groupsRowMobile]}>
          <View style={styles.groupCol}>
            <MenuGroup title="Profile" items={profileItems} onSelect={go} />
          </View>

          <View style={styles.groupCol}>
            <MenuGroup title="My Activity" items={activityItems} onSelect={go} />
          </View>
        </View>

        <View style={styles.supportGroup}>
          <MenuGroup title="Messages & Help" items={supportItems} onSelect={go} />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[styles.logoutButton, isMobile && styles.logoutButtonMobile]}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const NAVY = "#0F1C45";
const NAVY_SOFT = "#12224F";
const BLUE = "#2F6FED";
const BORDER = "#E4EAF4";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  content: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 60,
  },

  /* Banner */
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 32,
    borderRadius: 26,
    backgroundColor: NAVY,
    overflow: "hidden",
    marginBottom: 22,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  bannerMobile: {
    padding: 20,
    borderRadius: 22,
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
  profileIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: BLUE,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  profileIconText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bannerText: {
    flex: 1,
    minWidth: 0,
  },
  bannerLabel: {
    color: "#76A8FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  titleMobile: {
    fontSize: 26,
  },
  subtitle: {
    fontSize: 14.5,
    color: "#C9D4EE",
    marginTop: 4,
  },

  /* Quick actions */
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 22,
  },
  quickTile: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  quickIconBox: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickIcon: {
    fontSize: 24,
  },
  quickLabel: {
    fontSize: 13.5,
    fontWeight: "700",
    color: NAVY_SOFT,
  },

  /* Menu groups */
  groupsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
  },
  groupsRowMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 16,
  },
  groupCol: {
    flex: 1,
    minWidth: 0,
  },
  supportGroup: {
    marginTop: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: NAVY_SOFT,
    marginBottom: 6,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F8",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuIcon: {
    fontSize: 21,
  },
  menuTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#101B36",
  },
  menuSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#6B7A99",
    marginTop: 3,
  },
  arrow: {
    fontSize: 28,
    color: "#9CA3AF",
    marginLeft: 10,
  },

  /* Logout */
  logoutButton: {
    alignSelf: "flex-end",
    minWidth: 180,
    height: 54,
    paddingHorizontal: 26,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#F3C7C7",
    backgroundColor: "#FFF5F5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  logoutButtonMobile: {
    alignSelf: "stretch",
    minWidth: 0,
  },
  logoutIcon: {
    fontSize: 19,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#D32F2F",
  },
});

export default MyAccount;