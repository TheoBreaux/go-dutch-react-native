import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PrimaryButton from "./ui/PrimaryButton";
import Colors from "../constants/colors";
import { useDispatch } from "react-redux";
import { removeDiner } from "../store/store";

const Diner = ({ additionalDinerUsername, diner }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{additionalDinerUsername}</Text>
      <PrimaryButton width={40} onPress={() => dispatch(removeDiner(diner))}>
        X
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    borderColor: Colors.goDutchRed,
    borderWidth: 1,
    marginTop: 5,
    height: 75,
  },
  text: {
    color: Colors.goDutchBlue,
    fontSize: 18,
    fontFamily: "red-hat-regular",
    padding: 5,
  },
});
export default Diner;
