
import AsyncStorage from '@react-native-async-storage/async-storage';

// SAVE LOGIN DATA
export const setAuthData = async (token, user) => {
  try {
    if (!token || !user) {
      throw new Error('Token or user data is missing');
    }

    const userId = user.id || user._id || user.userId;

    await AsyncStorage.setItem('token', String(token));
    await AsyncStorage.setItem('user', JSON.stringify(user));

    if (userId) {
      await AsyncStorage.setItem('userId', String(userId));
    } else {
      await AsyncStorage.removeItem('userId');
    }
  } catch (error) {
    console.error('SET AUTH DATA ERROR:', error);
    throw error;
  }
};

// GET TOKEN
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }

    return token;
  } catch (error) {
    console.error('GET TOKEN ERROR:', error);
    return null;
  }
};

// GET USER ID
export const getUserId = async () => {
  try {
    const savedId = await AsyncStorage.getItem('userId');

    if (savedId && savedId !== 'undefined' && savedId !== 'null') {
      return savedId;
    }

    const user = await getUser();
    const userId = user?.id || user?._id || user?.userId;

    return userId ? String(userId) : null;
  } catch (error) {
    console.error('GET USER ID ERROR:', error);
    return null;
  }
};

// GET LOGGED-IN USER
export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');

    if (!userData || userData === 'undefined' || userData === 'null') {
      return null;
    }

    return JSON.parse(userData);
  } catch (error) {
    console.error('GET USER ERROR:', error);
    return null;
  }
};

// CLEAR LOGIN DATA
export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'user', 'userId']);
  } catch (error) {
    console.error('CLEAR AUTH ERROR:', error);
    throw error;
  }
};

// CHECK LOGIN STATUS
export const isLoggedIn = async () => {
  const token = await getToken();
  return Boolean(token);
};
