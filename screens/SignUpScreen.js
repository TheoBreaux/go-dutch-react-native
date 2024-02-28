import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Logo from "../components/Logo";
import { useState } from "react";
import Colors from "../constants/colors";
import SecondaryButton from "../components/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setCurrentCity, setUser } from "../store/store";
import UploadProfileImage from "../ui/UploadProfileImage";
import { getCityFromCoordinates } from "../utils";
import { useCallback } from "react";
import LocateRestaurants from "../ui/LocateRestaurants";

const SignUpScreen = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState(false);
  const [imagePath, setImagePath] = useState(null);
  const [error, setError] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const apiKey = "AIzaSyCXB87rKoiCqEI_As-a_eytKZZRDADW_ig";

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    createUsername: "",
    password: "",
    confirmedPassword: "",
    profilePicPath: "",
  };

  const handleImageChange = (path) => {
    setImagePath(path);
  };

  const handleLocationUpdate = useCallback((lat, long) => {
    setLatitude(lat);
    setLongitude(long);
  });

  const handleLocationSearch = async () => {
    const city = await getCityFromCoordinates(latitude, longitude, apiKey);
    dispatch(setCurrentCity(city));
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
      username: values.createUsername.toLowerCase(),
      password: values.password,
      profilePicPath: imagePath || null,
    };

    try {
      const response = await fetch(
        "https://75cf-2603-8000-c0f0-a570-6dc7-d7ce-1fbb-44ee.ngrok-free.app/signup",
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
    <>
      <LocateRestaurants onLocationUpdate={handleLocationUpdate} />
      <Logo />
      <UploadProfileImage handleImageChange={handleImageChange} />
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
                  <Text style={styles.inputLabels}>Create Username</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={handleChange("createUsername")}
                    onBlur={handleBlur("createUsername")}
                    value={values.createUsername}
                    autoCapitalize="none"
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
    color: "red",
    marginTop: -5,
  },
  buttonContainer: {
    marginBottom: 30,
  },
});

export default SignUpScreen;
