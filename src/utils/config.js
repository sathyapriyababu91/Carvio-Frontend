import { Platform } from 'react-native';

// ONE place for the backend address. Change it here and every screen
// that imports API_URL follows.
//
//  - Web / iOS simulator ........ http://localhost:8080
//  - Android emulator ........... http://10.0.2.2:8080
//  - Real phone (same Wi-Fi) .... http://<laptop-ip>:8080  (e.g. http://192.168.1.5:8080)
//  - Play Store build ........... https://<your-deployed-backend>
//    (Android release builds block plain http, so production must be https)

// Local development address (used only while developing)
const LOCAL_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

// Set this to your deployed backend (https) before making a release build.
// Example: 'https://carvio-api.onrender.com'
const PRODUCTION_API_URL = 'https://carvio-backend.onrender.com';

// __DEV__ is true while developing and false in a release build
const baseUrl = __DEV__ ? LOCAL_API_URL : PRODUCTION_API_URL;

if (!__DEV__ && !PRODUCTION_API_URL) {
  console.warn(
    'PRODUCTION_API_URL is empty. Set the deployed backend URL in utils/config.js.'
  );
}

// Remove a trailing slash so `${API_URL}/auth/...` never becomes `//auth/...`
export const API_URL = baseUrl.replace(/\/+$/, '');