import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../../constants/colors";

const SecondaryButton = ({ children, onPress }) => {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable onPress={onPress}>
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
    borderWidth: 3,
    margin: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    margin: 1,
    width: 370,
    borderColor: "black",
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
