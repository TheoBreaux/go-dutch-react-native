import { View, Button, StyleSheet } from "react-native";

const Footer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View>
          <Button title="Home" color={"#A40E24"} />
        </View>
        <View>
          <Button title="New Split" color={"#A40E24"} />
        </View>
        <View>
          <Button title="History" color={"#A40E24"} />
        </View>
        <View>
          <Button title="Image Logs" color={"#A40E24"} />
        </View>
        <View>
          <Button title="Log Out" color={"#A40E24"} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flex: 1,
    margin: 0,
    padding: 0,
    borderColor: "black",
    borderWidth: 2,
    fontWeight: "bold",
    borderStyle: "solid",
    width: "100%",
  },
});

export default Footer;
