import { View, Text, TextInput, StyleSheet } from "react-native";
import Logo from "./Logo";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";
import { useState } from "react";
import { ErrorMessage, Formik } from "formik";

const LogInForm = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");

  const initialValues = {
    username: "",
    password: "",
  };

  const validateForm = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = "A username is required";
    }

    if (!values.password) {
      errors.password = "Please enter a password";
    }

    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return errors;
  };

  const handleFormSubmit = async (values, actions) => {
    actions.resetForm();
    console.log(values);

    const userInfo = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await fetch("http://10.0.2.2:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
      } else {
        // Handle non-successful responses, e.g., response.status is not 200
        console.error("Request failed with status: " + response.status);
      }
    } catch (error) {
      // Handle network or fetch-related errors
      console.error("An error occurred:", error);
    }
  };

  // if (data.detail) {
  //   setError(data.detail);
  // } else {
  //   setCookie("firstName", data.firstName);
  //   setCookie("lastName", data.lastName);
  //   setCookie("username", data.username);
  //   setCookie("email", data.email);
  //   setCookie("cityTown", data.cityTown);
  //   setCookie("AuthToken", data.token);
  //   navigate("/user-home");
  //   // window.location.reload();
  //   setTimeout(() => {
  //     resetForm();
  //   }, 1000);
  // }

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleFormSubmit}>
          {({ handleChange, handleSubmit, handleBlur, values }) => (
            <View style={styles.logInInputs}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
              <ErrorMessage
                name="username"
                component={Text}
                style={styles.errorText}
              />
              <View style={styles.logInInputs}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={true}
                />
                <ErrorMessage
                  name="password"
                  component={Text}
                  style={styles.errorText}
                />
              </View>
              <View>
                <SecondaryButton onPress={handleSubmit}>Submit</SecondaryButton>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
  errorText: {
    marginTop: -5,
    color: "#fc8181",
  },
});

export default LogInForm;
