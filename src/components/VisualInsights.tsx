import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import socketConnection from '../socket';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#000000',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 1,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

interface InsightData {
  category: string;
  amount: number;
}

const VisualInsights: React.FC = () => {
  const [insightsData, setInsightsData] = useState<InsightData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      const data = { phoneNumber: '9314635933' };
      const response = await axios.post<InsightData[]>(
        'http://192.168.0.101:8082/users/getCategorywiseData',
        data,
      );
      console.log('Fetched insights data:', response.data);
      setInsightsData(response.data);
      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = socketConnection();
    socket.on('newTransaction', fetchData);

    return () => {
      socket.off('newTransaction', fetchData);
      socket.disconnect();
    };
  }, []);

  const chartData = {
    labels: insightsData.map(item => item.category || 'Unknown'),
    datasets: [
      {
        data: insightsData.map(item => parseFloat(item.amount.toString()) || 0),
      },
    ],
  };

  return (
    <View style={styles.Insightscontainer}>
      <Text style={styles.titleText}>Chart between amount and category</Text>
      {lastUpdate && (
        <Text style={styles.updateText}>
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </Text>
      )}
      {insightsData.length > 0 ? (
        <BarChart
          data={chartData}
          width={screenWidth - 20}
          height={320}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          showValuesOnTopOfBars
          yAxisLabel="Amount"
          xAxisLabel="category"
          yAxisSuffix="Rs"
        />
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Insightscontainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 'auto',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  updateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
});

export default VisualInsights;
