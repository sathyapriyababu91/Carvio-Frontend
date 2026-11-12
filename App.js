import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';

import Navbar from './src/components/Navbar';

import Home from './src/pages/Home';
import About from './src/pages/About';
import BuyCars from './src/pages/BuyCars';

import SellVehicleCategory from './src/pages/SellVehicleCategory';
import SellCars from './src/pages/SellCars';
import SellTwoWheeler from './src/pages/SellTwoWheeler';
import SellCommercialVehicle from './src/pages/SellCommercialVehicle';

import PaymentPage from './src/pages/PaymentPage';
import PaymentHistory from './src/pages/PaymentHistory';

import Login from './src/pages/Login';
import Register from './src/pages/Register';

import MyAccount from './src/pages/MyAccount';
import MyProfile from './src/pages/MyProfile';
import EditProfile from './src/pages/EditProfile';
import MyListings from './src/pages/MyListings';
import EditCar from './src/pages/EditCar';
import ChangePassword from './src/pages/ChangePassword';
import Favourites from './src/pages/Favourites';

import MessagesScreen from './src/pages/MessagesScreen';
import ChatScreen from './src/pages/ChatScreen';
import AIChatScreen from './src/pages/AIChatScreen';

import CarDetails from './src/pages/CarDetails';
import Services from './src/pages/Services';
import HelpSupport from './src/pages/HelpSupport';
import SellCarFeedbackModal from './src/components/SellCarFeedbackModal';
import { isLoggedIn } from './src/utils/authStorage';

const AUTH_TABS = ['LOGIN', 'REGISTER'];

const NO_HISTORY_TABS = ['LOGIN', 'REGISTER', 'CHAT', 'PAYMENT'];

const MAX_HISTORY = 20;

const EMPTY_FILTERS = {
  bodyType: '',
  brand: '',
  budget: null,
};

const nextHistory = (stack, current, next) => {
  if (AUTH_TABS.includes(next)) {
    return [];
  }

  const index = stack.lastIndexOf(next);

  if (index !== -1) {
    return stack.slice(0, index);
  }

  if (current && !NO_HISTORY_TABS.includes(current)) {
    return [...stack, current].slice(-MAX_HISTORY);
  }

  return stack;
};

