import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    Platform,
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

// Constants
const API_BASE_URL = 'http://192.168.223.106:8082';
const PHONE_NUMBER = '9314635933';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [summary, setSummary] = useState({
        totalExpenses: 0,
        credit: 0,
        debit: 0,
    });
    const [error, setError] = useState(null);

    // Create axios instance
    const api = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Fetch transactions from server
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.post(`/transaction/all`, {
                phoneNumber: PHONE_NUMBER,
            });
            const data = response.data;
            
            // Process transactions with better error handling
            const processedTransactions = data.map(transaction => {
                let parsedAmount = 0;
                if (transaction.amount) {
                    try {
                        parsedAmount = parseFloat(transaction.amount.toString().replace(/[^0-9.-]+/g, ''));
                        if (isNaN(parsedAmount)) parsedAmount = 0;
                    } catch (e) {
                        console.warn('Error parsing amount:', e);
                        parsedAmount = 0;
                    }
                }

                return {
                    id: transaction.id || Math.random().toString(),
                    name: transaction.description || 'Unknown',
                    amount: parsedAmount,
                    type: transaction.type || 'unknown',
                    category: transaction.category || 'Other',
                    timestamp: new Date(transaction.createdAt || Date.now()),
                    paymentMode: transaction.paymentMode || 'Cash',
                    phoneNumber: PHONE_NUMBER,
                };
            }).sort((a, b) => b.timestamp - a.timestamp);

            // Filter transactions by selected date if any
            const filteredByDate = selectedDate ? processedTransactions.filter(transaction => {
                const transactionDate = new Date(transaction.timestamp);
                return (
                    transactionDate.getDate() === selectedDate.getDate() &&
                    transactionDate.getMonth() === selectedDate.getMonth() &&
                    transactionDate.getFullYear() === selectedDate.getFullYear()
                );
            }) : processedTransactions;

            // Calculate summary based on filtered transactions
            const summary = filteredByDate.reduce(
                (acc, curr) => {
                    const amount = Math.abs(curr.amount || 0);
                    if (curr.type === 'credited') {
                        acc.credit += amount;
                    } else {
                        acc.debit += amount;
                    }
                    acc.totalExpenses = acc.credit + acc.debit;
                    return acc;
                },
                { totalExpenses: 0, credit: 0, debit: 0 }
            );

            setTransactions(filteredByDate);
            setSummary(summary);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error.response?.data?.message || 'Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    // Handle date change
    const onDateChange = (event, date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        
        if (date) {
            setSelectedDate(date);
        }
    };

    // Effect for initial load and periodic refresh
    useEffect(() => {
        fetchTransactions();
        const refreshInterval = setInterval(fetchTransactions, 30000);
        return () => clearInterval(refreshInterval);
    }, [selectedDate]); // Re-run when selected date changes

    // Filter transactions based on search
    const filteredTransactions = transactions.filter(transaction => {
        if (searchQuery) {
            return transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    // Render transaction item
    const renderTransaction = ({ item }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
                <Text style={styles.transactionName}>{item.name}</Text>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTime}>
                        {format(item.timestamp, 'hh:mm a')}
                    </Text>
                    <Text style={styles.phoneNumber}>{PHONE_NUMBER}</Text>
                </View>
            </View>

            <View style={styles.transactionMiddle}>
                <View style={styles.paymentMode}>
                    {/* <Icon name="cash" size={20} color="#333" /> */}
                    <Text style={styles.paymentModeText}>{item.paymentMode}</Text>
                </View>
                <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) }]}>
                    {/* <Icon name={getCategoryIcon(item.category)} size={20} color="#fff" /> */}
                </View>
                <Text style={styles.categoryText}>{item.category}</Text>
            </View>

            <Text style={[styles.amount, { color: item.type === 'credited' ? '#4CAF50' : '#2196F3' }]}>
                {item.type === 'credited' ? '+' : ''}{item.amount.toFixed(2)}
            </Text>
        </View>
    );

    if (loading && transactions.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton} 
                    onPress={fetchTransactions}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Summary Section */}
            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Expenses</Text>
                        <Text style={styles.summaryAmount}>₹{summary.totalExpenses.toFixed(0)}</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.summaryItem}>
                        <View style={styles.summaryLabelRow}>
                            <Text style={[styles.summaryLabel, { color: '#4CAF50' }]}>Credit</Text>
                        </View>
                        <Text style={[styles.summaryAmount, { color: '#4CAF50' }]}>
                            ₹{summary.credit.toFixed(0)}
                        </Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.summaryItem}>
                        <View style={styles.summaryLabelRow}>
                            <Text style={[styles.summaryLabel, { color: '#2196F3' }]}>Debit</Text>
                        </View>
                        <Text style={[styles.summaryAmount, { color: '#2196F3' }]}>
                            ₹{summary.debit.toFixed(0)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search customer"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.calendarButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    onDismiss={() => setShowDatePicker(false)}
                />
            )}

            {/* Selected Date Display */}
            {selectedDate && (
                <View style={styles.selectedDateContainer}>
                    <Text style={styles.selectedDateText}>
                        Showing transactions for {format(selectedDate, 'MMMM dd, yyyy')}
                    </Text>
                    <TouchableOpacity 
                        style={styles.clearDateButton}
                        onPress={() => {
                            setSelectedDate(null);
                            setShowDatePicker(false);
                        }}
                    >
                        <Text style={styles.clearDateText}>×</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Transactions List */}
            <FlatList
                data={filteredTransactions}
                renderItem={renderTransaction}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.transactionsList}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery
                                ? 'No transactions matching your search'
                                : selectedDate
                                ? 'No transactions for selected date'
                                : 'No transactions yet'}
                        </Text>
                    </View>
                )}
            />

            {/* Add Transaction Button */}
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

