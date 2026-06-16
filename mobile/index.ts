import { AppRegistry } from 'react-native';

import { registerBackgroundMessageHandler } from '@/features/push-notifications/services/fcm.service';

import App from './App';
import { name as appName } from './app.json';

registerBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
