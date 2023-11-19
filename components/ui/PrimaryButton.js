import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../../constants/colors";

const PrimaryButton = ({ children, onPress, padding }) => {
  const buttonContainerStyle = {
    padding: padding !== undefined ? padding : 10,
  };
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: Colors.goDutchBlue }}>
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
    borderWidth: 3,
    margin: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    margin: 2,
    width: 150,
    borderColor: "black",
    borderWidth: 3,
    borderStyle: "solid",
    alignItems: "center",
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 18,
    fontFamily: "red-hat-bold",
  },
});

export default PrimaryButton;
