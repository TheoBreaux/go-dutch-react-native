import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import Logo from "../components/Logo";
import Colors from "../constants/colors";
import SecondaryButton from "../components/SecondaryButton";
import { useState } from "react";
import { ErrorMessage, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setCurrentCity, setUser } from "../store/store";
import { getCityFromCoordinates } from "../utils";
import { useCallback } from "react";
import LocateRestaurants from "../ui/LocateRestaurants";

const LogInScreen = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const apiKey = "AIzaSyCXB87rKoiCqEI_As-a_eytKZZRDADW_ig";

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

  const handleLocationUpdate = useCallback((lat, long) => {
    setLatitude(lat);
    setLongitude(long);
  });

  const handleLocationSearch = async () => {
    const city = await getCityFromCoordinates(latitude, longitude, apiKey);
    dispatch(setCurrentCity(city));
  };

  const handleFormSubmit = async (values) => {
    const userInfo = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await fetch(
        "https://75cf-2603-8000-c0f0-a570-6dc7-d7ce-1fbb-44ee.ngrok-free.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      } else {
        dispatch(setUser(data));
        handleLocationSearch();
        navigation.navigate("Main", { screen: "Home" });
      }
    } catch (error) {
      console.error(error);
    }
    Keyboard.dismiss();
  };

  return (
    <>
      <LocateRestaurants onLocationUpdate={handleLocationUpdate} />
      <Logo />
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleSubmit, handleBlur, values }) => (
            <View style={styles.logInInputs}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                autoCapitalize="none"
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

              <View>
                <SecondaryButton onPress={handleSubmit}>Submit</SecondaryButton>
              </View>
              <View>
                <Text style={[styles.errorText, styles.noUserExists]}>
                  {error}
                </Text>
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
  passwordToggle: {
    position: "absolute",
    top: 30,
    right: 10,
  },
  passwordToggleText: {
    color: Colors.goDutchRed,
  },
  errorText: {
    marginTop: -5,
    color: "red",
  },
  noUserExists: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 18,
  },
});

export default LogInScreen;
