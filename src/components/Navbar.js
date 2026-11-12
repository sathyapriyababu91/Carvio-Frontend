import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  Image,
  TextInput,
  useWindowDimensions,
} from 'react-native';

import { styles } from '../styles/Navbar.styles';
import { getToken, getUser } from '../utils/authStorage';
import { API_URL } from '../utils/config';

const NAV_ITEMS = [
  { label: 'HOME', icon: '⌂' },
  { label: 'ABOUT', icon: '◈' },
  { label: 'BUY CARS', icon: '🚘' },
  { label: 'SELL CARS', icon: '＋' },
  { label: 'SERVICES', icon: '⚙' },
  { label: 'MESSAGES', icon: '✉' },
  { label: 'MY ACCOUNT', icon: '♙' },
  { label: 'HELP & SUPPORT', icon: '❔' },
];

// Phone bottom tab bar (OLX style): Home, Chat, Sell, My Ads, Account.
// "label" is the activeTab value used by the parent screen.
const BOTTOM_TABS = [
  { label: 'HOME', title: 'Home', icon: '⌂' },
  { label: 'MESSAGES', title: 'Chat', icon: '💬' },
  { label: 'SELL CARS', title: 'Sell', icon: '＋', center: true },
  { label: 'MY LISTINGS', title: 'My Ads', icon: '▤' },
  { label: 'MY ACCOUNT', title: 'Account', icon: '👤' },
];