// Helper functions for category icons and colors
const getCategoryIcon = (category) => {
    const icons = {
        Toiletries: 'toilet',
        Food: 'food',
        Transport: 'car',
        Shopping: 'shopping',
        Bills: 'file-document',
        Other: 'dots-horizontal',
    };
    return icons[category] || 'dots-horizontal';
};

const getCategoryColor = (category) => {
    const colors = {
        Toiletries: '#4CAF50',
        Food: '#FF9800',
        Transport: '#2196F3',
        Shopping: '#9C27B0',
        Bills: '#F44336',
        Other: '#607D8B',
    };
    return colors[category] || '#607D8B';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summary: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'flex-start',
    },
    summaryLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#1a237e',
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a237e',
    },
    verticalDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#e0e0e0',
        marginHorizontal: 16,
    },
    dateNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f7ff',
        padding: 12,
        marginVertical: 8,
        borderRadius: 25,
        marginHorizontal: 16,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1a237e',
    },
    dateNavArrow: {
        fontSize: 20,
        color: '#1a237e',
        paddingHorizontal: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f7ff',
        borderRadius: 25,
        paddingHorizontal: 16,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1a237e',
        paddingVertical: 8,
    },
    calendarButton: {
        width: 40,
        height: 40,
        backgroundColor: '#f5f7ff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarIcon: {
        fontSize: 20,
    },
    transactionsList: {
        padding: 8,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    transactionLeft: {
        flex: 1,
    },
    transactionName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    transactionTime: {
        fontSize: 14,
        color: '#666',
    },
    transactionMiddle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    paymentMode: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    paymentModeText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
    categoryIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
    },
    amount: {
        fontSize: 16,
        fontWeight: '500',
    },
    addButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6200ee',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        color: '#f44336',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#6200ee',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    refreshIndicator: {
        height: 2,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    transactionDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phoneNumber: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
    summaryHeader: {
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 8,
    },
    phoneNumberHeader: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
    },
    summaryContent: {
        flexDirection: 'row',
    },
    selectedDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f5f7ff',
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    selectedDateText: {
        color: '#1a237e',
        fontSize: 14,
        fontWeight: '500',
    },
    clearDateButton: {
        padding: 4,
    },
    clearDateText: {
        color: '#666',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Transactions;
