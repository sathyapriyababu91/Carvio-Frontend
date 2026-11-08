import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';

import {
  styles,
  getResponsiveStyles,
} from '../styles/About.styles';

const ABOUT_IMAGE_URL =
  'https://i.pinimg.com/1200x/dc/a7/f9/dca7f9c4415f85eb98d90e0e6e877a04.jpg';

const INSPECTION_IMAGE_URL =
  'https://i.pinimg.com/1200x/b0/2f/44/b02f4446ddb1b8351bee1d3c595b94d8.jpg';

const trustChips = ['Simple', 'Transparent', 'Convenient'];

const whoPoints = [
  'Discover vehicle options',
  'Compare vehicle details',
  'Connect with sellers in one place',
];

const features = [
  {
    icon: '✓',
    title: 'Verified Listings',
    description:
      'Explore vehicle listings with clear details to help you make confident decisions.',
  },
  {
    icon: '₹',
    title: 'Better Value',
    description:
      'Compare options and find a vehicle that suits your needs and budget.',
  },
  {
    icon: '↗',
    title: 'Simple Process',
    description:
      'Buy or sell vehicles with a straightforward and convenient experience.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Explore Vehicles',
    description:
      'Browse available vehicles and discover options that match your needs.',
  },
  {
    number: '02',
    title: 'Compare & Choose',
    description:
      'Review vehicle details and shortlist your preferred option.',
  },
  {
    number: '03',
    title: 'Connect',
    description:
      'Contact the seller and discuss the vehicle directly.',
  },
  {
    number: '04',
    title: 'Drive Away',
    description:
      'Complete your arrangements and get ready for your next journey.',
  },
];

