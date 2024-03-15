import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { Ionicons } from "@expo/vector-icons";

const FeeTextInput = ({ onChangeText, value, feeName, onClearPress }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChangeText = (text) => {
    setInputValue(text);
    onChangeText(text);
  };

  const handleClearPress = () => {
    setInputValue("");
    onClearPress();
  };

  return (
    <View style={styles.feeContainer}>
      <Text style={styles.text}>{feeName}</Text>
      <TextInput
        style={styles.textInput}
        keyboardType="numeric"
        placeholder="$0.00"
        placeholderTextColor="gray"
        value={inputValue}
        onChangeText={handleChangeText}
      />
      <PrimaryButton width={50}>
        <Ionicons
          name="close"
          size={20}
          color="white"
          onPress={handleClearPress}
        />
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
    fontFamily: "red-hat-normal",
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
