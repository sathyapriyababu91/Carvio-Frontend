import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';

const CATEGORIES = [
  {
    key: 'car',
    tab: 'SELL CAR',
    title: 'Car',
    text: 'Sell your car',
    label: 'PREMIUM CARS',
    tint: '#EEF4FF',
    image:
      'https://motozite.com/_next/image?url=https%3A%2F%2Fmotoziteprodstorage.blob.core.windows.net%2Fweb-media%2Fpre_images%2F1_1787828927356_cjpxe.jpg&w=1920&q=75',
  },
  {
    key: 'two-wheeler',
    tab: 'SELL TWO WHEELER',
    title: 'Two Wheeler',
    text: 'Sell your bike or scooter',
    label: 'TWO WHEELERS',
    tint: '#FFF4E5',
    image:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85',
  },
  {
    key: 'commercial',
    tab: 'SELL COMMERCIAL',
    title: 'Commercial Vehicle',
    text: 'Sell your commercial vehicle',
    label: 'COMMERCIAL',
    tint: '#E9F8EF',
    image:
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85',
  },
];

function CategoryCard({
  category,
  isDesktop,
  isSmallMobile,
  onPress,
  index,
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(animatedValue, {
      toValue: 1,
      duration: 650,
      delay: index * 140,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [animatedValue, index]);

  return (
    <Animated.View
      style={[
        styles.animatedCard,
        isDesktop && styles.animatedCardDesktop,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${category.title}. ${category.text}`}
        style={({ hovered, pressed }) => [
          styles.card,
          isDesktop && styles.cardDesktop,
          hovered && styles.cardHover,
          pressed && styles.cardPressed,
        ]}
      >
        <View
          style={[
            styles.imageWrap,
            isDesktop && styles.imageWrapDesktop,
            isSmallMobile && styles.imageWrapSmall,
            { backgroundColor: category.tint },
          ]}
        >
          <Image
            source={{ uri: category.image }}
            style={styles.image}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />

          <View style={styles.imageShade} />

          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>
              {category.label}
            </Text>
          </View>

          <View style={styles.imageArrow}>
            <Text style={styles.imageArrowText}>↗</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.textWrap}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {category.title}
            </Text>

            <Text style={styles.cardText} numberOfLines={2}>
              {category.text}
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function SellVehicleCategory({ setActiveTab }) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;
  const isSmallMobile = width < 380;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerMove = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(headerMove, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [headerOpacity, headerMove]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerMove }],
          },
        ]}
      >
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrow}>
            CARVIO PREMIUM MARKETPLACE
          </Text>
        </View>

        <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
          Sell your vehicle
          <Text style={styles.titleAccent}> with confidence.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Choose your vehicle category to get started.
          Find the right buyer with CARVIO.
        </Text>
      </Animated.View>

      <View style={[styles.list, isDesktop && styles.listDesktop]}>
        {CATEGORIES.map((category, index) => (
          <CategoryCard
            key={category.key}
            category={category}
            index={index}
            isDesktop={isDesktop}
            isSmallMobile={isSmallMobile}
            onPress={() => setActiveTab(category.tab)}
          />
        ))}
      </View>

      <View style={styles.bottomNote}>
        <View style={styles.noteIcon}>
          <Text style={styles.noteIconText}>✓</Text>
        </View>

        <View style={styles.noteTextWrap}>
          <Text style={styles.noteTitle}>
            Your vehicle. Your choice.
          </Text>
          <Text style={styles.noteText}>
            Get started with the right category for your vehicle.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  android: {
    elevation: 4,
  },
  ios: {
    shadowColor: '#101B36',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
  },
  web: {
    boxShadow: '0px 8px 24px rgba(16, 27, 54, 0.07)',
  },
  default: {},
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#F7F9FC',
  },

  container: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 45,
  },

  header: {
    marginBottom: 26,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2F6FED',
    marginRight: 8,
  },

  eyebrow: {
    color: '#2F6FED',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  title: {
    color: '#12224F',
    fontSize: 29,
    lineHeight: 37,
    fontWeight: '900',
    letterSpacing: -0.7,
  },

  titleDesktop: {
    fontSize: 38,
    lineHeight: 47,
  },

  titleAccent: {
    color: '#2F6FED',
  },

  subtitle: {
    maxWidth: 540,
    fontSize: 14,
    lineHeight: 22,
    color: '#667085',
    marginTop: 10,
  },

  list: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: 18,
  },

  listDesktop: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 22,
  },

  animatedCard: {
    width: '100%',
  },

  animatedCardDesktop: {
    flex: 1,
    minWidth: 0,
  },

  card: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAF4',
    overflow: 'hidden',
    ...cardShadow,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      },
      default: {},
    }),
  },

  cardDesktop: {
    flex: 1,
    minWidth: 0,
  },

  cardHover: Platform.select({
    web: {
      transform: [{ translateY: -4 }],
      boxShadow: '0px 14px 30px rgba(16, 27, 54, 0.14)',
    },
    default: {},
  }),

  cardPressed: {
    opacity: 0.94,
  },

  imageWrap: {
    width: '100%',
    height: 190,
    overflow: 'hidden',
    position: 'relative',
  },

  imageWrapDesktop: {
    height: 230,
  },

  imageWrapSmall: {
    height: 155,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 20, 47, 0.10)',
  },

  imageBadge: {
    position: 'absolute',
    left: 14,
    top: 14,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 34, 79, 0.91)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  imageArrow: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageArrowText: {
    color: '#2F6FED',
    fontSize: 19,
    fontWeight: '900',
  },

  body: {
    minHeight: 86,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  textWrap: {
    flex: 1,
    minWidth: 0,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#12224F',
  },

  cardText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#667085',
    marginTop: 5,
  },

  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    flexShrink: 0,
  },

  arrow: {
    fontSize: 25,
    lineHeight: 29,
    fontWeight: '700',
    color: '#2F6FED',
  },

  bottomNote: {
    marginTop: 26,
    padding: 16,
    borderRadius: 17,
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#DFE9FF',
    flexDirection: 'row',
    alignItems: 'center',
  },

  noteIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2F6FED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  noteIconText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  noteTextWrap: {
    flex: 1,
    minWidth: 0,
  },

  noteTitle: {
    color: '#12224F',
    fontSize: 13,
    fontWeight: '900',
  },

  noteText: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
});
