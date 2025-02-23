import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ progress, total }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress}%` }]}>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
        <Text style={styles.totalText}>₹{total.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  progressBackground: {
    height: 20,
    backgroundColor: '#D0E3FF',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E3D9E',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  progressText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalText: {
    position: 'absolute',
    right: 10,
    color: '#0D1F3C',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

export default function App() {
  return <ProgressBar progress={30} total={20000} />;
}
