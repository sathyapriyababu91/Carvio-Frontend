import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import PremiumHero from '../components/PremiumHero';
import { getUser } from '../utils/authStorage';

export default function Home({ setActiveTab }) {

  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await getUser();

    console.log('HOME USER:', user);

    if (user && user.name) {
      setUserName(user.name);
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView>
        <PremiumHero
          setActiveTab={setActiveTab}
          userName={userName}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.aiButton}
        onPress={() => setActiveTab('AI CHAT')}
        activeOpacity={0.85}
      >
        <Text style={styles.aiIcon}>✨</Text>

        <Text style={styles.aiText}>
          CARVIO AI
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
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

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  aiIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  aiText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});