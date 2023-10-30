import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import Logo from "./Logo";
import Colors from "../constants/colors";

const LogInForm = () => {
  const submitForm = () => {
    console.log("form submitted");
  };
  return (
    <>
      <Logo />

      <View style={styles.inputContainer}>
        <View style={styles.logInInputs}>
          <Text>Username</Text>
          <TextInput style={styles.textInput} />
        </View>

        <View style={styles.logInInputs}>
          <Text>Password</Text>
          <TextInput style={styles.textInput} />
        </View>
        <View style={styles.button}>
          <Button
            title="Submit"
            color={Colors.goDutchRed}
            onPress={submitForm}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  logInInputs: {
    width: "100%",
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: "100%",
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
  },
});

export default LogInForm;
