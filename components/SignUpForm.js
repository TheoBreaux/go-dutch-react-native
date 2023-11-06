import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Logo from "./Logo";
import { states } from "../data/data";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";
import { ErrorMessage, Formik } from "formik";

const SignUpForm = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState(false);
  const [viewConfirmedPassword, setViewConfirmedPassword] = useState(false);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    createUsername: "",
    password: "",
    confirmedPassword: "",
    selectedState: "",
    enteredCityTown: "",
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "Please enter your first name";
    }

    if (!values.lastName) {
      errors.lastName = "Please enter your last name";
    }

    if (!values.email) {
      errors.email = "An email address is required";
    } else if (!isValidEmail(values.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!values.createUsername) {
      errors.createUsername = "Please create your username";
    }

    if (!values.password) {
      errors.password = "Please enter a password";
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/.test(values.password)) {
      errors.password =
        "Must be at least 5 characters: 1 uppercase, 1 lowercase, and 1 digit";
    }

    if (!values.confirmedPassword) {
      errors.confirmedPassword = "Please confirm your password";
    } else if (values.confirmedPassword !== values.password) {
      errors.confirmedPassword = "Passwords do not match";
    }

    if (!values.selectedState) {
      errors.selectedState = "Please select your state";
    }

    if (!values.enteredCityTown) {
      errors.enteredCityTown = "Please enter your city or town";
    }

    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleFormSubmit = (values, actions) => {
    actions.resetForm();
    console.log(values);
  };

  return (
    <>
      <Logo />
      <ScrollView>
        <View style={styles.inputContainer}>
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleFormSubmit}>
            {({ handleChange, handleSubmit, handleBlur, values }) => (
              <>
                <View style={styles.nameInputsContainer}>
                  <View style={styles.nameInputs}>
                    <Text style={styles.inputLabels}>First Name</Text>
                    <TextInput
                      style={styles.firstNameInput}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      value={values.firstName}
                    />
                    <ErrorMessage
                      name="firstName"
                      component={Text}
                      style={styles.errorText}
                    />
                  </View>

                  <View style={styles.nameInputs}>
                    <Text style={styles.inputLabels}>Last Name</Text>
                    <TextInput
                      style={styles.lastNameInput}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      value={values.lastName}
                    />
                    <ErrorMessage
                      name="lastName"
                      component={Text}
                      style={styles.errorText}
                    />
                  </View>
                </View>

                <View style={styles.logInInputs}>
                  <Text style={styles.inputLabels}>Email</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  <ErrorMessage
                    name="email"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>
                <View style={styles.logInInputs}>
                  <Text style={styles.inputLabels}>Create Username</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={handleChange("createUsername")}
                    onBlur={handleBlur("createUsername")}
                    value={values.createUsername}
                  />
                  <ErrorMessage
                    name="createUsername"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>

                <View style={styles.logInInputs}>
                  <Text style={styles.inputLabels}>Password</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}>
                    <Text style={styles.passwordToggleText}>
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                  <ErrorMessage
                    name="password"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>

                <View style={styles.logInInputs}>
                  <Text style={styles.inputLabels}>Confirm Password</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={handleChange("confirmedPassword")}
                    onBlur={handleBlur("confirmedPassword")}
                    value={values.confirmedPassword}
                    secureTextEntry={!showConfirmedPassword}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmedPassword(!showConfirmedPassword)
                    }
                    style={styles.passwordToggle}>
                    <Text style={styles.passwordToggleText}>
                      {confirmedPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                  <ErrorMessage
                    name="confirmedPassword"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>

                <View style={styles.logInInputs}>
                  <Text style={styles.inputLabels}>State</Text>
                  <View>
                    <Picker
                      style={styles.textInput}
                      selectedValue={values.selectedState}
                      onValueChange={handleChange("selectedState")}
                      onBlur={handleBlur("selectedState")}>
                      {states.map((item, index) => (
                        <Picker.Item
                          key={item.abbreviation}
                          value={item.name}
                          label={item.name}
                        />
                      ))}
                    </Picker>
                  </View>
                  <ErrorMessage
                    name="selectedState"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>
                <View style={styles.logInInputs}>
                  <Text style={styles.inputLabels}>City/Town</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={handleChange("enteredCityTown")}
                    onBlur={handleBlur("enteredCityTown")}
                    value={values.enteredCityTown}
                  />
                  <ErrorMessage
                    name="enteredCityTown"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <SecondaryButton onPress={handleSubmit}>
                    Submit
                  </SecondaryButton>
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: -15,
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
  passwordToggle: {
    position: "absolute",
    top: 40,
    right: 10,
  },
  passwordToggleText: {
    color: Colors.goDutchRed,
  },
  errorText: {
    color: "#fc8181",
  },
  buttonContainer: {
    marginBottom: 30,
  },
});

export default SignUpForm;
