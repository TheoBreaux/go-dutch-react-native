import { View, Button, StyleSheet } from "react-native";

const Footer = () => {
  const pressHandler = () => {
    console.log("pressed");
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Home" color={"#A40E24"} onPress={pressHandler} />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Split" color={"#A40E24"} onPress={pressHandler} />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="History" color={"#A40E24"} onPress={pressHandler} />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Images" color={"#A40E24"} onPress={pressHandler} />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Log Out" color={"#A40E24"} onPress={pressHandler} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  buttonWrapper: {
    flex: 1,
    borderColor: "black",
    borderWidth: 2,
  },
});

export default Footer;
