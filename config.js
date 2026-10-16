// config.js
import { Platform } from 'react-native';

// Escolha conforme seu ambiente:
// - Web / iOS Simulator:  'http://localhost:3000'
// - Android Emulator:     'http://10.0.2.2:3000'
// - Celular físico:       'http://SEU_IP_LOCAL:3000'

const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000'
});

export default API_URL;