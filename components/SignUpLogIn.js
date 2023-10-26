import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import Logo from "./Logo";

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
          <View style={styles.button}>
            <Button title="Sign Up" color="#A40E24" onPress={signUp} />
          </View>
          <View style={styles.button}>
            <Button title="Log In" color="#A40E24" onPress={login} />
          </View>
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
    fontWeight: "bold",
    fontSize: 25,
  },
  iconImage: {
    marginTop: 30,
    width: 200,
    height: 200,
    resizeMode: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#A40E24",
    borderRadius: 5,
    padding: 5,
    margin: 10,
    width: 150,
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
  },
  patternImage: {
    marginTop: 20,
    height: 500,
    resizeMode: "center",
    padding: 10,
  },
});

export default SignUpLogIn;
