import { View, Text, TextInput, StyleSheet } from "react-native";
import Logo from "./Logo";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";
import { useState } from "react";
import { ErrorMessage, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";

const LogInForm = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

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
    const userInfo = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await fetch(
        "https://8190-2603-8000-c001-b6a2-2d28-2e98-361d-8cfc.ngrok-free.app/login",
        {
          method: "POST",
          headers: {
            // Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );

      const data = await response.json();
      if (data.detail) {
        setError(data.detail);
      } else {
        navigation.navigate("Main", { screen: "Home" });
        // setTimeout(() => {
        // }, 1000);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

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
