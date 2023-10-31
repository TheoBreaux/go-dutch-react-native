import { View, Text, TextInput, StyleSheet } from "react-native";
import Logo from "./Logo";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";


const LogInForm = () => {
  const submitForm = () => {
    console.log("form submitted");
  };
  return (
    <>
      <Logo />

      <View style={styles.inputContainer}>
        <View style={styles.logInInputs}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.textInput} />
        </View>

        <View style={styles.logInInputs}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.textInput} />
        </View>
        <View style={styles.button}>
          <SecondaryButton onPress={submitForm}>Submit</SecondaryButton>
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
  label: {
    fontFamily: "red-hat-regular",
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
});

export default LogInForm;
