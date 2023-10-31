import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Logo from "./Logo";
import { states } from "../data/data";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import Colors from "../constants/colors";

const SignUpForm = () => {
  const [selectedState, setSelectedState] = useState("");

  const handleStateChange = (itemValue) => {
    setSelectedState(itemValue);
  };

  const submitForm = () => {
    console.log("submit form");
  };

  return (
    <>
      <Logo />
      <View style={styles.inputContainer}>
        <View style={styles.nameInputsContainer}>
          <View style={styles.nameInputs}>
            <Text style={styles.inputLabels}>First Name</Text>
            <TextInput style={styles.firstNameInput} />
          </View>
          <View style={styles.nameInputs}>
            <Text style={styles.inputLabels}>Last Name</Text>
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
          <View>
            <Picker
              style={styles.textInput}
              selectedValue={selectedState}
              onValueChange={handleStateChange}>
              {states.map((item, index) => (
                <Picker.Item
                  key={item.abbreviation}
                  value={item.name}
                  label={item.name}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.logInInputs}>
          <Text style={styles.inputLabels}>City/Town</Text>
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
  nameInputsContainer: {
    flexDirection: "row",
  },
  inputLabels: {
    marginTop: 10,
    fontFamily: "red-hat-regular",
  },
  nameInputs: {
    width: "50%",
  },
  firstNameInput: {
    marginRight: 5,
    padding: 10,
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
  },
  lastNameInput: {
    padding: 10,
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
  },
  logInInputs: {
    width: "100%",
  },
  textInput: {
    fontFamily: "red-hat-regular",
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
    margin: 16,
    width: "100%",
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
  },
});

export default SignUpForm;
