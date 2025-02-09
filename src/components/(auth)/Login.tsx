import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import loginImage from "../../assets/loginImage.png";
import google from '../../assets/google.png';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhoneNumberPage'>;
};

const Login: React.FC<LoginProps> = ({ navigation }) => {

  useEffect(() => {
    const checkUser = async () => {
      const userPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      const isUserLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isUserLoggedIn && userPhoneNumber) {

        // because we are using a stack navigator, we need to navigate to the main tab navigator
        navigation.navigate("MainTabs");
      } else if (isUserLoggedIn && !userPhoneNumber) {
        navigation.navigate('PhoneNumberPage');
      }
    }
    checkUser();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Abroad</Text>
      <Image source={loginImage} style={styles.image} />
      <TouchableOpacity style={styles.googleButton}>
        <Image source={google} />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or</Text>
      <TouchableOpacity style={styles.phoneButton} onPress={() => navigation.navigate('PhoneNumberPage')}>
        <Text style={styles.phoneButtonText}>Continue with Phone Number</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    marginBottom: 10,
    cursor: "pointer",
  },
  googleButtonText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  phoneButton: {
    cursor: "pointer",
    backgroundColor: "#fff",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;