export default function App() {
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTabState] = useState(null);

  const activeTabRef = useRef(null);
  const historyRef = useRef([]);

  const [paymentData, setPaymentData] = useState({
    purpose: 'VEHICLE_LISTING',
    vehicleType: '',
    paymentMethod: '',
    carId: null,
    boostType: null,
    backTab: 'SELL CARS',
  });

  const [chatData, setChatData] = useState({
    car: null,
    sellerId: null,
  });

  const [editCar, setEditCar] = useState(null);

  // Vehicle opened from a Home page card.
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState(EMPTY_FILTERS);

  const [sellCarFeedbackVisible, setSellCarFeedbackVisible] =
    useState(false);

  // On phones the Navbar shows a bottom tab bar (Home, Chat, Sell,
  // My Ads, Account). Leave room for it so it never covers content.
  const showBottomBar =
    width < 768 &&
    activeTab !== null &&
    !AUTH_TABS.includes(activeTab) &&
    activeTab !== 'CHAT';

  const showTab = useCallback((tab) => {
    activeTabRef.current = tab;
    setActiveTabState(tab);
  }, []);

  const navigate = useCallback(
    (next) => {
      const current = activeTabRef.current;

      if (!next || next === current) return;

      historyRef.current = nextHistory(
        historyRef.current,
        current,
        next
      );

      showTab(next);
    },
    [showTab]
  );

  const closeChat = useCallback(() => {
    setChatData({
      car: null,
      sellerId: null,
    });

    navigate('MESSAGES');
  }, [navigate]);

  const goBack = useCallback(() => {
    const current = activeTabRef.current;
    const stack = historyRef.current;

    if (current === 'CHAT') {
      closeChat();
      return true;
    }

    if (stack.length > 0) {
      historyRef.current = stack.slice(0, -1);
      showTab(stack[stack.length - 1]);
      return true;
    }

    if (current === 'REGISTER') {
      showTab('LOGIN');
      return true;
    }

    if (current && current !== 'HOME' && current !== 'LOGIN') {
      showTab('HOME');
      return true;
    }

    return false;
  }, [closeChat, showTab]);

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack
    );

    return () => subscription.remove();
  }, [goBack]);

  useEffect(() => {
    let active = true;

    const checkLoginStatus = async () => {
      try {
        const loggedIn = await isLoggedIn();

        console.log('APP LOGIN STATUS:', loggedIn);

        if (active) {
          showTab(loggedIn ? 'HOME' : 'LOGIN');
        }
      } catch (error) {
        console.log('LOGIN STATUS ERROR:', error);

        if (active) {
          showTab('LOGIN');
        }
      }
    };

    checkLoginStatus();

    return () => {
      active = false;
    };
  }, [showTab]);

  // Existing vehicle listing payment
  const goToPayment = ({
    vehicleType,
    paymentMethod,
    carId = null,
  }) => {
    setPaymentData({
      purpose: 'VEHICLE_LISTING',
      vehicleType,
      paymentMethod,
      carId,
      boostType: null,
      backTab: 'SELL CARS',
    });

    navigate('PAYMENT');
  };

  // New booster pack payment
  const goToBoosterPayment = ({
    carId,
    vehicleType,
    boostType,
  }) => {
    if (!carId || !boostType) {
      console.log('BOOSTER PAYMENT ERROR: Missing carId or boostType');
      return;
    }

    setPaymentData({
      purpose: 'BOOSTER_PACK',
      vehicleType: vehicleType || '',
      paymentMethod: '',
      carId,
      boostType,
      backTab: 'MY LISTINGS',
    });

    navigate('PAYMENT');
  };

  const openChat = ({ car, sellerId }) => {
    setChatData({
      car,
      sellerId,
    });

    navigate('CHAT');
  };

  const openVehicleDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    navigate('VEHICLE DETAILS');
  };

  const openEditCar = (listing) => {
    setEditCar(listing);
    navigate('EDIT CAR');
  };

  const openSellFeedback = () => {
    setSellCarFeedbackVisible(true);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query || '');
    setSearchFilters(EMPTY_FILTERS);
    navigate('BUY CARS');
  };

  const handleHeroSearch = (filters) => {
    setSearchFilters({ ...EMPTY_FILTERS, ...filters });
    setSearchQuery('');
    navigate('BUY CARS');
  };

  if (activeTab === null) {
    return (
      <SafeAreaView style={[styles.container, styles.splash]}>
        <ActivityIndicator size="large" color="#2F6FED" />
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <Home
            setActiveTab={navigate}
            onSearch={handleHeroSearch}
            openChat={openChat}
            onOpenVehicle={openVehicleDetails}
          />
        );

      case 'VEHICLE DETAILS':
        return (
          <CarDetails
            key={selectedVehicle?.id}
            car={selectedVehicle}
            onBack={goBack}
          />
        );

      case 'ABOUT':
        return <About setActiveTab={navigate} />;

      case 'BUY CARS':
        return (
          <BuyCars
            setActiveTab={navigate}
            searchQuery={searchQuery}
            searchFilters={searchFilters}
            onClearSearchFilters={() => {
              setSearchFilters(EMPTY_FILTERS);
              setSearchQuery('');
            }}
          />
        );

      case 'SELL CARS':
        return <SellVehicleCategory setActiveTab={navigate} />;

      case 'SELL CAR':
        return (
          <SellCars
            setActiveTab={navigate}
            goToPayment={goToPayment}
            onFeedbackRequired={openSellFeedback}
          />
        );

      case 'SELL TWO WHEELER':
        return (
          <SellTwoWheeler
            setActiveTab={navigate}
            goToPayment={goToPayment}
            onFeedbackRequired={openSellFeedback}
          />
        );

      case 'SELL COMMERCIAL':
        return (
          <SellCommercialVehicle
            setActiveTab={navigate}
            goToPayment={goToPayment}
            onFeedbackRequired={openSellFeedback}
          />
        );

      case 'PAYMENT':
        return (
          <PaymentPage
            setActiveTab={navigate}
            purpose={paymentData.purpose}
            vehicleType={paymentData.vehicleType}
            paymentMethod={paymentData.paymentMethod}
            carId={paymentData.carId}
            boostType={paymentData.boostType}
            backTab={paymentData.backTab}
            onPaymentSuccess={(result) => {
              console.log('PAYMENT SUCCESS:', result);

              if (paymentData.purpose === 'BOOSTER_PACK') {
                navigate('MY LISTINGS');
                return;
              }

              setSellCarFeedbackVisible(true);
            }}
          />
        );

      case 'SERVICES':
        return <Services setActiveTab={navigate} />;

      case 'HELP & SUPPORT':
        return <HelpSupport setActiveTab={navigate} />;

      case 'MESSAGES':
        return (
          <MessagesScreen
            setActiveTab={navigate}
            openChat={openChat}
          />
        );

      case 'CHAT':
        return (
          <ChatScreen
            car={chatData.car}
            sellerId={chatData.sellerId}
            onBack={closeChat}
          />
        );

      case 'AI CHAT':
        return <AIChatScreen setActiveTab={navigate} />;

      case 'MY ACCOUNT':
        return <MyAccount setActiveTab={navigate} />;

      case 'MY PROFILE':
        return <MyProfile setActiveTab={navigate} />;

      case 'EDIT PROFILE':
        return <EditProfile setActiveTab={navigate} />;

      case 'CHANGE PASSWORD':
        return <ChangePassword setActiveTab={navigate} />;

      case 'FAVOURITES':
        return <Favourites setActiveTab={navigate} />;

      case 'PAYMENT HISTORY':
        return <PaymentHistory setActiveTab={navigate} />;

      case 'EDIT CAR':
        return (
          <EditCar
            car={editCar}
            setActiveTab={navigate}
          />
        );

      case 'MY LISTINGS':
        return (
          <MyListings
            setActiveTab={navigate}
            openEditCar={openEditCar}
            onBoostPress={goToBoosterPayment}
          />
        );

      case 'LOGIN':
        return <Login setActiveTab={navigate} />;

      case 'REGISTER':
        return <Register setActiveTab={navigate} />;

      default:
        return <Login setActiveTab={navigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {activeTab !== 'CHAT' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={navigate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />
      )}

      <View
        style={[
          styles.screen,
          showBottomBar && styles.screenWithBottomBar,
        ]}
      >
        {renderScreen()}
      </View>

      <SellCarFeedbackModal
        visible={sellCarFeedbackVisible}
        onClose={() => setSellCarFeedbackVisible(false)}
        setActiveTab={navigate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  splash: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  screen: {
    flex: 1,
  },

  // Same height as the Navbar bottom tab bar.
  screenWithBottomBar: {
    paddingBottom: 66,
  },
});