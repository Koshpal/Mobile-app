import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowUpRight, Car, Utensils, Wallet, ArrowRight } from 'lucide-react-native';
import Icons from '../../utils/Icons';
import ProgressBar from '../ProgressBar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type VisualInsightsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VisualInsights'>;
};

const VisualInsights: React.FC<VisualInsightsProps> = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      {/* Income and Expense Cards */}
      <View style={styles.row}>
        <View style={styles.card}>
          <View style={styles.arrowBack}>
            <ArrowUpRight size={24} color="#4361EE" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Total Income</Text>
            <Text style={styles.amount}>₹3874</Text>
            <Text style={styles.percentage}>+1.29%</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.arrowBack}>
            <ArrowUpRight size={24} color="#4361EE" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Total Expense</Text>
            <Text style={styles.amount}>₹75</Text>
            <Text style={styles.percentage}>+1.29%</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {/* <Text style={styles.progressText}>30%</Text> */}
        <View style={{ width: '100%' }}>
          <ProgressBar />
        </View>
        {/* <Text style={styles.progressAmount}>₹20,000.00</Text> */}
      </View>

      <Text style={styles.expenseText}>
        <Image source={Icons.Check} />
        30% Of Your Expenses, Looks Good.
      </Text>

      {/* Savings & Weekly Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <View style={styles.savingCircle}>
            <Car size={32} color="#4361EE" />
          </View>
          <Text style={styles.summaryLabel}>Savings On Goals</Text>
        </View>
        <View style={styles.verticalLine} />
        <View style={styles.summaryData}>
          <View style={styles.summaryRow}>
            <Wallet size={24} color="#4361EE" />
            <Text style={styles.summaryText}>Revenue Last Week</Text>
            <Text style={styles.summaryValue}>4,000.00</Text>
          </View>
          <View style={styles.horizontalLine} />
          <View style={styles.summaryRow}>
            <Utensils size={24} color="#4361EE" />
            <Text style={styles.summaryText}>Food Last Week</Text>
            <Text style={styles.summaryValue}>-100.00</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {[
          'Quickly Analysis',
          'Categories',
          'Spending Summary',
          'Key Data Points',
          'Transactions',
          'Suggestions',
        ].map((item, index) => (
          index == 0 || index == 1 ? 
          <TouchableOpacity 
            key={index} 
            style={styles.menuItemMoreHeight} 
            onPress={() => {
              if(item == 'Categories'){
                navigation.push('Categories');
              }
            }}>
              <Text style={styles.menuText}>{item}</Text>
              <ArrowRight size={20} color="#000" style={styles.arrowIcon} />
          </TouchableOpacity> :
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem} 
            onPress={() => {
              if(item == 'Categories'){
                navigation.push('Categories');
              }
            }}>
              <Text style={styles.menuText}>{item}</Text>
              <ArrowRight size={20} color="#000" style={styles.arrowIcon} />
            </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF2FF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 3,
    gap: 5,
  },
  cardTitle: { fontSize: 14, color: '#333', marginTop: 8 },
  amount: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  percentage: { fontSize: 12, color: '#4361EE', marginTop: 4 },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressText: { fontSize: 14, color: '#333' },
  progressBar: { flex: 1, height: 10, borderRadius: 10, marginHorizontal: 8 },
  progressAmount: { fontSize: 14, color: '#333' },
  expenseText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },

  summaryCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowBack: {
    padding: 10,
    backgroundColor: '#D0E3FF',
    borderRadius: 10,
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#CCC',
    height: '100%',
    marginHorizontal: 10,
  },
  summaryData: { flex: 2 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 5 },
  summaryText: { flex: 1, fontSize: 14, color: '#333' },
  summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  horizontalLine: { height: 1, backgroundColor: '#CCC', marginVertical: 8 },

  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    height: '40%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    elevation: 3,
  },
  menuItemMoreHeight:{
    width: '48%',
    height: '80%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    elevation: 3,
  },
  menuText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  // fixed this to bottom rigth
  arrowIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 5,
    borderRadius: 50, // Makes it circular
    borderColor: '#D0E3FF',
    borderWidth: 5,
    backgroundColor: '#FFF', // Optional for better visibility
    shadowColor: '#D0E3FF',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  savingCircle: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    borderWidth: 5,
    borderBlockColor: '#D0E3FF',
    shadowColor: '#D0E3FF',
  }
});

export default VisualInsights;
