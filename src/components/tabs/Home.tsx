import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Icons from '../../utils/Icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ExpenseTracker from '../ExpenseTracker';

type HomeProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'PhoneNumberPage'>;
};


const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [userName, setUserName] = useState('Sankalp');
    const [totalDebited, setTotalDebited] = useState(23455);
    const [totalCredited, setTotalCredited] = useState(100);
    const [lastMonthExpenses, setLastMonthExpenses] = useState(3489);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>Hello, {userName}!</Text>
                    <Text style={styles.date}>{new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</Text>
                </View>
                <TouchableOpacity style={styles.notificationIcon} onPress={() => { navigation.push('PandingTransactions') }}>
                    <Image source={Icons.Bell} />
                </TouchableOpacity>
            </View>

            {/* Balance Section */}
            <View style={styles.balanceContainer}>
                <View>
                    <Text>Total balance spend</Text>
                    <Text style={styles.balanceAmount}>{totalDebited}</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.monthButton}>
                        <Text style={styles.monthButtonText}>This Month</Text>
                        <Image source={Icons.DownArrow}/>
                    </TouchableOpacity>
                </View>
            </View>



            {/* Expenses Section */}
            <View style={styles.expensesContainer}>
                <Text style={styles.expensesTitle}>Last Month Expenses</Text>
                <Text style={styles.expenseAmount}>{lastMonthExpenses}</Text>
            </View>

            <View style={{ height: 1, backgroundColor: 'black', marginVertical: 10 }} />

            <Text style={styles.expensesTitle}>Last Seven Days Expenses</Text>
            <ExpenseTracker />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5ECF6',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greetingContainer: {
        flexDirection: 'column',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    date: {
        color: '#888',
    },
    notificationIcon: {
        backgroundColor: '#DCE4F2',
        padding: 10,
        borderRadius: 30,
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // flex: 1,
        backgroundColor: '#DCE4F2',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    balanceText: {
        fontSize: 16,
        color: '#555',
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    monthButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#6C86B4',
        padding: 10,
        borderRadius: 5,
        gap : 5
    },
    monthButtonText: {
        color: '#000',
        // fontWeight: '',
    },
    expensesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50,
        height: 100,
    },
    expensesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    expenseAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dateItem: {
        color: '#555',
        fontSize: 12,
    },
    expenseItem: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    circle: {
        width: 20,
        height: 20,
        backgroundColor: '#000',
        borderRadius: 10,
        marginRight: 10,
    },
    expenseName: {
        flex: 1,
        fontSize: 16,
    },
    expenseAmountItem: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Home;
