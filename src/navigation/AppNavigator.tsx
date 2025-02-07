import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import VisualInsights from '../components/VisualInsights';
import Login from '../components/(auth)/Login';
import PhoneNumberPage from '../components/(auth)/PhoneNumberPage';
import OtpPage from '../components/(auth)/OtpPage';
import WelcomePage from '../components/(auth)/WelcomePage';
import PermissionsScreen from '../screens/PermissionsScreen';

export type RootStackParamList = {
    Home: undefined;
    VisualInsights: undefined;
    Login: undefined;
    PhoneNumberPage: undefined;
    OtpPage: undefined;
    WelcomePage: undefined;
    Permissions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">

                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="PhoneNumberPage"
                    component={PhoneNumberPage}
                    options={{
                        headerShown: true,
                        title: ''
                    }}
                />

                <Stack.Screen
                    name="OtpPage"
                    component={OtpPage}
                    options={{
                        headerShown: true,
                        title: ''
                    }}
                />

                <Stack.Screen
                    name="WelcomePage"
                    component={WelcomePage}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen
                    name="VisualInsights"
                    component={VisualInsights}
                    options={{
                        title: 'Insights'
                    }}
                />
                <Stack.Screen
                    name="Permissions"
                    component={PermissionsScreen}
                    options={{
                        headerShown: false,
                        gestureEnabled: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator; 