import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from 'react-native';

import PremiumHero from '../components/PremiumHero';
import { getUser } from '../utils/authStorage';

export default function Home({ setActiveTab, onSearch }) {
  const [userName, setUserName] = useState('');
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const user = await getUser();

        if (isMounted && user?.name) {
          setUserName(user.name);
        }
      } catch (error) {
        console.log('Unable to load user:', error);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
<PremiumHero
  setActiveTab={setActiveTab}
  userName={userName}
  onSearch={onSearch}
/>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.aiButton,
          isMobile && styles.aiButtonMobile,
        ]}
        onPress={() => setActiveTab('AI CHAT')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Open CARVIO AI chat"
      >
        <Text style={styles.aiIcon}>✨</Text>
        <Text style={styles.aiText}>CARVIO AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#F7F9FC',
  },

  scrollView: {
    flex: 1,
    minHeight: 0,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },

  aiButton: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    backgroundColor: '#2F6FED',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  aiButtonMobile: {
    right: 12,
    bottom: 15,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  aiIcon: {
    fontSize: 20,
    marginRight: 7,
  },

  aiText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});