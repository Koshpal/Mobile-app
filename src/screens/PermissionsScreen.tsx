import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setSmsPermission, setNotificationPermission } from '../store/slices/permissionSlice';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type PermissionsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Permissions'>;

const PermissionsScreen = () => {
  const navigation = useNavigation<PermissionsScreenNavigationProp>();
  const dispatch = useDispatch();

  const requestPermissions = async () => {
    try {
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

      console.log(smsResult, notificationResult);
      // Navigate to Home if both permissions are granted
      if (smsResult === PermissionsAndroid.RESULTS.GRANTED &&
        notificationResult === PermissionsAndroid.RESULTS.GRANTED) {
        navigation.replace('MainTabs');
      }
    } catch (err) {
      console.error('Permission error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions Required</Text>
      <Text style={styles.description}>
        This app needs SMS and notification permissions to function properly.
      </Text>
      <TouchableOpacity style={styles.button} onPress={requestPermissions}>
        <Text style={styles.buttonText}>Grant Permissions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PermissionsScreen; 