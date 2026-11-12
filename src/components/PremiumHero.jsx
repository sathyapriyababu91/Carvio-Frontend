import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { styles } from '../styles/PremiumHero.styles';
import HomeListings from './HomeListings';

const VEHICLE_SLIDES = [
  {
    title: 'Find Your Perfect Ride.',
    subtitle: 'Explore quality cars from trusted sellers.',
    image:
      'https://motozite.com/_next/image?url=https%3A%2F%2Fmotoziteprodstorage.blob.core.windows.net%2Fweb-media%2Fpre_images%2F1_1787828927356_cjpxe.jpg&w=1920&q=75',
    label: 'PREMIUM CARS',
  },
  {
    title: 'Ride Your Way.',
    subtitle: 'Discover two-wheelers that match your lifestyle.',
    image:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',
    label: 'TWO WHEELERS',
  },
  {
    title: 'Move More. Go Further.',
    subtitle: 'Find commercial vehicles for your business.',
    image:
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85',
    label: 'COMMERCIAL VEHICLES',
  },
];

// "value" matches the vehicleType saved on each listing.
const VEHICLE_CATEGORIES = [
  {
    icon: '🚘',
    title: 'Cars',
    value: 'Car',
    description: 'Find your next car',
  },
  {
    icon: '🏍️',
    title: 'Two Wheelers',
    value: 'Two Wheeler',
    description: 'Explore bikes',
  },
  {
    icon: '🚚',
    title: 'Commercial',
    value: 'Commercial Vehicle',
    description: 'Vehicles for business',
  },
];

export default function PremiumHero({
  setActiveTab,
  userName,
  // onSearch is no longer used here (search panel removed) but kept so
  // existing callers passing it do not break.
  // eslint-disable-next-line no-unused-vars
  onSearch,
  openChat,
  onOpenVehicle,
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallMobile = width < 380;

  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [failedImages, setFailedImages] = useState({});
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentMove = useRef(new Animated.Value(18)).current;

  const activeSlide = VEHICLE_SLIDES[slideIndex];
  const imageFailed = Boolean(failedImages[activeSlide.image]);

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(contentMove, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [contentOpacity, contentMove]);

  useEffect(() => {
    let active = true;

    const timer = setInterval(() => {
      Animated.timing(imageOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && active) {
          setSlideIndex((current) => (
            current + 1
          ) % VEHICLE_SLIDES.length);
          imageOpacity.setValue(0);

          Animated.timing(imageOpacity, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
      });
    }, 5000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [imageOpacity]);

  return (
    <View style={[styles.heroContainer, isMobile && styles.heroMobile]}>
      <View style={[styles.heroMain, isMobile && styles.heroMainMobile]}>
        <Animated.View
          style={[
            styles.imageWrap,
            isMobile && styles.imageWrapMobile,
            isSmallMobile && styles.imageWrapSmall,
            { opacity: imageOpacity },
          ]}
        >
          {imageFailed ? (
            <View style={styles.imageFallback}>
              <Text style={styles.imageFallbackIcon}>🚘</Text>
              <Text style={styles.imageFallbackText}>CARVIO</Text>
            </View>
          ) : (
            <Image
              key={activeSlide.image}
              source={{ uri: activeSlide.image }}
              style={styles.heroImage}
              resizeMode="cover"
              onError={() =>
                setFailedImages((previous) => ({
                  ...previous,
                  [activeSlide.image]: true,
                }))
              }
            />
          )}

          <View style={styles.imageOverlay} pointerEvents="none" />

          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>{activeSlide.label}</Text>
          </View>

          <View style={styles.slideIndicators}>
            {VEHICLE_SLIDES.map((slide, index) => (
              <Pressable
                key={slide.label}
                hitSlop={8}
                onPress={() => {
                  imageOpacity.stopAnimation();
                  imageOpacity.setValue(0);
                  setSlideIndex(index);

                  Animated.timing(imageOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                  }).start();
                }}
                style={[
                  styles.slideIndicator,
                  index === slideIndex && styles.slideIndicatorActive,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.contentContainer,
            isMobile && styles.contentMobile,
            isSmallMobile && styles.contentSmall,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentMove }],
            },
          ]}
        >
          <View style={styles.topBadge}>
            <View style={styles.badgeDot} />
            <Text style={styles.topBadgeText}>
              INDIA'S SMARTER AUTO MARKETPLACE
            </Text>
          </View>

          <Text
            style={[
              styles.heroTitle,
              isMobile && styles.heroTitleMobile,
              isSmallMobile && styles.heroTitleSmall,
            ]}
          >
            {activeSlide.title}
          </Text>

          <Text style={styles.welcomeText}>
            {userName ? `Welcome back, ${userName} 👋` : 'Buy smarter. Sell faster.'}
          </Text>

          <Text style={styles.heroSubtitle}>
            {activeSlide.subtitle} Buy or sell with confidence on CARVIO.
          </Text>

          <View style={styles.trustRow}>
            <View style={styles.trustChip}>
              <Text style={styles.trustText}>✓ Verified listings</Text>
            </View>
            <View style={styles.trustChip}>
              <Text style={styles.trustText}>✓ Trusted marketplace</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={[styles.categorySection, isMobile && styles.categorySectionMobile]}>
        <View style={styles.categoryHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>EXPLORE CARVIO</Text>
            <Text style={styles.sectionTitle}>Find the right vehicle</Text>
          </View>

          <Pressable
            onPress={() => setActiveTab('BUY CARS')}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text style={styles.viewAllText}>View all →</Text>
          </Pressable>
        </View>

        <View style={styles.categoryRow}>
          {VEHICLE_CATEGORIES.map((category) => {
            const isSelected = selectedType === category.value;

            return (
              <Pressable
                key={category.title}
                onPress={() =>
                  setSelectedType(isSelected ? '' : category.value)
                }
                style={({ pressed }) => [
                  styles.categoryCard,
                  isSelected && styles.categoryCardActive,
                  pressed && styles.cardPressed,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${category.title}. ${category.description}`}
              >
                <View style={styles.categoryIconWrap}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.categoryTitle,
                    isSelected && styles.categoryTitleActive,
                  ]}
                >
                  {category.title}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <HomeListings
          vehicleType={selectedType}
          setActiveTab={setActiveTab}
          openChat={openChat}
          onOpenVehicle={onOpenVehicle}
        />

        <Pressable
          onPress={() => setActiveTab('SELL CARS')}
          style={({ pressed }) => [
            styles.sellBanner,
            pressed && styles.cardPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Sell your vehicle"
        >
          <View style={styles.sellBannerGlow} pointerEvents="none" />

          <View style={styles.sellBannerTextWrap}>
            <Text style={styles.sellBannerEyebrow}>READY TO SELL?</Text>
            <Text style={styles.sellBannerTitle}>
              Your vehicle deserves the right buyer.
            </Text>
            <Text style={styles.sellBannerSubtitle}>
              List your vehicle on CARVIO.
            </Text>
          </View>

          <View style={styles.sellBannerButton}>
            <Text style={styles.sellBannerButtonText}>Sell Vehicle →</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}