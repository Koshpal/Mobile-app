import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'https://api.koshpal.tusharsukhwal.com';
const PHONE_NUMBER = '9314635933';

const AddTransaction = ({ navigation }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Other');
    const [type, setType] = useState('debited'); // default to debit

    const categories = [
        "Food & Dining",
        "Shopping",
        "Transportation",
        "Entertainment",
        "Bills & Utilities",
        "Health & Medical",
        "Travel",
        "Education",
        "Groceries",
        "Investment",
        "Salary",
        "Other Income",
        "Other Expenses"
    ];

    const handleSubmit = async () => {
        if (!amount || !description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            const parsedAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ''));
            if (isNaN(parsedAmount)) {
                Alert.alert('Error', 'Please enter a valid amount');
                return;
            }

            const transaction = {
                amount: parsedAmount,
                description,
                category,
                type,
                timestamp: new Date().getTime(),
                paymentMode: 'Manual',
                phoneNumber: PHONE_NUMBER,
                bank: 'Manual Entry'
            };

            const response = await axios.post(`${API_BASE_URL}/transaction/manual`, transaction);

            if (response.status === 200) {
                Alert.alert('Success', 'Transaction added successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.log('Full Axios Error:', JSON.stringify(error, null, 2));

            if (error.response) {
                console.log('Response Data:', error.response.data);
                console.log('Status:', error.response.status);
                console.log('Headers:', error.response.headers);
                Alert.alert('Error', error.response.data?.message || 'Server error occurred');
            } else if (error.request) {
                console.log('No response received:', error.request);
                Alert.alert('Error', 'No response from server. Check your network.');
            } else {
                console.log('Error setting up request:', error.message);
                Alert.alert('Error', error.message);
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Add New Transaction</Text>

                {/* Amount Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount*</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                        placeholderTextColor="#666"
                    />
                </View>

                {/* Description Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description*</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        multiline
                        numberOfLines={3}
                        placeholderTextColor="#666"
                    />
                </View>

                {/* Transaction Type */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Transaction Type</Text>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                type === 'debited' && styles.selectedType
                            ]}
                            onPress={() => setType('debited')}
                        >
                            <Text style={[
                                styles.typeText,
                                type === 'debited' && styles.selectedTypeText
                            ]}>Debit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                type === 'credited' && styles.selectedType
                            ]}
                            onPress={() => setType('credited')}
                        >
                            <Text style={[
                                styles.typeText,
                                type === 'credited' && styles.selectedTypeText
                            ]}>Credit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Category Selection */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Category</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryScroll}
                    >
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryButton,
                                    category === cat && styles.selectedCategory
                                ]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    category === cat && styles.selectedCategoryText
                                ]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Add Transaction</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    form: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#1a237e',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    typeContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    typeButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    selectedType: {
        backgroundColor: '#1a237e',
    },
    typeText: {
        fontSize: 16,
        color: '#1a237e',
    },
    selectedTypeText: {
        color: '#fff',
    },
    categoryScroll: {
        flexGrow: 0,
    },
    categoryButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedCategory: {
        backgroundColor: '#1a237e',
        borderColor: '#1a237e',
    },
    categoryText: {
        fontSize: 14,
        color: '#1a237e',
    },
    selectedCategoryText: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: '#6200ee',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AddTransaction; 