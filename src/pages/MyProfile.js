import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { getUser } from '../utils/authStorage';

const MyProfile = ({ setActiveTab }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user whenever My Profile screen becomes active
  useEffect(() => {
    loadUser();
  }, []);

  // silent = refresh data without showing the full-screen loader
  const loadUser = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      const savedUser = await getUser();

      console.log('MY PROFILE USER:', savedUser);

      setUser(savedUser);

    } catch (error) {
      console.log('MY PROFILE ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // REFRESH PROFILE
  // ===============================
  const handleEditProfile = async () => {
    // Latest data load pannitu Edit Profile-ku pogum
    await loadUser(true);

    setActiveTab('EDIT PROFILE');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#2F6FED"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>

      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>

        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorText}>
          User details not found
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          activeOpacity={0.85}
          onPress={() => loadUser()}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  const details = [
    {
      icon: '👤',
      label: 'Name',
      value: user.name,
    },
    {
      icon: '📱',
      label: 'Phone',
      value: user.phone,
    },
    {
      icon: '✉️',
      label: 'Email',
      value: user.email,
    },
    {
      icon: '📍',
      label: 'City',
      value: user.address?.city,
    },
    {
      icon: '🗺️',
      label: 'State',
      value: user.address?.state,
    },
    {
      icon: '📮',
      label: 'Pincode',
      value: user.address?.pincode,
    },
  ];

  const initial = (user.name || '?')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER BANNER */}

      <View style={styles.banner}>

        <View pointerEvents="none" style={styles.bannerGlow} />

        <View style={styles.profileIcon}>

          <Text style={styles.profileInitial}>
            {initial}
          </Text>

        </View>

        <View style={styles.headerText}>

          <Text style={styles.bannerLabel}>
            MY PROFILE
          </Text>

          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {user.name || 'CARVIO User'}
          </Text>

          <Text style={styles.subtitle}>
            Your personal account details
          </Text>

        </View>

      </View>


      {/* PROFILE CARD */}

      <View style={styles.card}>

        {details.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.detailRow,
              index === details.length - 1 && styles.detailRowLast,
            ]}
          >

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                {item.icon}
              </Text>
            </View>

            <View style={styles.detailContent}>

              <Text style={styles.label}>
                {item.label}
              </Text>

              <Text
                style={[
                  styles.value,
                  !item.value && styles.valueMuted,
                ]}
              >
                {item.value || 'Not provided'}
              </Text>

            </View>

          </View>
        ))}

      </View>


      {/* EDIT PROFILE BUTTON */}

      <TouchableOpacity
        style={styles.editButton}
        activeOpacity={0.85}
        onPress={handleEditProfile}
      >

        <Text style={styles.editIcon}>
          ✏️
        </Text>

        <Text style={styles.editButtonText}>
          Edit Profile
        </Text>

        <Text style={styles.editArrow}>
          →
        </Text>

      </TouchableOpacity>


      {/* BACK */}

      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => setActiveTab('MY ACCOUNT')}
      >
        <Text style={styles.backButtonText}>
          ← Back to My Account
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  content: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 50,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#0F1C45',
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#0F1C45',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },

  bannerGlow: {
    position: 'absolute',
    top: -90,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(47,111,237,0.28)',
  },

  profileIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2F6FED',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  profileInitial: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  bannerLabel: {
    color: '#76A8FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 13,
    color: '#C9D4EE',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E4EAF4',
    shadowColor: '#0F1C45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F8',
  },

  detailRowLast: {
    borderBottomWidth: 0,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EAF1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 20,
  },

  detailContent: {
    flex: 1,
    minWidth: 0,
  },

  label: {
    fontSize: 12,
    color: '#6B7A99',
    fontWeight: '600',
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101B36',
  },

  valueMuted: {
    fontWeight: '500',
    color: '#98A2B3',
  },

  editButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2F6FED',
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#2F6FED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },

  editIcon: {
    fontSize: 19,
    marginRight: 10,
  },

  editButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  editArrow: {
    fontSize: 22,
    color: '#FFFFFF',
  },

  backButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 6,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F6FED',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F8FC',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
  },

  errorIcon: {
    fontSize: 40,
    marginBottom: 8,
  },

  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2F6FED',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

});

export default MyProfile;