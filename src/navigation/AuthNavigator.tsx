import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GoogleSignIn from '../auth/GoogleSignIn';
import PhoneNumber from '../auth/PhoneNumber';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="GoogleSignIn" component={GoogleSignIn} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 