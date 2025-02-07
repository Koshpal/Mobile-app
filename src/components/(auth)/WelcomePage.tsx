import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import welcomePage from "../../assets/welcomePage.png";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type WelcomePageProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};
const WelcomePage: React.FC<WelcomePageProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>You are ready to go!</Text>

            {/* Replace source with your actual image */}
            <Image source={welcomePage} style={styles.image} />

            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appName}>Koshpal</Text>

            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.replace('Home');
            }}>
                <Text style={styles.buttonText}>Done</Text>
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
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        color: "#1E3A8A",
        fontWeight: "bold",
    },
    appName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#3B5CCC",
        paddingVertical: 14,
        width: "80%",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default WelcomePage;
