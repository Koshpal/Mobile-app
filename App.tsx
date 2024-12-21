import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  StyleSheet,
  FlatList,
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

  const requestSmsPermission = async (): Promise<void> => {
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      setReceiveSmsPermission(permission);
    } catch (err) {
      console.error('Permission error:', err);
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
        setMessages(JSON.parse(storedMessages));
      }
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  useEffect(() => {
    requestSmsPermission();
    loadMessages();
  }, []);

  useEffect(() => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      const subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        (message: string) => {
          const {messageBody, senderPhoneNumber} = JSON.parse(message);
          const timestamp = new Date().toISOString();

          const newMessage: Message = {
            messageBody,
            senderPhoneNumber,
            timestamp,
          };

          saveMessages([newMessage]);
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Received Messages</Text>
      {messages.length === 0 ? (
        <Text style={styles.noMessagesText}>No messages yet!</Text>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  noMessagesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  messageContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  senderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007BFF',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default App;
