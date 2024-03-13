import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import Colors from "../constants/colors";
import SecondaryButton from "../components/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/store";

const UpdateProfileForm = () => {
  const [formValues, setFormValues] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userInfo.user);

  useEffect(() => {
    setFormValues(initialValues);
  }, []);

  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "Can't be left blank";
    }

    if (!values.lastName) {
      errors.lastName = "Can't be left blank";
    }

    if (!values.email) {
      errors.email = "Can't be left blank";
    } else if (!isValidEmail(values.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!values.username) {
      errors.username = "Can't be left blank";
    }

    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleFormSubmit = async (values, actions) => {
    actions.resetForm();
    const newUser = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.username.toLowerCase(),
      userId: user.userId,
    };

    try {
      const response = await fetch(
        "https://db5d-2603-8000-c0f0-a570-4019-5e91-620e-3551.ngrok-free.app/signup/update",
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
        // Update initialValues with the updated formValues
        initialValues.firstName = formValues.firstName;
        initialValues.lastName = formValues.lastName;
        initialValues.email = formValues.email;
        initialValues.username = formValues.username;
        dispatch(setUser(data));
        console.log("WORKING 1");
        navigation.navigate("Main", { screen: "Home" });
        console.log("WORKING 2");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while updating profile.");
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
                    onChangeText={(text) => {
                      setFormValues({ ...formValues, firstName: text });
                      handleChange("firstName")(text);
                    }}
                    onBlur={handleBlur("firstName")}
                    value={formValues.firstName}
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
                    onChangeText={(text) => {
                      setFormValues({ ...formValues, lastName: text });
                      handleChange("lastName")(text);
                    }}
                    onBlur={handleBlur("lastName")}
                    value={formValues.lastName}
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
                  onChangeText={(text) => {
                    setFormValues({ ...formValues, email: text });
                    handleChange("email")(text);
                  }}
                  onBlur={handleBlur("email")}
                  value={formValues.email}
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
                  onChangeText={(text) => {
                    setFormValues({ ...formValues, username: text });
                    handleChange("username")(text);
                  }}
                  onBlur={handleBlur("username")}
                  value={formValues.username}
                  autoCapitalize="none"
                />
                <ErrorMessage
                  name="username"
                  component={Text}
                  style={styles.errorText}
                />
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
  nameInputsContainer: {
    flexDirection: "row",
  },
  nameInputs: {
    width: "50%",
  },
  inputLabels: {
    marginTop: 10,
    fontFamily: "red-hat-regular",
  },
  firstNameInput: {
    fontFamily: "red-hat-bold",
    marginRight: 5,
    padding: 10,
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
  },
  lastNameInput: {
    fontFamily: "red-hat-bold",
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
    fontFamily: "red-hat-bold",
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 200,
  },
});

export default UpdateProfileForm;
