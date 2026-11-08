import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,

} from 'react-native';
import { styles } from '../styles/PremiumHero.styles';

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

const SEARCH_FIELDS = [
  {
    key: 'brand',
    label: 'BRAND',
    options: [
      'Any Brand',
      'Hyundai',
      'Maruti Suzuki',
      'Tata',
      'Honda',
      'Toyota',
      'Mahindra',
      'Kia',
      'Renault',
      'Ford',
      'Volkswagen',
      'Skoda',
      'BMW',
      'Mercedes-Benz',
      'Audi',
    ],
  },
  {
    key: 'budget',
    label: 'BUDGET',
    options: [
      'Any Budget',
      'Under ₹1 Lakh',
      '₹1–3 Lakh',
      '₹3–5 Lakh',
      '₹5–10 Lakh',
      'Above ₹10 Lakh',
    ],
  },
  {
    key: 'type',
    label: 'BODY TYPE',
    options: [
      'Any Type',
      'Hatchback',
      'Sedan',
      'SUV',
      'MUV',
      'Luxury',
      'Electric',
    ],
  },
];

const BUDGET_FILTERS = {
  'Under ₹1 Lakh': {
    label: 'Under ₹1 Lakh',
    min: 0,
    max: 100000,
  },
  '₹1–3 Lakh': {
    label: '₹1–3 Lakh',
    min: 100000,
    max: 300000,
  },
  '₹3–5 Lakh': {
    label: '₹3–5 Lakh',
    min: 300000,
    max: 500000,
  },
  '₹5–10 Lakh': {
    label: '₹5–10 Lakh',
    min: 500000,
    max: 1000000,
  },
  'Above ₹10 Lakh': {
    label: 'Above ₹10 Lakh',
    min: 1000000,
    max: null,
  },
};
const VEHICLE_CATEGORIES = [
  {
    icon: '🚘',
    title: 'Cars',
    description: 'Find your next car',
  },
  {
    icon: '🏍️',
    title: 'Two Wheelers',
    description: 'Explore bikes',
  },
  {
    icon: '🚚',
    title: 'Commercial',
    description: 'Vehicles for business',
  },
];

