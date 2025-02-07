import React, { useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import phonePage from "../../assets/phonePage.png";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";

type PhoneNumberPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const PhoneNumberPage: React.FC<PhoneNumberPageProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const handleSendOTPBtn = () => {
    // Send OTP logic here
    if (phoneNumber.length == 10) {
      // Save phone number to async storage
      AsyncStorage.setItem('phoneNumber', phoneNumber);
      navigation.navigate('OtpPage');
    } else {
      // toast enter valid phone number
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Please enter a valid 10-digit phone number',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup/Login</Text>
      <Image source={phonePage} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="+91"
        keyboardType="numeric"
        maxLength={10}
        onChangeText={(text) => {
          if (/^\d*$/.test(text)) {
            setPhoneNumber(text); // Ensure you have a state variable like const [phoneNumber, setPhoneNumber] = useState("");
          }
        }}
        value={phoneNumber} // Bind the value to state
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOTPBtn}>
        <Text style={styles.buttonText}>Send OTP</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#3B5998",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default PhoneNumberPage;
