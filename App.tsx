import React, {useEffect, useState} from 'react';
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

type Message = {
  messageBody: string;
  senderPhoneNumber: string;
  timestamp: string;
};

const App: React.FC = () => {
  const [receiveSmsPermission, setReceiveSmsPermission] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  const requestPermissions = async (): Promise<void> => {
    try {
      // Request both SMS and notification permissions
      const permissions = [
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);

      // Check if both permissions are granted
      const allGranted = Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (allGranted && Platform.OS === 'android') {
        setReceiveSmsPermission(PermissionsAndroid.RESULTS.GRANTED);
        // Start the service only after both permissions are granted
        try {
          const {SmsListenerModule} = NativeModules;
          await SmsListenerModule.startBackgroundService();
          console.log('Background service started successfully');
        } catch (serviceError) {
          console.error('Error starting background service:', serviceError);
        }
      } else {
        console.log('Some permissions were denied');
        setReceiveSmsPermission(PermissionsAndroid.RESULTS.DENIED);
      }
    } catch (err) {
      console.error('Permission error:', err);
      setReceiveSmsPermission(PermissionsAndroid.RESULTS.DENIED);
    }
  };

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

  const loadMessages = async (): Promise<void> => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        const sortedMessages = parsedMessages.sort(
          (a: Message, b: Message) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        setMessages(sortedMessages);
      }
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        loadMessages();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  // Initial setup
  useEffect(() => {
    const initializeApp = async () => {
      await requestPermissions();
      await loadMessages();
    };

    initializeApp();
  }, []);

  // SMS listener setup
  useEffect(() => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      const subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        (message: string) => {
          try {
            const parsedMessage = JSON.parse(message);
            const newMessage: Message = {
              messageBody: parsedMessage.messageBody,
              senderPhoneNumber: parsedMessage.senderPhoneNumber,
              timestamp: new Date(parsedMessage.timestamp).toISOString(),
            };

            saveMessages([newMessage]);
          } catch (err) {
            console.error('Error processing message:', err);
          }
        },
      );

      return () => {
        subscriber.remove();
      };
    }
  }, [receiveSmsPermission]);

  const renderItem = ({item}: {item: Message}) => (
    <View style={styles.messageContainer}>
      <Text style={styles.senderText}>{item.senderPhoneNumber}</Text>
      <Text style={styles.messageText}>{item.messageBody}</Text>
      <Text style={styles.timestampText}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <Text style={styles.noMessagesText}>No messages yet!</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>SMS Inbox</Text>
        {receiveSmsPermission !== PermissionsAndroid.RESULTS.GRANTED && (
          <Text style={styles.permissionText}>
            SMS and notification permissions are required
          </Text>
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
  );
};

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
});

export default App;
