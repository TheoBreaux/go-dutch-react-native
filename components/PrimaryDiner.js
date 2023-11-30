import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";

const PrimaryDiner = () => {
  const userFullName = useSelector(
    (state) =>
      state.userInfo.user.firstName + " " + state.userInfo.user.lastName
  );
  const goDutchUsername = useSelector((state) => state.userInfo.user.username);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Primary Diner:</Text>
      <View style={styles.userInfo}>
        <Text style={styles.primaryName}>{userFullName}</Text>
        <Text style={styles.text}>@{goDutchUsername}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    margin: 2,
    borderColor: Colors.goDutchRed,
    borderWidth: 3,
    borderStyle: "solid",
    backgroundColor: "#fc8181",
    elevation: 5,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: "red-hat-bold",
  },
  primaryName: {
    fontSize: 25,
    color: Colors.goDutchBlue,
  },
  userInfo: {
    alignItems: "center",
  },
});

export default PrimaryDiner;
