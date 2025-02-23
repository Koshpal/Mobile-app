import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View } from 'react-native';
import VisualInsights from '../components/tabs/VisualInsights';
import Login from '../components/(auth)/Login';
import PhoneNumberPage from '../components/(auth)/PhoneNumberPage';
import OtpPage from '../components/(auth)/OtpPage';
import WelcomePage from '../components/(auth)/WelcomePage';
import PermissionsScreen from '../screens/PermissionsScreen';
import Investment from '../components/tabs/Investment';
import FairShare from '../components/tabs/FairShare';
import Monitoring from '../components/tabs/Monitoring';
import Icons from '../utils/Icons';
import Home from '../components/tabs/Home';
import ViewBankSms from '../screens/ViewBankSms';
import PandingTransactions from '../screens/PandingTransactions';
import Categories from '../screens/Insights/Categories';

// Define Root Stack Navigation Params
export type RootStackParamList = {
    Login: undefined;
    PhoneNumberPage: undefined;
    OtpPage: undefined;
    WelcomePage: undefined;
    MainTabs: undefined; // Tabs are wrapped in a single screen
    VisualInsights: undefined;
    Permissions: undefined;
    ViewBankSms: undefined;
    PandingTransactions: undefined;
    Categories: undefined;
};

// Define Bottom Tab Navigation Params
export type TabParamList = {
    Home: undefined;
    Investment: undefined;
    VisualInsights: undefined;
    FairShare: undefined;
    Monitoring: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Bottom Tab Navigator
const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconSource;
                    let tabName = route.name;

                    if (route.name === "Home") {
                        iconSource = Icons.Home;
                    } else if (route.name === "VisualInsights") {
                        iconSource = Icons.Insights;
                    } else if (route.name === "FairShare") {
                        iconSource = Icons.FairShare;
                    } else if (route.name === "Monitoring") {
                        iconSource = Icons.Monitoring;
                    } else if (route.name === "Investment") {
                        iconSource = Icons.Investment;
                    }

                    return (
                        <View style={{
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignContent: 'center'
                        }}>
                            <Image
                                source={iconSource}
                                style={{
                                    width: focused ? 22 : 20,
                                    height: focused ? 22 : 20,
                                    tintColor: focused ? "#007AFF" : "#000000",
                                    marginLeft: 5,
                                    marginRight: 5
                                }}
                            />
                            {/* <Text>{tabName}</Text> */}
                        </View>
                    );
                },
                tabBarShowLabel: false, // Hide text labels
                tabBarStyle: { backgroundColor: '#fff' }, // Customize tab bar style
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="VisualInsights"
                component={VisualInsights}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="FairShare"
                component={FairShare}
                options={{
                    headerShown: false,
                }}
            />
            {/* <Tab.Screen
                name="Monitoring"
                component={Monitoring}
            /> */}
            <Tab.Screen
                name="Investment"
                component={Investment}
                options={{
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

// Stack Navigator
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                }}
            >
                <Stack.Screen 
                    name="Login" 
                    component={Login} 
                />
                <Stack.Screen 
                    name="PhoneNumberPage" 
                    component={PhoneNumberPage}
                    options={{ 
                        headerShown: true, 
                        title: '',
                        gestureEnabled: true 
                    }}
                />
                <Stack.Screen 
                    name="OtpPage" 
                    component={OtpPage}
                    options={{ 
                        headerShown: true, 
                        title: '',
                        gestureEnabled: true 
                    }}
                />
                <Stack.Screen 
                    name="WelcomePage" 
                    component={WelcomePage} 
                />
                <Stack.Screen 
                    name="MainTabs" 
                    component={TabNavigator}
                    options={{ gestureEnabled: false }}
                />
                <Stack.Screen 
                    name="Permissions" 
                    component={PermissionsScreen}
                    options={{ gestureEnabled: false }}
                />
                <Stack.Screen 
                    name="PandingTransactions" 
                    component={PandingTransactions}
                    options={{ 
                        gestureEnabled: false ,
                        headerShown: true,
                    }}
                />
                <Stack.Screen 
                    name="Categories" 
                    component={Categories}
                    options={{ 
                        gestureEnabled: false ,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="ViewBankSms"
                    component={ViewBankSms}
                    options={{
                        headerShown: true,
                        headerTitle: 'Bank Messages',
                        // gestureEnabled: true,
                        // presentation: 'card'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