// Refresh quickly so the badge clears soon after a chat is read.
const UNREAD_REFRESH_MS = 5000;

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isCompactMobile = width < 390;
  const isWide = width >= 1340;

  const menuAnimation = useRef(new Animated.Value(0)).current;
  const enterAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  const navLayouts = useRef({}).current;
  const indLeft = useRef(new Animated.Value(0)).current;
  const indWidth = useRef(new Animated.Value(0)).current;
  const indOpacity = useRef(new Animated.Value(0)).current;

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const isAuthPage =
    activeTab === 'LOGIN' || activeTab === 'REGISTER';

  const showSearch = !isAuthPage;

  // On phones the announcement strip only shows on Home, so the other
  // pages get more room.
  const showAnnBar = !isMobile || activeTab === 'HOME';

  // Works with the parent's search state, or on its own if none is passed.
  const query = searchQuery !== undefined ? searchQuery : localQuery;
  const updateQuery = setSearchQuery || setLocalQuery;

  const isLoggedIn = Boolean(user);

  // Close the menu whenever the screen changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;

    const refreshUser = async () => {
      try {
        const loggedInUser = await getUser();

        if (isMounted) {
          setUser(loggedInUser || null);
        }
      } catch (error) {
        console.log('NAVBAR USER ERROR:', error);

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setUserLoaded(true);
        }
      }
    };

    refreshUser();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Unread message count for the badge (summed from the chat list).
  const loadUnread = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        if (mountedRef.current) setUnreadCount(0);
        return;
      }

      const response = await fetch(`${API_URL}/chat/my-chats`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();

      const total = (data.chats || []).reduce(
        (sum, chat) => sum + (chat.unreadCount || 0),
        0
      );

      if (mountedRef.current) setUnreadCount(total);
    } catch (error) {
      // Badge is optional; ignore network errors.
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return undefined;
    }

    loadUnread();

    const intervalId = setInterval(loadUnread, UNREAD_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, activeTab, loadUnread]);

  useEffect(() => {
    const animation = Animated.timing(enterAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [enterAnimation]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => loop.stop();
  }, [pulseAnimation]);

  // Open: mount the menu, then spring it in.
  // Close: fade it out, then unmount it.
  useEffect(() => {
    if (menuOpen) {
      setMenuVisible(true);

      Animated.spring(menuAnimation, {
        toValue: 1,
        friction: 8,
        tension: 75,
        useNativeDriver: true,
      }).start();

      return;
    }

    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && mountedRef.current) {
        setMenuVisible(false);
      }
    });
  }, [menuOpen, menuAnimation]);

  useEffect(() => {
    if (!isMobile && !isAuthPage) {
      moveIndicator(activeTab, true);
    } else {
      indOpacity.setValue(0);
    }
  }, [activeTab, isWide, isMobile, isAuthPage]);

  const moveIndicator = (label, animate = true) => {
    const layout = navLayouts[label];

    if (!layout) {
      Animated.timing(indOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();

      return;
    }

    if (animate) {
      Animated.parallel([
        Animated.spring(indLeft, {
          toValue: layout.x,
          friction: 9,
          tension: 90,
          useNativeDriver: false,
        }),
        Animated.spring(indWidth, {
          toValue: layout.width,
          friction: 9,
          tension: 90,
          useNativeDriver: false,
        }),
        Animated.timing(indOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      indLeft.setValue(layout.x);
      indWidth.setValue(layout.width);
      indOpacity.setValue(1);
    }
  };

  const handleNavigation = (item) => {
    const requiresLogin =
      item.label === 'MY ACCOUNT' ||
      item.label === 'MESSAGES' ||
      item.label === 'MY LISTINGS';

    if (requiresLogin && !user) {
      setActiveTab('LOGIN');
    } else {
      setActiveTab(item.label);
    }

    setMenuOpen(false);
  };

  const handleBrandPress = () => {
    setActiveTab('HOME');
    setMenuOpen(false);
  };

  const handleLoginPress = () => {
    setActiveTab('LOGIN');
    setMenuOpen(false);
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();

    const trimmed = (query || '').trim();

    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
    } else {
      setActiveTab('BUY CARS');
    }

    setMenuOpen(false);
  };

  const pulseRingStyle = (from, to) => ({
    opacity: pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.55, 0],
    }),
    transform: [
      {
        scale: pulseAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [from, to],
        }),
      },
    ],
  });

  const unreadLabel = unreadCount > 9 ? '9+' : String(unreadCount);

  const renderNavItem = (item) => {
    const isActive = activeTab === item.label;

    return (
      <Pressable
        key={item.label}
        onLayout={(event) => {
          const { x, width: itemWidth } = event.nativeEvent.layout;

          navLayouts[item.label] = {
            x,
            width: itemWidth,
          };

          if (item.label === activeTab) {
            moveIndicator(item.label, false);
          }
        }}
        style={({ hovered, pressed }) => [
          styles.navItem,
          isMobile && styles.mobileNavItem,
          hovered && !isActive && styles.navItemHover,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => handleNavigation(item)}
      >
        <View
          style={[
            styles.navItemInner,
            isWide && styles.navItemInnerWide,
            isActive && styles.navItemInnerActive,
          ]}
        >
          {!isWide && (
            <Text
              style={[
                styles.navIcon,
                isActive && styles.navIconActive,
              ]}
            >
              {item.icon}
            </Text>
          )}

          <Text
            style={[
              styles.navText,
              isActive && styles.activeNavText,
            ]}
          >
            {item.label}
          </Text>
        </View>

        {item.label === 'MESSAGES' && isLoggedIn && unreadCount > 0 && (
          <View style={styles.navBadge} pointerEvents="none">
            <Text style={styles.navBadgeText}>{unreadLabel}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const renderNavLinks = () => (
    <View style={styles.navTrack}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.navIndicator,
          {
            left: indLeft,
            width: indWidth,
            opacity: indOpacity,
          },
        ]}
      />

      {NAV_ITEMS.map(renderNavItem)}
    </View>
  );

  const renderMobileMenuItem = (item, index) => {
    const isActive = activeTab === item.label;

    const start = Math.min(index * 0.07, 0.5);
    const end = Math.min(start + 0.5, 1);

    const itemStyle = {
      opacity: menuAnimation.interpolate({
        inputRange: [start, end],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateX: menuAnimation.interpolate({
            inputRange: [start, end],
            outputRange: [-18, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    return (
      <Animated.View
        key={item.label}
        style={itemStyle}
      >
        <TouchableOpacity
          onPress={() => handleNavigation(item)}
          activeOpacity={0.7}
          style={[
            styles.mobileItem,
            isActive && styles.mobileItemActive,
          ]}
        >
          <View
            style={[
              styles.mobileItemIconBox,
              isActive && styles.mobileItemIconBoxActive,
            ]}
          >
            <Text
              style={[
                styles.mobileItemIcon,
                isActive && { color: '#2F6FED' },
              ]}
            >
              {item.icon}
            </Text>
          </View>

          <Text
            style={[
              styles.mobileItemLabel,
              isActive && styles.mobileItemLabelActive,
            ]}
          >
            {item.label}
          </Text>

          {item.label === 'MESSAGES' &&
            isLoggedIn &&
            unreadCount > 0 && (
              <View style={styles.mobileItemBadge}>
                <Text style={styles.mobileItemBadgeText}>
                  {unreadLabel}
                </Text>
              </View>
            )}

          {isActive && (
            <Text style={styles.mobileItemArrow}>
              ›
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // OLX-style bottom tab bar (phones only).
  const renderBottomTab = (tab) => {
    const isActive = activeTab === tab.label;

    if (tab.center) {
      return (
        <View key={tab.label} style={styles.bottomTabCenter}>
          <Pressable
            onPress={() => handleNavigation(tab)}
            style={({ pressed }) => [
              styles.bottomSellButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sell your vehicle"
          >
            <Text style={styles.bottomSellPlus}>+</Text>
          </Pressable>

          <Text
            style={[
              styles.bottomLabel,
              styles.bottomSellLabel,
              isActive && styles.bottomLabelActive,
            ]}
          >
            {tab.title}
          </Text>
        </View>
      );
    }

    return (
      <Pressable
        key={tab.label}
        onPress={() => handleNavigation(tab)}
        style={({ pressed }) => [
          styles.bottomTab,
          pressed && { opacity: 0.7 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={tab.title}
        accessibilityState={{ selected: isActive }}
      >
        <View
          style={[
            styles.bottomIconWrap,
            isActive && styles.bottomIconWrapActive,
          ]}
        >
          <Text
            style={[
              styles.bottomIcon,
              isActive && styles.bottomIconActive,
            ]}
          >
            {tab.icon}
          </Text>

          {tab.label === 'MESSAGES' && isLoggedIn && unreadCount > 0 && (
            <View style={styles.bottomBadge} pointerEvents="none">
              <Text style={styles.bottomBadgeText}>{unreadLabel}</Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.bottomLabel,
            isActive && styles.bottomLabelActive,
          ]}
        >
          {tab.title}
        </Text>
      </Pressable>
    );
  };

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 0],
  });

  const enterTranslateY = enterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 0],
  });

  const renderSearch = (compact = false) => (
    <View
      style={[
        styles.searchContainer,
        isMobile && styles.mobileSearchContainer,
        isWide && styles.searchContainerWide,
        searchFocused && styles.searchContainerFocused,
        compact && styles.compactSearch,
      ]}
    >
      <Text style={styles.searchIcon}>⌕</Text>

      <TextInput
        style={styles.searchInput}
        placeholder={
          isMobile
            ? 'Search cars...'
            : isWide
              ? 'Search cars, brands...'
              : 'Search cars, bikes, brands or models'
        }
        placeholderTextColor="#98A2B3"
        value={query}
        onChangeText={updateQuery}
        onSubmitEditing={handleSearchSubmit}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        returnKeyType="search"
        accessibilityLabel="Search cars, bikes, brands or models"
      />

      {query.length > 0 && (
        <TouchableOpacity
          onPress={() => updateQuery('')}
          style={styles.clearButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      )}

      {!isMobile && !isWide && query.length === 0 && (
        <View style={styles.searchShortcut}>
          <Text style={styles.searchShortcutText}>
            SEARCH
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Animated.View
        style={[
          styles.mainContainer,
          isMobile && styles.mobileMainContainer,
          {
            zIndex: 100,
            opacity: enterAnimation,
            transform: [{ translateY: enterTranslateY }],
          },
        ]}
      >
        {showAnnBar && (
          <View style={styles.annBar}>
            <View
              style={[
                styles.annInner,
                isMobile && styles.annInnerMobile,
              ]}
            >
              <View style={styles.annLeft}>
                <View style={styles.annDotWrap}>
                  <Animated.View
                    style={[
                      styles.annDotRing,
                      pulseRingStyle(1, 2.4),
                    ]}
                  />

                  <View style={styles.annDot} />
                </View>

                <Text
                  style={styles.annText}
                  numberOfLines={1}
                >
                  <Text style={styles.annTextStrong}>
                    Buy smarter. Sell faster.
                  </Text>

                  {!isMobile
                    ? "  ·  India's premium auto marketplace"
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View
          style={[
            styles.topBar,
            isMobile && styles.mobileTopBar,
            isWide && styles.topBarWide,
            isCompactMobile && {
              flexWrap: 'nowrap',
            },
          ]}
        >
          <View
            style={[
              styles.brandSection,
              isMobile && styles.mobileBrandSection,
              isCompactMobile && {
                flexShrink: 0,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.brandRow}
              onPress={handleBrandPress}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="CARVIO home"
            >
              <View
                style={[
                  styles.logoWrap,
                  isMobile && styles.mobileLogoWrap,
                ]}
              >
                <Image
                  source={require('../assets/logo.png')}
                  style={[
                    styles.logoImage,
                    isMobile && styles.mobileLogoImage,
                  ]}
                  resizeMode="contain"
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.logo,
                    isMobile && styles.mobileLogo,
                  ]}
                >
                  CARVIO
                </Text>

                {!isMobile && (
                  <Text style={styles.logoTagline}>
                    PREMIUM AUTO MARKET
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {!isMobile && !isWide && (
              <View style={styles.locationBadge}>
                <Text style={styles.locationPin}>📍</Text>

                <View>
                  <Text style={styles.locationSmallText}>
                    LOCATION
                  </Text>

                  <Text style={styles.locationText}>
                    India
                  </Text>
                </View>

                <Text style={styles.locationArrow}>▾</Text>
              </View>
            )}
          </View>

          {isWide && !isAuthPage && (
            <View style={styles.navCenter}>
              {renderNavLinks()}
            </View>
          )}

          {isWide && isAuthPage && (
            <View style={{ flex: 1 }} />
          )}

          {showSearch && !isCompactMobile && renderSearch()}

          <View
            style={[
              styles.accountSection,
              isCompactMobile && {
                flexShrink: 0,
                gap: 6,
              },
            ]}
          >
            {userLoaded && user ? (
              <TouchableOpacity
                style={[
                  styles.accountButton,
                  isMobile && styles.mobileAccountButton,
                ]}
                onPress={() => {
                  setActiveTab('MY ACCOUNT');
                  setMenuOpen(false);
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="My account"
              >
                <View
                  style={[
                    styles.accountIconCircle,
                    isMobile && styles.mobileAccountIconCircle,
                  ]}
                >
                  <Text style={styles.accountIcon}>
                    👤
                  </Text>
                </View>

                {!isMobile && (
                  <View style={styles.accountTextContainer}>
                    <Text style={styles.accountSmallText}>
                      WELCOME
                    </Text>

                    <Text
                      style={styles.accountName}
                      numberOfLines={1}
                    >
                      {user.name || 'My Account'}
                    </Text>
                  </View>
                )}

                {!isMobile && (
                  <Text style={styles.accountArrow}>
                    ▾
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              userLoaded && (
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isMobile && styles.mobileLoginButton,
                  ]}
                  onPress={handleLoginPress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginIcon}>♙</Text>

                  <Text style={styles.loginButtonText}>
                    {isMobile ? 'Login' : 'Login / Register'}
                  </Text>
                </TouchableOpacity>
              )
            )}

            {isMobile && !isAuthPage && (
              <TouchableOpacity
                onPress={() => setMenuOpen((previous) => !previous)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={
                  menuOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
                }
                style={styles.hamburger}
              >
                <View style={styles.hamburgerLines}>
                  {[0, 1, 2].map((line) => (
                    <View
                      key={line}
                      style={{
                        width: line === 1 ? 16 : 21,
                        height: 2,
                        borderRadius: 2,
                        backgroundColor: '#12224F',
                      }}
                    />
                  ))}
                </View>

                {isLoggedIn && unreadCount > 0 && (
                  <View style={styles.hamburgerDot} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {showSearch && isCompactMobile && renderSearch(true)}

        {!isAuthPage && !isMobile && !isWide && (
          <View style={styles.navigationBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.navLinksContainer}
            >
              {renderNavLinks()}
            </ScrollView>
          </View>
        )}

        {/* The phone menu is a Modal (full overlay with a dimmed backdrop).
            An absolutely positioned menu hanging outside the header does not
            receive touches on Android, so every item would be untappable. */}
        {isMobile && !isAuthPage && (
          <Modal
            visible={menuVisible}
            transparent
            animationType="none"
            onRequestClose={() => setMenuOpen(false)}
          >
            <View style={styles.menuOverlay}>
              <Animated.View
                style={[
                  styles.menuBackdrop,
                  { opacity: menuAnimation },
                ]}
              >
                <Pressable
                  style={styles.menuBackdropPress}
                  onPress={() => setMenuOpen(false)}
                  accessibilityLabel="Close navigation menu"
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.mobileMenu,
                  {
                    maxHeight: height * 0.92,
                    opacity: menuAnimation,
                    transform: [{ translateY: menuTranslateY }],
                  },
                ]}
              >
                <SafeAreaView>
                  <View style={styles.mobileMenuHeader}>
                    <View style={styles.menuHeaderRow}>
                      <View style={styles.menuHeaderText}>
                        <Text style={styles.mobileMenuEyebrow}>
                          CARVIO NAVIGATION
                        </Text>

                        <Text style={styles.mobileMenuTitle}>
                          Find your next drive.
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => setMenuOpen(false)}
                        style={styles.menuClose}
                        activeOpacity={0.75}
                        accessibilityRole="button"
                        accessibilityLabel="Close navigation menu"
                      >
                        <Text style={styles.menuCloseText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <ScrollView
                    style={{ flexGrow: 0 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                  >
                    {NAV_ITEMS.map(renderMobileMenuItem)}

                    <View style={styles.mobileMenuFooter}>
                      <Text style={styles.mobileMenuFooterSmall}>
                        PREMIUM AUTO MARKET
                      </Text>

                      <Text style={styles.mobileMenuFooterText}>
                        Your next journey starts here.
                      </Text>
                    </View>
                  </ScrollView>
                </SafeAreaView>
              </Animated.View>
            </View>
          </Modal>
        )}
      </Animated.View>

      {/* OLX-style bottom tabs: Home, Chat, Sell, My Ads, Account. */}
      {isMobile && !isAuthPage && (
        <View style={styles.bottomBar}>
          {BOTTOM_TABS.map(renderBottomTab)}
        </View>
      )}
    </>
  );
}