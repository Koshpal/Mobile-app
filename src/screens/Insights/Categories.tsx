import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import { BarChart, PieChart } from 'react-native-chart-kit';
import socketConnection from '../../socket/index';

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

const Categories: React.FC = () => {
  const [insightsData, setInsightsData] = useState<InsightData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      const data = { phoneNumber: '9314635933' };
      const response = await axios.post<InsightData[]>(
        'http://192.168.1.104:8082/users/getCategorywiseData',
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

  // const chartData = {
  //   labels: ["Tea", "Fruits", "Coffee", "Fuel", "Vegs", "Fruit", "Subway", "Dinner"],
  //   datasets: [
  //     {
  //       data: [50, 450, 250, 1000, 150, 600, 250, 400]
  //     }
  //   ]
  // };

  const chartData = {
    labels: insightsData.map((item) => item.category || "Unknown"),
    // labels: insightsData.map(item => item.category || 'Unknown'),
    datasets: [
      {
        // data: insightsData.map((item) => parseFloat(item.amount.toString()) || 0),
        data: insightsData.map(item => parseFloat(item.amount.toString()) || 0),
      },
    ],
  };

  const pieChartData = [
    {
      name: "Food",
      amount: 500,
      color: "#FF6384",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Transport",
      amount: 300,
      color: "#36A2EB",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Shopping",
      amount: 700,
      color: "#FFCE56",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Entertainment",
      amount: 250,
      color: "#4BC0C0",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];

  return (
    <ScrollView style={styles.Insightscontainer}>
      <Text style={styles.titleText}>Chart between amount and category</Text>
      {lastUpdate && (
        <Text style={styles.updateText}>
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </Text>
      )}
      <BarChart
        data={chartData}
        width={screenWidth - 10}
        height={320}
        chartConfig={chartConfig}
        verticalLabelRotation={50}
        showValuesOnTopOfBars
      />

      <Text style={styles.titleText}>Category-wise Spending</Text>
      <PieChart
        data={pieChartData}
        width={screenWidth - 10}
        height={250}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute
        hasLegend
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Insightscontainer: {
    flex: 1,
    padding: 10,
    height: 'auto',
    backgroundColor: '#E7F1FF',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  updateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
});

export default Categories;
