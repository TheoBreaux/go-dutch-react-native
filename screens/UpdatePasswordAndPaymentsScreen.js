import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import Colors from "../constants/colors";
import { Picker } from "@react-native-picker/picker";
import { paymentOptions } from "../data/data";
import SecondaryButton from "../components/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setUser, updateUserInfo } from "../store/store";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Spinner from "../components/Spinner";

const UpdatePasswordAndPaymentsScreen = ({ imageUri, profileImageKey }) => {
  const [formValues, setFormValues] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [availablePrimaryPaymentOptions, setAvailablePrimaryPaymentOptions] =
    useState(paymentOptions);
  const [
    availableSecondaryPaymentOptions,
    setAvailableSecondaryPaymentOptions,
  ] = useState(paymentOptions);

  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonPressed, setSaveButtonPressed] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const user = useSelector((state) => state.userInfo.user);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setFormValues(initialValues);
  }, []);

  const initialValues = {
    primaryPaymentSource: user.primaryPaymentSource,
    primaryPaymentSourceUsername: user.primaryPaymentSourceUsername,
    secondaryPaymentSource: user.secondaryPaymentSource,
    secondaryPaymentSourceUsername: user.secondaryPaymentSourceUsername,
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.primaryPaymentSource) {
      errors.primaryPaymentSource = "Please select your primary payment source";
    }

    if (!values.primaryPaymentSourceUsername) {
      errors.primaryPaymentSourceUsername =
        "Please enter your primary payment username";
    }

    if (!values.secondaryPaymentSource) {
      errors.secondaryPaymentSource =
        "Please select your secondary payment source";
    }

    if (!values.secondaryPaymentSourceUsername) {
      errors.secondaryPaymentSourceUsername =
        "Please enter your secondary payment username";
    }

    if (showUpdatePassword) {
      if (!values.password) {
        errors.password = "Please enter a password";
      } else if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/.test(values.password)
      ) {
        errors.password =
          "Must be at least 5 characters: 1 uppercase, 1 lowercase, and 1 digit";
      }

      if (!values.confirmedPassword) {
        errors.confirmedPassword = "Please confirm your password";
      } else if (values.confirmedPassword !== values.password) {
        errors.confirmedPassword = "Passwords do not match";
      }
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
    setSaveButtonText("Saved");
    setSaveButtonPressed(true);
    actions.resetForm();

    const newPassword = values.password ? values.password : user.password;

    const updatedUserInfo = {
      primaryPaymentSource: values.primaryPaymentSource,
      primaryPaymentSourceUsername: values.primaryPaymentSourceUsername,
      secondaryPaymentSource: values.secondaryPaymentSource,
      secondaryPaymentSourceUsername: values.secondaryPaymentSourceUsername,
      password: newPassword,
      userId: user.userId,
      type: "paymentAndPasswordProfileUpdate",
    };

    dispatch(updateUserInfo(updatedUserInfo));

    try {
      const response = await fetch(
        "https://5574-76-32-124-165.ngrok-free.app/updateprofile",
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
    navigation.goBack();
  };

  const screenWidth = Dimensions.get("window").width;
  const buttonWidth = screenWidth - 40;

  return (
    <>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.imageIconcontainer}>
          {isLoadingImage && <Spinner indicatorSize={290} />}
          {!isLoadingImage && profileImageKey ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <View>
              <Image
                source={require("../assets/default-profile-icon.jpg")}
                style={{ width: 200, height: 200 }}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleSubmit, handleBlur, values }) => (
            <>
              <View>
                <View>
                  <Text style={styles.label}>
                    Select Primary Payment Source
                  </Text>
                </View>
                <View>
                  <Picker
                    style={styles.pickerInput}
                    selectedValue={values.primaryPaymentSource}
                    onValueChange={(value) => {
                      setFormValues({
                        ...formValues,
                        primaryPaymentSource: value,
                      });
                      handleChange("primaryPaymentSource")(value);
                      handlePrimaryPaymentChange(value);
                    }}
                    onBlur={handleBlur("primaryPaymentSource")}
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
                  name="primaryPaymentSource"
                  component={Text}
                  style={styles.errorText}
                />

                <View>
                  <Text style={styles.label}>
                    Enter Primary Payment Source Username
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(i.e. @go-dutch, godutch@godutch.com, $godutch)"
                    value={formValues.primaryPaymentSourceUsername}
                    onChangeText={(text) => {
                      setFormValues({
                        ...formValues,
                        primaryPaymentSourceUsername: text,
                      });
                      handleChange("primaryPaymentSourceUsername")(text);
                    }}
                    onBlur={handleBlur("primaryPaymentSourceUsername")}
                  />
                  <ErrorMessage
                    name="primaryPaymentSourceUsername"
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
                    style={styles.pickerInput}
                    selectedValue={values.secondaryPaymentSource}
                    onValueChange={handleChange("secondaryPaymentSource")}
                    onBlur={handleBlur("secondaryPaymentSource")}
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
                  name="secondaryPaymentSource"
                  component={Text}
                  style={styles.errorText}
                />

                <View>
                  <Text style={styles.label}>
                    Enter Secondary Payment Source Username
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(i.e. @go-dutch, godutch@godutch.com, $godutch)"
                    value={formValues.secondaryPaymentSourceUsername}
                    onChangeText={(text) => {
                      setFormValues({
                        ...formValues,
                        secondaryPaymentSourceUsername: text,
                      });
                      handleChange("secondaryPaymentSourceUsername")(text);
                    }}
                    onBlur={handleBlur("secondaryPaymentSourceUsername")}
                  />
                  <ErrorMessage
                    name="secondaryPaymentSourceUsername"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>

                {!showUpdatePassword && (
                  <TouchableOpacity
                    onPress={() => setShowUpdatePassword(!showUpdatePassword)}
                    style={styles.passwordButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.updatePasswordText}>
                      Update Password
                    </Text>
                  </TouchableOpacity>
                )}

                {showUpdatePassword && (
                  <View>
                    <View style={styles.logInInputs}>
                      <Text style={styles.label}>Password</Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        secureTextEntry={!showPassword}
                        placeholder="Enter updated password..."
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.passwordToggle}
                      >
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
                      <Text style={styles.label}>Confirm Password</Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={handleChange("confirmedPassword")}
                        onBlur={handleBlur("confirmedPassword")}
                        value={values.confirmedPassword}
                        secureTextEntry={!showConfirmedPassword}
                        placeholder="Confirm updated password..."
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmedPassword(!showConfirmedPassword)
                        }
                        style={styles.passwordToggle}
                      >
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
                  </View>
                )}
              </View>

              <SecondaryButton
                onPress={() => navigation.goBack()}
                width={buttonWidth}
              >
                Return
              </SecondaryButton>
              <SecondaryButton onPress={handleSubmit} width={buttonWidth}>
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>{saveButtonText}</Text>
                  {saveButtonPressed && (
                    <Ionicons
                      name="checkmark-sharp"
                      size={30}
                      color="whitesmoke"
                    />
                  )}
                </View>
              </SecondaryButton>
            </>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageIconcontainer: {
    zIndex: 0,
    height: 200,
    width: 200,
    position: "relative",
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#000",
  },
  inputContainer: {
    flex: 1,
    padding: 16,
    marginTop: -20,
  },
  label: {
    fontFamily: "red-hat-normal",
    marginTop: 5,
  },
  pickerInput: {
    height: 50,
    backgroundColor: Colors.inputBackground,
    marginVertical: 5,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    height: "auto",
  },
  errorText: {
    color: "red",
  },
  textInput: {
    fontFamily: "red-hat-normal",
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  passwordButton: {
    marginTop: 10,
    backgroundColor: Colors.goDutchBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    height: "auto",
    alignItems: "center",
    elevation: 3,
  },
  updatePasswordText: {
    color: "whitesmoke",
    fontSize: 20,
    fontFamily: "red-hat-bold",
  },
  logInInputs: {
    width: "100%",
  },
  passwordToggleText: {
    color: Colors.goDutchRed,
  },
  passwordToggle: {
    position: "absolute",
    top: 40,
    right: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 18,
    fontFamily: "red-hat-bold",
    marginRight: 10,
  },
});

export default UpdatePasswordAndPaymentsScreen;
