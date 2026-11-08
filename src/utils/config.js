import { Platform } from 'react-native';

// ONE place for the backend address. Change it here and every screen
// that imports API_URL follows.
//
//  - Web / iOS simulator ........ http://localhost:8080
//  - Android emulator ........... http://10.0.2.2:8080
//  - Real phone (same Wi-Fi) .... http://<laptop-ip>:8080  (e.g. http://192.168.1.5:8080)
//  - Play Store build ........... https://<your-deployed-backend>
//    (Android release builds block plain http, so production must be https)
const LOCAL_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export const API_URL = LOCAL_API_URL;