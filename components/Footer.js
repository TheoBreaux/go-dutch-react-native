import { View, Button, StyleSheet } from "react-native";

const Footer = () => {
  const pressHandler = () => {
    console.log("pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Home"
            color={"#A40E24"}
            buttonStyle={styles.button}
            onPress={pressHandler}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Split"
            color={"#A40E24"}
            buttonStyle={styles.button}
            onPress={pressHandler}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="History"
            color={"#A40E24"}
            buttonStyle={styles.button}
            onPress={pressHandler}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Images"
            color={"#A40E24"}
            buttonStyle={styles.button}
            onPress={pressHandler}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Log Out"
            color={"#A40E24"}
            buttonStyle={styles.button}
            onPress={pressHandler}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
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
  button: {
    padding: 0,
    margin: 0,
  },
});

export default Footer;
