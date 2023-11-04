import { View, Button, StyleSheet } from "react-native";
import Colors from "../constants/colors";

const Footer = () => {
  const logOut = () => {
    console.log("log out");
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Home"
            color={Colors.goDutchRed}
            onPress={() => navigation.navigate("UserHomePage")}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Split"
            color={Colors.goDutchRed}
            onPress={() => navigation.navigate("NewSplitForm")}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="History"
            color={Colors.goDutchRed}
            onPress={() => navigation.navigate("DiningEventHistory")}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Images"
            color={Colors.goDutchRed}
            onPress={() => navigation.navigate("ImageLogs")}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Log Out" color={Colors.goDutchRed} onPress={logOut} />
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
