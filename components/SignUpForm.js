import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Logo from "./Logo";

const SignUpForm = () => {
  const submitForm = () => {
    console.log("submit form");
  };
  return (
    <>
      <Logo />
      <View style={styles.inputContainer}>
        <View style={styles.nameInputsContainer}>
          <View style={styles.nameInputs}>
            <Text>First Name</Text>
            <TextInput style={styles.firstNameInput} />
          </View>
          <View style={styles.nameInputs}>
            <Text>Last Name</Text>
            <TextInput style={styles.lastNameInput} />
          </View>
        </View>

        <View style={styles.logInInputs}>
          <Text style={styles.inputLabels}>Email</Text>
          <TextInput style={styles.textInput} />
        </View>

        <View style={styles.logInInputs}>
          <Text style={styles.inputLabels}>Create Username</Text>
          <TextInput style={styles.textInput} />
        </View>

        <View style={styles.logInInputs}>
          <Text style={styles.inputLabels}>Password</Text>
          <TextInput style={styles.textInput} />
        </View>

        <View style={styles.logInInputs}>
          <Text style={styles.inputLabels}>Confirm Password</Text>
          <TextInput style={styles.textInput} />
        </View>

        <View style={styles.logInInputs}>
          <Text style={styles.inputLabels}>State</Text>
          <TextInput style={styles.textInput} />
        </View>

        <View style={styles.logInInputs}>
          <Text style={styles.inputLabels}>City/Town</Text>
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
  nameInputsContainer: {
    flexDirection: "row",
  },
  inputLabels: {
    marginTop: 10,
  },
  nameInputs: {
    width: "50%",
  },
  firstNameInput: {
    marginRight: 5,
    padding: 10,
    backgroundColor: "#e8ebf0",
    borderBottomColor: "#1a202c",
    borderBottomWidth: 2,
    borderRadius: 5,
  },
  lastNameInput: {
    padding: 10,
    backgroundColor: "#e8ebf0",
    borderBottomColor: "#1a202c",
    borderBottomWidth: 2,
    borderRadius: 5,
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
    margin: 16,
    width: "100%",
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
  },
});

export default SignUpForm;
