import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Logo from "./Logo";

const SignUpForm = () => {
  const submitForm = () => {
    console.log("submit form");
  };
  return (
    <>
      <Logo />
      <View>
        <View style={styles.nameInputs}>
          <View>
            <Text>First Name</Text>
            <TextInput></TextInput>
          </View>
          <View>
            <Text>Last Name</Text>
            <TextInput></TextInput>
          </View>
        </View>

        <View style={styles.logInInputs}>
          <Text>Email</Text>
          <TextInput></TextInput>
        </View>

        <View style={styles.logInInputs}>
          <Text>Create Username</Text>
          <TextInput></TextInput>
        </View>

        <View style={styles.logInInputs}>
          <Text>Password</Text>
          <TextInput></TextInput>
        </View>

        <View style={styles.logInInputs}>
          <Text>Confirm Password</Text>
          <TextInput></TextInput>
        </View>

        <View style={styles.logInInputs}>
          <Text>State</Text>
          <TextInput></TextInput>
        </View>

        <View style={styles.logInInputs}>
          <Text>City/Town</Text>
          <TextInput></TextInput>
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
  nameInputs: {
    flexDirection: "row",
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

export default SignUpForm;
