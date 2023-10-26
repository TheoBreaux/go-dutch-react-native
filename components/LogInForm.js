import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import Logo from "./Logo";

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
          <Button title="Submit" color="#A40E24" onPress={submitForm} />
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
    backgroundColor: "#e8ebf0",
    borderBottomColor: "#1a202c",
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: "#A40E24",
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
