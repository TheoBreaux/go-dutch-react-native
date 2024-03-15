import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import Colors from "../constants/colors";
import { Picker } from "@react-native-picker/picker";
import { paymentOptions } from "../data/data";
import SecondaryButton from "../components/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/store";

const UpdatePasswordAndPaymentsScreen = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [availablePrimaryPaymentOptions, setAvailablePrimaryPaymentOptions] =
    useState(paymentOptions);
  const [
    availableSecondaryPaymentOptions,
    setAvailableSecondaryPaymentOptions,
  ] = useState(paymentOptions);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userInfo.user);

  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    selectedPrimaryPayment: "",
    primaryPaymentUsername: "",
    selectedSecondaryPayment: "",
    secondaryPaymentUsername: "",
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
    if (!values.selectedPrimaryPayment) {
      errors.selectedPrimaryPayment =
        "Please select your primary payment source";
    }

    if (!values.primaryPaymentUsername) {
      errors.primaryPaymentUsername =
        "Please enter your primary payment username";
    }

    if (!values.selectedSecondaryPayment) {
      errors.selectedSecondaryPayment =
        "Please select your secondary payment source";
    }

    if (!values.secondaryPaymentUsername) {
      errors.secondaryPaymentUsername =
        "Please enter your secondary payment username";
    }

    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handlePrimaryPaymentChange = (value) => {
    setAvailableSecondaryPaymentOptions((prevOptions) => {
      const updatedOptions = prevOptions.filter(
        (option) => option.source !== value
      );
      return updatedOptions;
    });
  };

  const handleFormSubmit = async (values, actions) => {
    actions.resetForm();
    setLoading(true);

    const newUser = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.createUsername.toLowerCase(),
    };

    try {
      const response = await fetch(
        "https://aa8e-2603-8000-c0f0-a570-9b5-266c-5fdc-cfb9.ngrok-free.app/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      } else {
        dispatch(setUser(data));
        handleLocationSearch();
        navigation.navigate("PaymentSourcesInputScreen");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleSubmit, handleBlur, values }) => (
            <>
              <View style={styles.nameInputsContainer}>
                <View style={styles.nameInputs}>
                  <Text style={styles.inputLabels}>First Name</Text>
                  <TextInput
                    style={styles.firstNameInput}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={initialValues.firstName}
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
                    value={initialValues.lastName}
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
                  value={initialValues.email}
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <ErrorMessage
                  name="email"
                  component={Text}
                  style={styles.errorText}
                />
              </View>
              <View style={styles.logInInputs}>
                <Text style={styles.inputLabels}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange("createUsername")}
                  onBlur={handleBlur("createUsername")}
                  value={initialValues.username}
                  autoCapitalize="none"
                />
                <ErrorMessage
                  name="createUsername"
                  component={Text}
                  style={styles.errorText}
                />
              </View>

              <View style={styles.inputPaymentContainer}>
                <View>
                  <Picker
                    style={styles.input}
                    selectedValue={values.selectedPrimaryPayment}
                    onValueChange={(value) => {
                      handleChange("selectedPrimaryPayment")(value);
                      handlePrimaryPaymentChange(value);
                    }}
                    onBlur={handleBlur("selectedPrimaryPayment")}
                  >
                    {availablePrimaryPaymentOptions.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.label}
                        value={item.source}
                      />
                    ))}
                  </Picker>
                </View>
                <ErrorMessage
                  name="selectedPrimaryPayment"
                  component={Text}
                  style={styles.errorText}
                />

                <View style={styles.inputPaymentContainer}>
                  <Text style={styles.label}>
                    Enter Primary Payment Source Username
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(i.e. @go-dutch, godutch@godutch.com, $godutch)"
                    value={values.primaryPaymentUsername}
                    onChangeText={handleChange("primaryPaymentUsername")}
                    onBlur={handleBlur("primaryPaymentUsername")}
                  />
                  <ErrorMessage
                    name="primaryPaymentUsername"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>

                <View>
                  <Text style={styles.label}>
                    Select Secondary Payment Source
                  </Text>
                </View>

                <View>
                  <Picker
                    style={styles.input}
                    selectedValue={values.selectedSecondaryPayment}
                    onValueChange={handleChange("selectedSecondaryPayment")}
                    onBlur={handleBlur("selectedSecondaryPayment")}
                  >
                    {availableSecondaryPaymentOptions.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.label}
                        value={item.source}
                      />
                    ))}
                  </Picker>
                </View>
                <ErrorMessage
                  name="selectedSecondaryPayment"
                  component={Text}
                  style={styles.errorText}
                />
                <View style={styles.inputPaymentContainer}>
                  <Text style={styles.label}>
                    Enter Secondary Payment Source Username
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(i.e. @go-dutch, godutch@godutch.com, $godutch)"
                    value={values.secondaryPaymentUsername}
                    onChangeText={handleChange("secondaryPaymentUsername")}
                    onBlur={handleBlur("secondaryPaymentUsername")}
                  />
                  <ErrorMessage
                    name="secondaryPaymentUsername"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <SecondaryButton onPress={handleSubmit} width={370}>
                  Save
                </SecondaryButton>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: -25,
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  inputPaymentContainer: {
    width: "100%",
    marginTop: 10,
  },
  nameInputsContainer: {
    flexDirection: "row",
  },
  inputLabels: {
    marginTop: 10,
    fontFamily: "red-hat-normal",
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "100%",
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
    fontFamily: "red-hat-normal",
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
    color: "red",
    marginTop: -5,
  },
  label: {
    fontFamily: "red-hat-normal",
  },
  buttonContainer: {
    marginTop: 150,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -50,
    width: "100%",
    height: "100%",
  },
});

export default UpdatePasswordAndPaymentsScreen;
