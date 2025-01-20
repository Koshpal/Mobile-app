import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  PermissionsAndroid,
  NativeModules,
  Platform,
  DeviceEventEmitter,
  StyleSheet,
  FlatList,
  AppState,
  AppStateStatus,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VisualInsights from './src/components/VisualInsights';
import { isBankSMS, extractAmount } from './src/constants/bank';



// main app component
const App: React.FC = () => {
  // state variables
  const [receiveSmsPermission, setReceiveSmsPermission] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  // state variables to track permission status
  const [permissionStatus, setPermissionStatus] = useState<{
    sms: boolean;
    notifications: boolean;
  }>({
    sms: false,
    notifications: false,
  });

  // function to request SMS permission
  const requestSMSPermission = async (): Promise<boolean> => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs access to read SMS messages.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        }
      );

      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      setPermissionStatus(prev => ({ ...prev, sms: granted }));
      console.log('SMS permission:', granted ? 'granted' : 'denied');
      return granted;
    } catch (err) {
      console.error('SMS permission error:', err);
      return false;
    }
  };

  // function to request notification permission
  const requestNotificationPermission = async (): Promise<boolean> => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs to send notifications for new messages.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        }
      );

      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      setPermissionStatus(prev => ({ ...prev, notifications: granted }));
      console.log('Notification permission:', granted ? 'granted' : 'denied');
      return granted;
    } catch (err) {
      console.error('Notification permission error:', err);
      return false;
    }
  };

  // function to request both SMS and notification permissions
  const requestPermissions = async (): Promise<void> => {
    try {
      const smsGranted = await requestSMSPermission();
      const notificationGranted = await requestNotificationPermission();

      if (smsGranted && notificationGranted && Platform.OS === 'android') {
        setReceiveSmsPermission(PermissionsAndroid.RESULTS.GRANTED);
        try {
          const { SmsListenerModule } = NativeModules;
          await SmsListenerModule.startBackgroundService();
          console.log('Background service started successfully');
        } catch (serviceError) {
          console.error('Error starting background service:', serviceError);
        }
      } else {
        setReceiveSmsPermission(PermissionsAndroid.RESULTS.DENIED);
      }
    } catch (err) {
      console.error('Permission error:', err);
      setReceiveSmsPermission(PermissionsAndroid.RESULTS.DENIED);
    }
  };

  // Add separate retry functions for each permission
  const retrySMSPermission = () => {
    requestSMSPermission();
  };

  const retryNotificationPermission = () => {
    requestNotificationPermission();
  };

  // function to save messages to AsyncStorage
  const saveMessages = async (newMessages: Message[]): Promise<void> => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      const parsedMessages: Message[] = storedMessages
        ? JSON.parse(storedMessages)
        : [];
      const updatedMessages = [...parsedMessages, ...newMessages].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
    } catch (err) {
      console.error('Storage error:', err);
    }
  };

  // function to load messages from AsyncStorage
  const loadMessages = async (): Promise<void> => {
    try {
      // Load messages from SharedPreferences
      const storedMessages = await NativeModules.SmsListenerModule.loadStoredMessages();
      const parsedMessages = JSON.parse(storedMessages);
      // Filter bank messages
      const bankMessages = parsedMessages.filter((msg: Message) =>
        isBankSMS(msg.messageBody, msg.senderPhoneNumber)
      );

      // Sort messages by timestamp
      const sortedMessages = bankMessages.sort(
        (a: Message, b: Message) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Update state
      setMessages(sortedMessages);

      // Also save to AsyncStorage for backup
      await AsyncStorage.setItem('messages', JSON.stringify(parsedMessages));

    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  // function to handle app state changes and load messages when app becomes active
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        loadMessages(); // Load messages whenever app becomes active
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  // function to initialize the app and request permissions
  useEffect(() => {
    const initializeApp = async () => {
      await requestPermissions();
      await loadMessages();
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function to setup SMS listener
  useEffect(() => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      const handleSMS = (message: string) => {
        try {
          const parsedMessage = JSON.parse(message);

          if (isBankSMS(parsedMessage.messageBody, parsedMessage.senderPhoneNumber)) {
            const amount = extractAmount(parsedMessage.messageBody) || '0';
            const newMessage: Message = {
              messageBody: parsedMessage.messageBody,
              senderPhoneNumber: parsedMessage.senderPhoneNumber,
              timestamp: new Date(parsedMessage.timestamp).toISOString(),
              amount: amount,
            };
            // console.log('Processing bank SMS:', newMessage);
            saveMessages([newMessage]);
          } else {
            console.log('SMS ignored - not a bank message');
          }
        } catch (err) {
          console.error('Error processing message:', err);
        }
      };

      // Listen for SMS events
      const subscriber = DeviceEventEmitter.addListener('onSMSReceived', handleSMS);

      // Check if app was launched with SMS data
      const checkLaunchData = async () => {
        try {
          const initialMessage = await NativeModules.SmsListenerModule.getInitialSmsData();
          if (initialMessage) {
            handleSMS(initialMessage);
          }
        } catch (err) {
          console.error('Error checking launch data:', err);
        }
      };

      checkLaunchData();

      return () => {
        subscriber.remove();
      };
    }
  }, [receiveSmsPermission]);

  // function to render a message item
  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.senderText}>{item.senderPhoneNumber}</Text>
      <Text style={styles.messageText}>{item.messageBody}</Text>
      <Text style={styles.timestampText}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  // function to render an empty component
  const renderEmptyComponent = () => (
    <Text style={styles.noMessagesText}>No bank messages yet!</Text>
  );

  return (
    <>
      <VisualInsights />

      <SafeAreaView style={styles.container}>


        <View style={styles.header}>
          <Text style={styles.titleText}>Bank SMS Inbox</Text>
          {receiveSmsPermission !== PermissionsAndroid.RESULTS.GRANTED && (
            <View>
              {!permissionStatus.sms && (
                <View>
                  <Text style={styles.permissionText}>
                    SMS permission is required
                  </Text>
                  <Text
                    style={styles.retryText}
                    onPress={retrySMSPermission}>
                    Tap to allow SMS permission
                  </Text>
                </View>
              )}
              {!permissionStatus.notifications && (
                <View>
                  <Text style={styles.permissionText}>
                    Notification permission is required
                  </Text>
                  <Text
                    style={styles.retryText}
                    onPress={retryNotificationPermission}>
                    Tap to allow notifications
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </>
  );
};

// styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  permissionText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  noMessagesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  messageContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  senderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 20,
  },
  timestampText: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'right',
  },
  retryText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default App;
