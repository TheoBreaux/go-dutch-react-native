import { StyleSheet, View, Text, TextInput, ScrollView } from "react-native";
import Logo from "./Logo";
import { Picker } from "@react-native-picker/picker";
import { paymentOptions } from "../data/data";
import { useState } from "react";
import Colors from "../constants/colors";
import { ErrorMessage, Formik } from "formik";
import SecondaryButton from "./ui/SecondaryButton";

const PaymentSources = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");

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
    console.log(isValid);
    setIsFormValid(isValid);
    return errors;
  };

  return (
    <>
      <Logo />
      <View style={styles.welcomeMessage}>
        <Text style={styles.title}>Welcome, firstName!</Text>
        <Text style={styles.subtitle}>Please select your payment sources!</Text>
      </View>
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={(values, actions) => {
            actions.resetForm();
            console.log(values);
          }}>
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
    marginTop: 10,
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
    color: "#fc8181",
  },
});

export default PaymentSources;
