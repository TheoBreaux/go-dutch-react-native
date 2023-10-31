import { View, Text, StyleSheet, Image } from "react-native";
import Logo from "./Logo";
import PrimaryButton from "./ui/PrimaryButton";

const SignUpLogIn = () => {
  const signUp = () => {
    console.log("sign up");
  };

  const login = () => {
    console.log("log in");
  };

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Text style={styles.title}>Would you like to Go Dutch?</Text>
        <Image
          style={styles.iconImage}
          source={require("../images/go-dutch-split-button.png")}
        />
        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={signUp}>Sign Up</PrimaryButton>
          <PrimaryButton onPress={login}>Log In</PrimaryButton>
        </View>
        <Image
          style={styles.patternImage}
          source={require("../images/go-dutch-pattern.png")}
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
    fontFamily: "red-hat-bold",
    fontSize: 25,
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

export default SignUpLogIn;
