import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Clipboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from "react-native";
import OtpPage from "../../assets/optPage.png";
import Toast from "react-native-toast-message";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import asyncStorage from "@react-native-async-storage/async-storage";

type OtpPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};
const OTPPage: React.FC<OtpPageProps> = ({ navigation }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(30);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    setIsDisabled(otp.some((digit) => digit === ""));
  }, [otp]);

  const handleChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      setError("");
      if (text && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async () => {
    const clipboardText = await Clipboard.getString();
    if (/^\d{6}$/.test(clipboardText)) {
      setOtp(clipboardText.split(""));
      inputRefs.current[5]?.focus();
    } else {
      setError("Invalid OTP format");
    }
  };

  const handleVerify = () => {
    if (otp.join("") === "123456") {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "OTP Verified Successfully",
      });

      // Save user login status to async storage
      asyncStorage.setItem("isLoggedIn", "true");

      // remove everything from navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: "WelcomePage" }],
      });

    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Image source={OtpPage} style={styles.image} />

      <View style={styles.Optcontainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.verifyButton, isDisabled && styles.disabledButton]}
        onPress={handleVerify}
        disabled={isDisabled}
      >
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
        <Text style={[styles.resendText, timer > 0 && styles.disabledText]}>
          Resend OTP {timer > 0 ? `(${timer}s)` : ""}
        </Text>
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
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  Optcontainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  verifyButton: {
    backgroundColor: "#3B5CCC",
    paddingVertical: 12,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  verifyText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendText: {
    color: "#6B7280",
    marginTop: 10,
    fontSize: 16,
  },
  disabledText: {
    color: "#A0AEC0",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default OTPPage;