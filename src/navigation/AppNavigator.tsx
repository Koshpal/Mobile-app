import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../components/tabs/HomeScreen';
import VisualInsights from '../components/VisualInsights';
import Login from '../components/(auth)/Login';
import PhoneNumberPage from '../components/(auth)/PhoneNumberPage';
import OtpPage from '../components/(auth)/OtpPage';
import WelcomePage from '../components/(auth)/WelcomePage';
import PermissionsScreen from '../screens/PermissionsScreen';
import Investment from '../components/tabs/Investment';

// Define Root Stack Navigation Params
export type RootStackParamList = {
    Login: undefined;
    PhoneNumberPage: undefined;
    OtpPage: undefined;
    WelcomePage: undefined;
    MainTabs: undefined; // Tabs are wrapped in a single screen
    VisualInsights: undefined;
    Permissions: undefined;
};

// Define Bottom Tab Navigation Params
export type TabParamList = {
    Home: undefined;
    Investment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Bottom Tab Navigator
const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ headerShown: false }}
                />
            <Tab.Screen name="Investment" component={Investment} />
        </Tab.Navigator>
    );
};

// Stack Navigator
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PhoneNumberPage"
                    component={PhoneNumberPage}
                    options={{ headerShown: true, title: '' }}
                />
                <Stack.Screen
                    name="OtpPage"
                    component={OtpPage}
                    options={{ headerShown: true, title: '' }}
                />
                <Stack.Screen
                    name="WelcomePage"
                    component={WelcomePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator} // Wrapping tabs inside stack
                    options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                    name="VisualInsights"
                    component={VisualInsights}
                    options={{ title: 'Insights' }}
                />
                <Stack.Screen
                    name="Permissions"
                    component={PermissionsScreen}
                    options={{ headerShown: false, gestureEnabled: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
