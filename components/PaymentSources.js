import { StyleSheet, View, Text, TextInput, ScrollView } from "react-native";
import Logo from "./Logo";
import { Picker } from "@react-native-picker/picker";
import { paymentOptions } from "../data/data";
import { useState } from "react";
import Colors from "../constants/colors";
import { ErrorMessage, Formik } from "formik";
import SecondaryButton from "./ui/SecondaryButton";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const PaymentSources = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const userName = useSelector((state) => state.userInfo.user.firstName);
  const email = useSelector((state) => state.userInfo.user.email);

  const userInfo = useSelector((state) => state.userInfo.user);

  console.log("PAYMENT SOURCES:", userInfo);

  const initialValues = {
    selectedPrimaryPayment: "",
    primaryPaymentUsername: "",
    selectedSecondaryPayment: "",
    secondaryPaymentUsername: "",
  };

  const validateForm = (values) => {
    const errors = {};

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

  const handleFormSubmit = async (values, actions) => {
    const newUserPaymentInfo = {
      primaryPaymentSource: values.selectedPrimaryPayment,
      primaryPaymentSourceUsername: values.primaryPaymentUsername,
      secondaryPaymentSource: values.selectedSecondaryPayment,
      secondaryPaymentSourceUsername: values.secondaryPaymentUsername,
      email: email,
    };
    try {
      const response = await fetch(
        "https://0e24-2603-8000-c0f0-a570-6cee-6c44-f20e-afc7.ngrok-free.app/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUserPaymentInfo),
        }
      );

      const data = await response.json();
      if (data.detail) {
        setError(data.detail);
      } else {
        actions.resetForm();
        navigation.navigate("Main", { screen: "Home" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Logo />
      <View style={styles.welcomeMessage}>
        <Text style={styles.title}>Welcome, {userName}!</Text>
        <Text style={styles.subtitle}>Please select your payment sources!</Text>
      </View>
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleFormSubmit}>
          {({ handleChange, handleSubmit, handleBlur, values }) => (
            <ScrollView>
              <View style={styles.inputContainer}>
                <View style={styles.label}>
                  <Text style={styles.label}>
                    Select Primary Payment Source
                  </Text>
                </View>

                <View>
                  <Picker
                    style={styles.input}
                    selectedValue={values.selectedPrimaryPayment}
                    onValueChange={handleChange("selectedPrimaryPayment")}
                    onBlur={handleBlur("selectedPrimaryPayment")}>
                    {paymentOptions.map((item, index) => (
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

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Enter Primary Payment Source Username
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="@john-smith"
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
                    onBlur={handleBlur("selectedSecondaryPayment")}>
                    {paymentOptions.map((item, index) => (
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
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Enter Secondary Payment Source Username
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="@john-smith"
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

                <View>
                  <SecondaryButton onPress={handleSubmit}>
                    Submit
                  </SecondaryButton>
                </View>
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  welcomeMessage: {
    marginTop: 15,
  },
  title: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 32,
    marginTop: -20,
  },
  subtitle: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 18,
    color: Colors.goDutchRed,
  },
  label: {
    fontFamily: "red-hat-regular",
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "100%",
  },
  adSpace: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: Colors.goDutchRed,
    borderStyle: "dashed",
    padding: 5,
    width: "100%",
    height: 230,
  },
  ad: {
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  errorText: {
    color: "red",
  },
});

export default PaymentSources;
