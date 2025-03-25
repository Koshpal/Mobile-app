import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Button, Icon } from "react-native-elements";

// import g1 from '../assets/g1.png';
// import g2 from '../assets/g2.png';
// import g3 from '../assets/g3.png';
import Star from '../assets/Star.png'
import meet from '../assets/meet.png'

const advisors = [
    {
        id: "1",
        name: "Dev",
        specialization: "Nadi",
        rating: "4.8",
        image: require("../assets/g1.png"),
    },
    {
        id: "2",
        name: "Sandesh",
        specialization: "Vedic, Nadi",
        rating: "4.8",
        image: require("../assets/g2.png"),
    },
    {
        id: "3",
        name: "Esther Howard",
        specialization: "Prashan",
        rating: "4.8",
        image: require("../assets/g3.png"),
    },
];

const BookSession = () => {
    return (
        <View style={styles.container}>
            {/* Appointment Steps */}
            <View style={styles.progressContainer}>
                {/* <Text style={styles.step}>Appointment Reserved</Text>
                <Text style={styles.step}>Assessment</Text>
                <Text style={styles.step}>Appointment Confirmed</Text> */}
            </View>

            {/* Appointment Details */}
            <View style={styles.appointmentCard}>
                <Image source={meet}/>
                <Text style={styles.appointmentText}>12 March | 02:00 PM</Text>
                <Text style={styles.confirmedText}>Confirmed</Text>
            </View>

            {/* Rebook Slot */}
            {/* <Text style={styles.sectionTitle}>Rebook your slot</Text>
            <View style={styles.disabledBox} /> */}

            {/* Chat with Advisors */}
            <Text style={styles.sectionTitle}>Chat with Advisors</Text>
            <FlatList
                data={advisors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.advisorCard}>
                        <Avatar rounded size="medium" source={item.image} />
                        <View style={styles.advisorInfo}>
                            <Text style={styles.advisorName}>{item.name}</Text>
                            <Text style={styles.advisorSpecialization}>{item.specialization}</Text>
                            <View style={styles.ratingContainer}>
                                <Image source={Star}/>
                                <Text style={styles.ratingText}>{item.rating}</Text>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <Button title="Appointment" type="outline" buttonStyle={styles.appointmentButton} />
                            {/* <TouchableOpacity>
                                <Icon name="chat-bubble-outline" type="material" size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="favorite-border" type="material" size={24} />
                            </TouchableOpacity> */}
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E7F1FF", padding: 16 },
    statusBar: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    statusText: { fontSize: 16, fontWeight: "bold" },
    progressContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    step: { fontSize: 14, color: "gray" },
    appointmentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E0E0E0",
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
    },
    appointmentText: { flex: 1, marginLeft: 8, fontSize: 14 },
    confirmedText: { color: "green", fontWeight: "bold" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
    disabledBox: { backgroundColor: "#E0E0E0", height: 40, borderRadius: 10, marginBottom: 16 },
    advisorCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    advisorInfo: { flex: 1, marginLeft: 12 },
    advisorName: { fontSize: 16, fontWeight: "bold" },
    advisorSpecialization: { fontSize: 14, color: "gray" },
    ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    ratingText: { fontSize: 14, marginLeft: 4 },
    actionButtons: { flexDirection: "row", alignItems: "center", gap: 8 },
    appointmentButton: { borderColor: "gray", borderRadius: 8, paddingHorizontal: 12 },
});

export default BookSession;
