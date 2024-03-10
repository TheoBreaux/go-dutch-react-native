import { StyleSheet, Text, View } from "react-native";
import React from "react";

const CompletedStamp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>COMPLETED</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 300,
    right: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 10,
    padding: 15,
  },
  text: {
    fontFamily: "stamper",
    color: "red",
    fontSize: 60,
  },
});

export default CompletedStamp;