export default function About({ setActiveTab }) {
  const { width } = useWindowDimensions();
  const r = getResponsiveStyles(width);

  const isMobile = width < 768;
  const isDesktop = width >= 1024;

  const goToBuy = () => {
    setActiveTab?.('BUY CARS');
  };

  const goToSell = () => {
    setActiveTab?.('SELL CARS');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HERO ================= */}
      <View style={[styles.hero, r.hero]}>
        <View pointerEvents="none" style={styles.glowOne} />
        <View pointerEvents="none" style={styles.glowTwo} />

        <View style={[styles.inner, r.inner, styles.heroInner, r.heroInner]}>
          <View style={[styles.heroLeft, r.heroLeft]}>
            <View style={styles.topBadge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>ABOUT CARVIO</Text>
            </View>

            <Text style={[styles.title, r.title]}>
              Making Car Buying & Selling
            </Text>
            <Text style={[styles.highlightText, r.highlightText]}>
              Simple & Smarter
            </Text>

            <Text style={[styles.subtitle, r.subtitle]}>
              CARVIO brings buyers and sellers together with a simpler,
              more convenient way to explore and sell vehicles.
            </Text>

            <View style={[styles.heroButtons, r.heroButtons]}>
              <TouchableOpacity
                style={[styles.primaryButton, r.primaryButton]}
                onPress={goToSell}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Sell Your Vehicle</Text>
                <Text style={styles.primaryArrow}>↗</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, r.secondaryButton]}
                onPress={goToBuy}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryButtonText}>Explore Vehicles</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipRow}>
              {trustChips.map((chip) => (
                <View key={chip} style={styles.chip}>
                  <Text style={styles.chipTick}>✓</Text>
                  <Text style={styles.chipText}>{chip}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.heroMedia, r.heroMedia]}>
            <View style={styles.heroImageClip}>
              <Image
                source={{ uri: ABOUT_IMAGE_URL }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>

            <View style={[styles.floatCard, r.floatCard]}>
              <Text style={styles.floatTitle}>Your Journey Starts Here</Text>
              <Text style={styles.floatText}>
                Discover a smarter way to move
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ================= WHO WE ARE ================= */}
      <View style={[styles.whoSection, r.whoSection]}>
        <View style={[styles.inner, r.inner, styles.whoInner, r.whoInner]}>
          <View style={[styles.whoMedia, r.whoMedia]}>
            <Image
              source={{ uri: INSPECTION_IMAGE_URL }}
              style={styles.whoImage}
              resizeMode="cover"
            />
            <View style={styles.imageCaption}>
              <Text style={styles.imageCaptionTitle}>Choose With Confidence</Text>
              <Text style={styles.imageCaptionText}>
                Details that help you decide
              </Text>
            </View>
          </View>

          <View style={[styles.whoText, r.whoText]}>
            <Text style={styles.eyebrow}>WHO WE ARE</Text>

            <Text style={[styles.sectionHeading, r.sectionHeading]}>
              A Better Way to Find Your Next Vehicle
            </Text>

            <Text style={styles.bodyText}>
              At CARVIO, we believe buying or selling a vehicle should feel
              simple and convenient. Our platform helps people discover
              vehicle options, compare details, and connect with sellers in
              one place.
            </Text>

            <Text style={styles.bodyText}>
              Our goal is to create a user-friendly marketplace where people
              can make informed decisions at every step.
            </Text>

            <View style={styles.checkList}>
              {whoPoints.map((point) => (
                <View key={point} style={styles.checkItem}>
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkBadgeText}>✓</Text>
                  </View>
                  <Text style={styles.checkText}>{point}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.textLink}
              onPress={goToBuy}
              activeOpacity={0.8}
            >
              <Text style={styles.textLinkText}>Discover vehicles</Text>
              <Text style={styles.textLinkArrow}> →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ================= WHY CHOOSE ================= */}
      <View style={[styles.whySection, r.whySection]}>
        <View style={[styles.inner, r.inner]}>
          <View style={[styles.centerHead, r.centerHead]}>
            <Text style={styles.eyebrow}>THE CARVIO DIFFERENCE</Text>
            <Text style={[styles.sectionTitleCenter, r.sectionTitleCenter]}>
              Why Choose CARVIO?
            </Text>
            <Text style={styles.sectionSubtitle}>
              Everything you need for a smoother vehicle marketplace
              experience.
            </Text>
          </View>

          <View style={[styles.cardsRow, r.cardsRow]}>
            {features.map((feature) => (
              <View
                key={feature.title}
                style={[styles.featureCard, r.featureCard]}
              >
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>{feature.icon}</Text>
                </View>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ================= BUYERS / SELLERS ================= */}
      <View style={[styles.splitSection, r.splitSection]}>
        <View style={[styles.inner, r.inner]}>
          <View style={[styles.splitRow, r.splitRow]}>
            <View style={[styles.splitCard, r.splitCard]}>
              <Text style={styles.splitLabel}>FOR BUYERS</Text>
              <Text style={[styles.splitTitle, r.splitTitle]}>
                Find a vehicle that fits you
              </Text>
              <Text style={styles.splitText}>
                Browse available vehicles, review their details and shortlist
                the option that matches your needs and budget.
              </Text>
              <TouchableOpacity
                style={[styles.splitButton, r.splitButton]}
                onPress={goToBuy}
                activeOpacity={0.85}
              >
                <Text style={styles.splitButtonText}>Explore Vehicles</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[styles.splitCard, styles.splitCardDark, r.splitCard]}
            >
              <Text style={[styles.splitLabel, styles.splitLabelDark]}>
                FOR SELLERS
              </Text>
              <Text
                style={[styles.splitTitle, styles.splitTitleDark, r.splitTitle]}
              >
                Share your listing with CARVIO
              </Text>
              <Text style={[styles.splitText, styles.splitTextDark]}>
                List your vehicle with clear details and connect with people
                who are looking for their next ride.
              </Text>
              <TouchableOpacity
                style={[
                  styles.splitButton,
                  styles.splitButtonDark,
                  r.splitButton,
                ]}
                onPress={goToSell}
                activeOpacity={0.85}
              >
                <Text style={styles.splitButtonText}>Sell Your Vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* ================= HOW IT WORKS ================= */}
      <View style={[styles.processSection, r.processSection]}>
        <View style={[styles.inner, r.inner]}>
          <View style={[styles.centerHead, r.centerHead]}>
            <Text style={styles.eyebrow}>HOW IT WORKS</Text>
            <Text style={[styles.sectionTitleCenter, r.sectionTitleCenter]}>
              Four Simple Steps
            </Text>
            <Text style={styles.sectionSubtitle}>
              From browsing to connecting, your next vehicle is just a few
              steps away.
            </Text>
          </View>

          <View style={[styles.stepsRow, r.stepsRow]}>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;

              return (
                <View key={step.number} style={[styles.stepItem, r.stepItem]}>
                  {!isLast && isDesktop ? (
                    <View style={styles.stepLineH} />
                  ) : null}
                  {!isLast && isMobile ? (
                    <View style={styles.stepLineV} />
                  ) : null}

                  <View style={[styles.stepNumber, r.stepNumber]}>
                    <Text style={styles.stepNumberText}>{step.number}</Text>
                  </View>

                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>
                    {step.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* ================= CTA ================= */}
      <View style={[styles.ctaWrap, r.ctaWrap]}>
        <View style={[styles.inner, r.inner]}>
          <View style={[styles.ctaSection, r.ctaSection]}>
            <View pointerEvents="none" style={styles.ctaGlow} />

            <View style={styles.ctaContent}>
              <Text style={[styles.ctaTitle, r.ctaTitle]}>
                Ready for Your Next Journey?
              </Text>
              <Text style={styles.ctaDescription}>
                Find your next vehicle or share your listing with CARVIO.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.ctaButton, r.ctaButton]}
              onPress={goToSell}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaButtonText}>Start Selling</Text>
              <Text style={styles.ctaArrow}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}