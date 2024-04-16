import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const DiningEventHistoryCard = ({ item }) => {
  const dateObj = new Date(item.diningDate);
  const navigation = useNavigation();

  // Extract the year, month, and day from the Date object
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const day = dateObj.getDate();

  const showEventDetails = () => {
    navigation.navigate("DiningEventDetailsScreen", { item });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={showEventDetails}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("../assets/go-dutch-pattern.png")}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <Text style={[styles.eventDate, styles.bold]}>
            {month + " " + day + ", " + year}
          </Text>
          <Text style={styles.eventLocation}>{item.eventLocation}</Text>
          <Text style={styles.eventTitle}>{item.eventTitle}</Text>

          <Text style={styles.text}>
            <Text style={styles.bold}>Primary Diner: </Text>@
            {item.primaryDinerUsername}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 5,
    shadowColor: Colors.goDutchRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: 100,
    height: "auto",
    resizeMode: "contain",
  },
  textContainer: {
    width: "auto",
    marginLeft: 10,
  },
  text: {
    fontSize: 18,
    fontFamily: "red-hat-normal",
  },
  eventLocation: {
    fontFamily: "red-hat-normal",
    fontSize: 20,
    color: Colors.goDutchBlue,
    letterSpacing: 0.5,
  },
  eventDate: {
    fontSize: 18,
    letterSpacing: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: "red-hat-normal",
    color: Colors.goDutchRed,
  },

  bold: {
    fontFamily: "red-hat-bold",
  },
});

export default DiningEventHistoryCard;
