import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../constants/colors";

const PrimaryButton = ({ children, onPress, padding, width, height }) => {
  const buttonContainerStyle = {
    padding: padding !== undefined ? padding : 10,
    width: width !== undefined ? width : 150,
    height: height !== undefined ? height : 50,
  };
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: Colors.goDutchBlue }}
      >
        <View style={[styles.buttonContainer, buttonContainerStyle]}>
          <Text style={styles.buttonText}>{children}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 5,
    borderWidth: 2,
    margin: 10,
    overflow: "hidden",
    borderColor: Colors.goDutchBlue,
  },
  buttonContainer: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    margin: 2,
    borderColor: Colors.goDutchBlue,
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 18,
    fontFamily: "red-hat-bold",
  },
});

export default PrimaryButton;
