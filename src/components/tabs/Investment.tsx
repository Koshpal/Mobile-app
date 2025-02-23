import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const data = [
  {
    category: "Introductive",
    courses: [
      {
        title: "Budgeting 101",
        description:
          "This course covers the basics of budgeting, including how to create a budget, track expenses, and stay within it.",
        image: require("../../assets/budget.png"),
        completed: false,
      },
    ],
  },
  {
    category: "Intermediate",
    courses: [
      {
        title: "Saving Strategies",
        description:
          "This course covers strategies for saving money, automating savings, and setting savings goals.",
        image: require("../../assets/saving.png"),
        completed: true,
      },
      {
        title: "Investing Basics",
        description:
          "This course covers the basics of investing, including how to invest in stocks, bonds, and mutual funds.",
        image: require("../../assets/investing.png"),
        completed: false,
      },
      {
        title: "Debt Management",
        description:
          "Learn strategies for managing debt, including how to pay it off and improve your credit score.",
        image: require("../../assets/debt.png"),
        completed: false,
      },
      {
        title: "Retirement Planning",
        description:
          "This course covers essential retirement planning, including how to calculate savings needs.",
        image: require("../../assets/retirement.png"),
        completed: false,
      },
    ],
  },
  {
    category: "Advanced",
    courses: [
      {
        title: "Credit and Loans",
        description:
          "Understand credit scores, manage loans, and use credit responsibly.",
        image: require("../../assets/credit.png"),
        completed: true,
      },
      {
        title: "Financial Planning for Life Events",
        description:
          "Covering financial planning for marriage, buying a home, and having children.",
        image: require("../../assets/life-planning.png"),
        completed: true,
      },
      {
        title: "Estate Planning",
        description:
          "Learn about estate planning, including wills, trusts, and end-of-life care.",
        image: require("../../assets/estate.png"),
        completed: true,
      },
      {
        title: "Financial Wellness",
        description:
          "Improve financial habits, reduce stress, and build a healthy financial future.",
        image: require("../../assets/wellness.png"),
        completed: true,
      },
    ],
  },
];

const Investment = () => {
  const [selectedTab, setSelectedTab] = useState("Videos");

  const renderCourse = ({ item }) => (
    <View style={styles.courseCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseDescription}>{item.description}</Text>
        <Button
          mode="outlined"
          style={styles.button}
          icon={item.completed ? "check-circle" : "play-circle"}
        >
          {item.completed ? "Completed" : "Play"}
        </Button>
      </View>
      <Image source={item.image} style={styles.courseImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Financial Advices</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Videos", "Articles", "Podcasts"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab ? styles.selectedTab : null,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab ? styles.selectedTabText : null,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Courses */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.category}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionHeader}>{item.category}</Text>
            {item.courses.map((course, index) => (
              <View key={`${item.category}-${index}`}>
                {renderCourse({ item: course })}
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E7F1FF", padding: 15 },
  header: { fontSize: 22, fontWeight: "bold", color: "#333" },
  tabs: { flexDirection: "row", marginVertical: 10 },
  tab: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#081F5C",
    alignItems: "center",
  },
  selectedTab: { backgroundColor: "#7096D1" },
  tabText: { fontSize: 16, color: "#081F5C" },
  selectedTabText: { color: "white" },
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  courseTitle: { fontSize: 16, fontWeight: "bold", color: "#081F5C" },
  courseDescription: { fontSize: 14, color: "#666", marginVertical: 5 },
  courseImage: { width: 80, height: 80, resizeMode: "contain", marginLeft: 10 },
  button: { borderRadius: 20, marginTop: 5, alignSelf: "flex-start" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#002D18",
    padding: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, color: "white", marginTop: 3 },
});

export default Investment;
