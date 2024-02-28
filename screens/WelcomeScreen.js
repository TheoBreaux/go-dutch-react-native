import { View, Text, StyleSheet, Image } from "react-native";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";

const WelcomeScreen = ({ navigation }) => {
  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Text style={styles.title}>Would you like to Go Dutch?</Text>
        <Image
          style={styles.iconImage}
          source={require("../assets/go-dutch-split-button.png")}
        />
        <View style={styles.buttonContainer}>
          <PrimaryButton
            // width={20}
            onPress={() => navigation.navigate("SignUp")}
          >
            Sign Up
          </PrimaryButton>
          <PrimaryButton onPress={() => navigation.navigate("LogIn")}>
            Log In
          </PrimaryButton>
        </View>
        <Image
          style={styles.patternImage}
          source={require("../assets/go-dutch-pattern.png")}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: "red-hat-regular",
    fontSize: 30,
    marginTop: 15,
  },
  iconImage: {
    marginTop: 30,
    width: 250,
    height: 200,
    resizeMode: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  patternImage: {
    marginTop: 20,
    height: 500,
    resizeMode: "center",
    padding: 10,
  },
});

export default WelcomeScreen;
