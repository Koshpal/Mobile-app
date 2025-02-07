import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import Preloader from './src/components/Preloader';
import { PermissionsAndroid, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSmsPermission, setNotificationPermission } from './src/store/slices/permissionSlice';
import { RootState } from './src/store';
import socketConnection from './src/socket';

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const permissions = useSelector((state: RootState) => state.permissions);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        // Request SMS permission
        const smsResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: 'SMS Permission',
            message: 'This app needs access to read SMS messages.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        dispatch(setSmsPermission(smsResult === PermissionsAndroid.RESULTS.GRANTED));

        // Request notification permission
        const notificationResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs to send notifications.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        dispatch(setNotificationPermission(notificationResult === PermissionsAndroid.RESULTS.GRANTED));
      }
    } catch (err) {
      console.error('Permission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestPermissions();
    socketConnection();
  }, []);

  if (isLoading) {
    return <Preloader message="Setting up..." />;
  }

  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
};

export default AppWrapper;