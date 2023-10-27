import { View, Button, StyleSheet } from "react-native";

const Footer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Home" color={"#A40E24"} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Split" color={"#A40E24"} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="History" color={"#A40E24"} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Images" color={"#A40E24"} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Log Out" color={"#A40E24"} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  buttonWrapper: {
    flex: 1,
    borderColor: "black",
    borderWidth: 2,
  },
});

export default Footer;
