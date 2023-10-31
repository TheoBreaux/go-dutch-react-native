import { View, Text, TextInput, StyleSheet } from "react-native";
import Logo from "./Logo";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";

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

  const handleSubmit = async (values, { resetForm }) => {
    // const userInfo = {
    //   username: values.username,
    //   password: values.password,
    // };
    // try {
    //   const response = await fetch("http://localhost:8000/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(userInfo),
    //   });
    //   const data = await response.json();
    //   if (data.detail) {
    //     setError(data.detail);
    //   } else {
    //     setCookie("firstName", data.firstName);
    //     setCookie("lastName", data.lastName);
    //     setCookie("username", data.username);
    //     setCookie("email", data.email);
    //     setCookie("cityTown", data.cityTown);
    //     setCookie("AuthToken", data.token);
    //     navigate("/user-home");
    //     // window.location.reload();
    //     setTimeout(() => {
    //       resetForm();
    //     }, 1000);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <>
      <Logo />
      <Formik
        onSubmit={handleSubmit}
        validate={validateForm}
        initialValues={initialValues}>
        {({ isSubmitting }) => (
          <Form>
            <View style={styles.inputContainer}>
              <View style={styles.logInInputs}>
                <Text style={styles.label}>Username</Text>
                <Field name="username">
                  {({ field }) => (
                    <TextInput style={styles.textInput} {...field} />
                  )}
                </Field>
                <ErrorMessage
                  name="username"
                  component={Text}
                  style={styles.errorText}
                />
              </View>

              <View style={styles.logInInputs}>
                <Text style={styles.label}>Password</Text>
                <Field name="password">
                  {({ field }) => (
                    <TextInput style={styles.textInput} {...field} />
                  )}
                </Field>
                <ErrorMessage
                  name="password"
                  component={Text}
                  style={styles.errorText}
                />
              </View>
              <View style={styles.button}>
                <SecondaryButton type="submit" disabled={isSubmitting}>
                  Submit
                </SecondaryButton>
              </View>
            </View>
          </Form>
        )}
      </Formik>
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
