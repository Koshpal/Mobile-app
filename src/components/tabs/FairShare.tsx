import React from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Card, Avatar, Button } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import Icons from '../../utils/Icons';

const screenWidth = Dimensions.get('window').width;

const FairShare = () => {
    const pieChartData = [
        { name: 'Category 1', population: 40, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Category 2', population: 30, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Category 3', population: 20, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Category 4', population: 10, color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    ];

    return (
        <ScrollView style={{ padding: 15, backgroundColor: '#EEF2FF' }}>
            {/* Members List */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 15 }}>
                {['Parth', 'Mudit', 'Shreedhar', 'Hardik', 'Bhavik'].map((name, index) => (
                    <Card
                        key={index}
                        style={{
                            backgroundColor: index % 2 === 0 ? '#0A1E58' : '#4C6EB1',
                            padding: 10,
                            marginBottom: 10,
                            width: '30%',
                            borderRadius: '20%',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: '#FFF', fontSize: 16 }}>{name}</Text>
                        <Text style={{ color: '#FFF', fontSize: 14, textAlign: 'center' }}>₹{Math.floor(Math.random() * 100)}</Text>
                    </Card>
                ))}
            </View>
            <View style={{ height: 1, backgroundColor: 'black', marginVertical: 10 }} />

            {/* Tabs */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <Button
                    mode="contained"
                    style={{ borderRadius: 20, backgroundColor: '#FFF', flex: 1, marginRight: 5 }}
                    labelStyle={{ color: '#000' }}
                >
                    Sphinx 24
                </Button>

                <Button mode="contained" style={{ borderRadius: 20, backgroundColor: '#0A1E58', flex: 1, marginRight: 5 }}>
                    Bombay
                </Button>
                <Image source={Icons.Add} style={{ backgroundColor: '#FFF' }} />
            </View>

            <View style={{ height: 1, backgroundColor: 'black', marginVertical: 10 }} />
            {/* Stats Section */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Card style={styles.cardLarge}>
                    <Text style={styles.cardTitle}>Total Spent</Text>
                    <PieChart
                        data={pieChartData}
                        width={screenWidth / 2 - 25}
                        height={120}
                        chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="10"
                        absolute
                        hasLegend={false}
                    />
                    <Text style={styles.amount}>₹92</Text>
                </Card>

                <Card style={styles.cardSmall}>
                    <Text style={styles.cardTitle}>Members</Text>
                    <Text  style={{ fontSize: 40, textAlign: 'center' }}>9</Text>
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Your Activities</Text>
                    <Text style={styles.subText}>Last 3 Days</Text>
                    <Text style={styles.amount}>₹23,57</Text>
                    <Text style={styles.amountSmall}>₹21</Text>
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Debts</Text>
                    <Text style={{ fontSize: 40, textAlign: 'center' }}>7</Text>
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Total Spent</Text>
                    <Text style={styles.subText}>97 expenses</Text>
                    <Text style={styles.amount}>₹97</Text>
                </Card>
            </View>

            {/* Add New Member Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 30 }}>
                <TouchableOpacity style={styles.addMemberButton}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 5 }}>New Member</Text>
                    <Image source={Icons.Add} style={{ backgroundColor: '#FFF' }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addMemberButton}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 5 }}>New Member</Text>
                    <Image source={Icons.Add} style={{ backgroundColor: '#FFF' }} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        width: '48%',
        padding: 15,
        marginBottom: 10,
        borderRadius: 15,
    },
    cardLarge: {
        backgroundColor: '#FFF',
        width: '60%',
        padding: 15,
        marginBottom: 10,
        borderRadius: 15,
    },
    cardSmall: {
        backgroundColor: '#FFF',
        width: '38%',
        padding: 20,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: 12,
        color: '#888',
    },
    amount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0A1E58',
        marginTop: 5,
    },
    amountSmall: {
        fontSize: 14,
        color: '#333',
    },
    addMemberButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 20,
        width: '48%',
        justifyContent: 'center',
    },
});

export default FairShare;
