import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface Expense {
    id: string;
    name: string;
    amount: number;
    date: string; // formatted as YYYY-MM-DD
}

interface Day {
    formatted: string;
    fullDate: string; // formatted as YYYY-MM-DD
}

const ExpenseTracker: React.FC = () => {
    const [lastSevenDays, setLastSevenDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

    // Sample expenses data
    const expenses: Expense[] = [
        { id: '1', name: 'Tea', amount: -50, date: '2025-02-16' },
        // { id: '2', name: 'fuel', amount: -200, date: '2025-02-16' },
        { id: '3', name: 'fruits', amount: -150, date: '2025-02-16' },
        
        { id: '4', name: 'coffee', amount: -50, date: '2025-02-17' },
        { id: '5', name: 'fuel', amount: -200, date: '2025-02-17' },
        { id: '6', name: 'vegs', amount: -150, date: '2025-02-17' },

        { id: '7', name: 'coffee', amount: -50, date: '2025-02-18' },
        { id: '8', name: 'fuel', amount: -200, date: '2025-02-18' },
        { id: '9', name: 'fruit', amount: -150, date: '2025-02-18' },

        { id: '10', name: 'coffee', amount: -50, date: '2025-02-19' },
        { id: '11', name: 'fuel', amount: -200, date: '2025-02-19' },
        { id: '12', name: 'fruit', amount: -150, date: '2025-02-19' },

        // { id: '13', name: 'coffee', amount: -50, date: '2025-02-20' },
        { id: '14', name: 'fuel', amount: -200, date: '2025-02-20' },
        { id: '15', name: 'fruit', amount: -150, date: '2025-02-20' },

        { id: '16', name: 'coffee', amount: -50, date: '2025-02-21' },
        { id: '17', name: 'fuel', amount: -200, date: '2025-02-21' },
        { id: '18', name: 'fruit', amount: -150, date: '2025-02-21' },

        // { id: '19', name: 'coffee', amount: -50, date: '2025-02-21' },
        // { id: '20', name: 'fuel', amount: -200, date: '2025-02-21' },
        // { id: '21', name: 'fruit', amount: -150, date: '2025-02-21' },

        // { id: '22', name: 'coffee', amount: -50, date: '2025-02-22' },
        { id: '25', name: 'subway', amount: -250, date: '2025-02-22' },
        // { id: '23', name: 'fuel', amount: -200, date: '2025-02-22' },
        // { id: '24', name: 'fruit', amount: -150, date: '2025-02-22' },
        { id: '26', name: 'dinner', amount: -400, date: '2025-02-22' },

        { id: '27', name: 'coffee', amount: -50, date: '2025-02-23' },
        { id: '28', name: 'subway', amount: -250, date: '2025-02-23' },
        { id: '29', name: 'fuel', amount: -200, date: '2025-02-23' },
        { id: '30', name: 'fruit', amount: -150, date: '2025-02-23' },
        { id: '31', name: 'dinner', amount: -400, date: '2025-02-23' },
    ];

    // Function to generate last 7 days
    const getLastSevenDays = (): Day[] => {
        const days: Day[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                formatted: `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`,
                fullDate: date.toISOString().split('T')[0],
            });
        }
        return days;
    };

    useEffect(() => {
        const dates = getLastSevenDays();
        setLastSevenDays(dates);

        // Default to the latest day
        const latestDate = dates[dates.length - 1].fullDate;
        setSelectedDate(latestDate);

        // Show expenses for the latest date by default
        setFilteredExpenses(expenses.filter(expense => expense.date === latestDate));
    }, []);

    // Handle date selection
    const handleDatePress = (date: string) => {
        // console.log('Selected date:', date);
        setSelectedDate(date);
        setFilteredExpenses(expenses.filter(expense => expense.date === date));
    };

    return (
        <View style={styles.container}>
            {/* Date Row */}
            <View style={styles.dateRow}>
                {lastSevenDays.map((date, index) => (
                    <TouchableOpacity key={index} onPress={() => handleDatePress(date.fullDate)}>
                        <Text style={[styles.dateItem, selectedDate === date.fullDate && styles.selectedDate]}>
                            {date.formatted}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Expense List */}
            <FlatList
                data={filteredExpenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                        <View style={styles.circle} />
                        <Text style={styles.expenseName}>{item.name}</Text>
                        <Text style={styles.expenseAmountItem}>{item.amount}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex : 1},
    dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    dateItem: { fontSize: 14, color: '#333', padding: 2 },
    selectedDate: { fontWeight: 'bold', color: 'blue' },
    expenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    circle: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'black', marginRight: 10 },
    expenseName: { flex: 1, fontSize: 16 },
    expenseAmountItem: { fontSize: 16, fontWeight: 'bold' },
});

export default ExpenseTracker;
