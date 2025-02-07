import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

interface PreloaderProps {
  message?: string;
}

const Preloader: React.FC<PreloaderProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
});

export default Preloader; 