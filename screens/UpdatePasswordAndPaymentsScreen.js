import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import Colors from "../constants/colors";
import { Picker } from "@react-native-picker/picker";
import { paymentOptions } from "../data/data";
import SecondaryButton from "../components/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser, updateUserInfo } from "../store/store";
import CustomProfileIcon from "../components/CustomProfileIcon";

const UpdatePasswordAndPaymentsScreen = ({ user, setIsUpdatingProfile }) => {
  const [formValues, setFormValues] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [availablePrimaryPaymentOptions, setAvailablePrimaryPaymentOptions] =
    useState(paymentOptions);
  const [
    availableSecondaryPaymentOptions,
    setAvailableSecondaryPaymentOptions,
  ] = useState(paymentOptions);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    setFormValues(initialValues);
  }, []);

  const initialValues = {
    primaryPaymentSource: user.selectedPrimaryPayment,
    primaryPaymentSourceUsername: user.primaryPaymentUsername,
    secondaryPaymentSource: user.selectedSecondaryPayment,
    secondaryPaymentSourceUsername: user.secondaryPaymentUsername,
    email: user.email,
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

  const handlePrimaryPaymentChange = (value) => {
    setAvailableSecondaryPaymentOptions((prevOptions) => {
      const updatedOptions = prevOptions.filter(
        (option) => option.source !== value
      );
      return updatedOptions;
    });
  };

  const handleFormSubmit = async (values, actions) => {
    setIsUpdatingProfile(true);
    actions.resetForm();

    const updatedUserInfo = {
      primaryPaymentSource: values.selectedPrimaryPayment,
      primaryPaymentSourceUsername: values.primaryPaymentUsername,
      secondaryPaymentSource: values.selectedSecondaryPayment,
      secondaryPaymentSourceUsername: values.secondaryPaymentUsername,
      email: user.email,
    };

    dispatch(updateUserInfo(updatedUserInfo));

    try {
      const response = await fetch(
        "https://4707-2603-8000-c0f0-a570-5c6c-7628-a63a-291.ngrok-free.app/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUserInfo),
        }
      );

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      } else {
        dispatch(setUser(data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 20, marginTop: -10 }}>
        <CustomProfileIcon width={200} height={200} borderRadius={100} />
      </View>

      <ScrollView>
        <View style={styles.inputContainer}>
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleFormSubmit}
          >
            {({ handleChange, handleSubmit, handleBlur, values }) => (
              <>
                <View style={styles.inputPaymentContainer}>
                  <View>
                    <Picker
                      style={styles.input}
                      selectedValue={values.selectedPrimaryPayment}
                      onValueChange={(value) => {
                        setFormValues({
                          ...formValues,
                          selectedPrimaryPayment: value,
                        });
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
                      value={formValues.primaryPaymentUsername}
                      onChangeText={(text) => {
                        setFormValues({
                          ...formValues,
                          primaryPaymentUsername: text,
                        });
                        handleChange("primaryPaymentUsername")(text);
                      }}
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
                      value={formValues.secondaryPaymentUsername}
                      onChangeText={(text) => {
                        setFormValues({
                          ...formValues,
                          secondaryPaymentUsername: text,
                        });
                        handleChange("secondaryPaymentUsername")(text);
                      }}
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
    </>
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