function QuickSearch({ isMobile, setActiveTab, onSearch }) {
  const [values, setValues] = useState({
    brand: 'Any Brand',
    budget: 'Any Budget',
    type: 'Any Type',
  });
  const [open, setOpen] = useState(null);
  const [bodyTypeSearch, setBodyTypeSearch] = useState('');

  return (
    <View style={styles.searchPanel}>
      {SEARCH_FIELDS.map((field) => {
        const isOpen = open === field.key;
        const filteredOptions =
  field.key === 'type'
    ? field.options.filter((option) =>
        option.toLowerCase().includes(bodyTypeSearch.toLowerCase())
      )
    : field.options;

        return (
          <View
  key={field.key}
  style={[
    styles.searchField,
    isOpen && styles.searchFieldOpen,
  ]}
>
            <Pressable
              onPress={() => {
                setOpen(isOpen ? null : field.key);
                setBodyTypeSearch('');
              }}
              style={({ pressed }) => [
                styles.searchFieldButton,
                pressed && styles.searchFieldPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${field.label}: ${values[field.key]}`}
            >
              <Text style={styles.searchLabel}>{field.label}</Text>
              <View style={styles.searchValueRow}>
                <Text numberOfLines={1} style={styles.searchValue}>
                  {values[field.key]}
                </Text>
                <Text style={styles.searchCaret}>
                  {isOpen ? '⌃' : '⌄'}
                </Text>
              </View>
            </Pressable>

            {isOpen && (
  <View style={styles.dropdown}>
    {field.key === 'type' && (
      <View style={styles.bodyTypeSearchBox}>
        <TextInput
          placeholder="Search body type or model (e.g. VXI)..."
          placeholderTextColor="#64718B"
          value={bodyTypeSearch}
          onChangeText={setBodyTypeSearch}
          style={styles.bodyTypeSearchInput}
        />
      </View>
    )}

    <ScrollView
      nestedScrollEnabled
      style={styles.dropdownScroll}
      showsVerticalScrollIndicator={false}
    >
      {filteredOptions.map((option) => (
        <Pressable
          key={option}
          onPress={() => {
            setValues((previous) => ({
              ...previous,
              [field.key]: option,
            }));
            setOpen(null);
            setBodyTypeSearch('');
          }}
          style={({ pressed }) => [
            styles.dropdownOption,
            values[field.key] === option && styles.dropdownOptionSelected,
            pressed && styles.dropdownOptionPressed,
          ]}
        >
          <Text
            style={[
              styles.dropdownOptionText,
              values[field.key] === option &&
                styles.dropdownOptionActive,
            ]}
          >
            {option}
          </Text>

          {values[field.key] === option && (
            <Text style={styles.optionCheck}>✓</Text>
          )}
        </Pressable>
      ))}

      {field.key === 'type' &&
        filteredOptions.length === 0 &&
        bodyTypeSearch.trim().length > 0 && (
          <View style={styles.dropdownEmpty}>
            <Text style={styles.dropdownEmptyText}>
              No body type matches "{bodyTypeSearch.trim()}". It may be a
              model or variant name.
            </Text>

            <Pressable
              onPress={() => {
                const keyword = bodyTypeSearch.trim();

                setOpen(null);
                setBodyTypeSearch('');

                if (typeof onSearch === 'function') {
                  onSearch({
                    brand:
                      values.brand === 'Any Brand'
                        ? ''
                        : values.brand,
                    budget:
                      values.budget === 'Any Budget'
                        ? null
                        : BUDGET_FILTERS[values.budget] || null,
                    bodyType: '',
                    keyword,
                  });
                } else {
                  setActiveTab('BUY CARS');
                }
              }}
              style={({ pressed }) => [
                styles.dropdownKeywordButton,
                pressed && styles.cardPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Search ${bodyTypeSearch.trim()} in Buy Cars`}
            >
              <Text style={styles.dropdownKeywordText}>
                ⌕ Search "{bodyTypeSearch.trim()}" in Buy Cars
              </Text>
            </Pressable>
          </View>
        )}
    </ScrollView>
  </View>
)}
          </View>
        );
      })}

      <Pressable
  onPress={() => {
    setOpen(null);

    if (typeof onSearch === 'function') {
      onSearch({
        brand:
          values.brand === 'Any Brand'
            ? ''
            : values.brand,

        budget:
          values.budget === 'Any Budget'
            ? null
            : BUDGET_FILTERS[values.budget] || null,

        bodyType:
          values.type === 'Any Type'
            ? ''
            : values.type,
      });
    } else {
      setActiveTab('BUY CARS');
    }
  }}
  style={({ pressed }) => [
    styles.searchButton,
    pressed && styles.cardPressed,
  ]}
  accessibilityRole="button"
  accessibilityLabel="Search vehicles"
>
  <Text style={styles.searchButtonText}>
    ⌕ Search Vehicles
  </Text>
</Pressable>
    </View>
  );
}

export default function PremiumHero({
  setActiveTab,
  userName,
  onSearch,
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallMobile = width < 380;

  const [slideIndex, setSlideIndex] = useState(0);
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

          <QuickSearch
  isMobile={isMobile}
  setActiveTab={setActiveTab}
  onSearch={onSearch}
/>

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
          {VEHICLE_CATEGORIES.map((category) => (
            <Pressable
              key={category.title}
              onPress={() => setActiveTab('BUY CARS')}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.cardPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={category.title}
            >
              <View style={styles.categoryIconWrap}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              </View>

              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
              </View>

              <Text style={styles.categoryArrow}>↗</Text>
            </Pressable>
          ))}
        </View>

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