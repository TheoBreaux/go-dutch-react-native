import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const DiningEventHistoryCard = () => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
    <View>
    <Text>Event Title</Text>
      <Image
        source={require("../images/profile-icon.jpg")}
        style={styles.image}
      />
    </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.text}>Date</Text>
        <Text style={styles.text}>Restaurant Bar</Text>
        <Text style={styles.text}>Primary Diner</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    // margin: 8,
    borderRadius: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 3,
    elevation: 5,
    // alignItems: "flex-start", // Adjusted line
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#000000",
  },
});

export default DiningEventHistoryCard;
