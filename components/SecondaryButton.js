import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../constants/colors";

const SecondaryButton = ({ children, onPress }) => {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: Colors.goDutchBlue }}
      >
        <View style={styles.buttonContainer}>
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
    marginTop: 10,
    overflow: "hidden",
    borderColor: Colors.goDutchBlue,
  },
  buttonContainer: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    margin: 2,
    width: 370,
    borderColor: Colors.goDutchBlue,
    borderWidth: 3,
    borderStyle: "solid",
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 18,
    fontFamily: "red-hat-bold",
  },
});

export default SecondaryButton;
