import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import ViewBankSms from '../../screens/ViewBankSms'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type HomeProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};
const Home: React.FC<HomeProps> = ({ navigation }) => {
    return (
        <View>
            <Text>Home</Text>
            <TouchableOpacity onPress={() => { navigation.push('ViewBankSms') }}>
                <Text>bank sms</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})