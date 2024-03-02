import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import PrimaryButton from "./PrimaryButton";
import { Ionicons } from "@expo/vector-icons";

const FeeTextInput = ({ onChangeText, onPress, value }) => {
  return (
    <View style={styles.feeContainer}>
      <Text style={styles.text}>Tax</Text>
      <TextInput
        style={styles.textInput}
        keyboardType="numeric"
        placeholder="$0.00"
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
      />
      <PrimaryButton width={50}>
        <Ionicons name="close" size={20} color="white" onPress={onPress} />
      </PrimaryButton>
    </View>
  );
};

export default FeeTextInput;

const styles = StyleSheet.create({
  feeContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginRight: 5,
    fontSize: 20,
    fontFamily: "red-hat-regular",
  },
  textInput: {
    flex: 1,
    height: 60,
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    textAlign: "center",
    color: "black",
    fontFamily: "red-hat-bold",
    fontSize: 25,
  },
});
