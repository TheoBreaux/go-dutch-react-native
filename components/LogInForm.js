import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import Logo from "./Logo";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";
import { useEffect, useState } from "react";
import { ErrorMessage, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCity, setRestaurantList, setUser } from "../store/store";
import * as Location from "expo-location";
import { useCallback } from "react";
import { getCityFromCoordinates } from "../utils";


const LogInForm = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    getLocationAsync();
  }, []);

  //get current location coordinates
  const getLocationAsync = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      try {
        let location = await Location.getCurrentPositionAsync({});

        setHasLocationPermission(true);
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        await handleRestaurantSearch();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Location permission not granted");
    }
  }, []);

  const handleLocationSearch = async () => {
    const city = await getCityFromCoordinates(latitude, longitude, apiKey);
    dispatch(setCurrentCity(city));
  };

  const handleRestaurantSearch = async () => {
    if (hasLocationPermission) {
      const url =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
      const location = `location=${latitude},${longitude}`;
      const radius = "&radius=2000";
      const type = "&keyword=restaurant";
      const key = "&key=AIzaSyCXB87rKoiCqEI_As-a_eytKZZRDADW_ig";
      const restaurantSearchUrl = url + location + radius + type + key;

      try {
        const response = await fetch(restaurantSearchUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const data = result.results;
        console.log("THIS IS THE DATA RESULT:", data);
        dispatch(setRestaurantList(data));
        return data;
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }
  };

  const handleFormSubmit = async (values) => {
    const userInfo = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await fetch(
        "https://0e24-2603-8000-c0f0-a570-6cee-6c44-f20e-afc7.ngrok-free.app/login",
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


  const restaurantList = useSelector((state) => state.userInfo.restaurantList);
  console.log(restaurantList);
  console.log(restaurantList);
  console.log(restaurantList)
  console.log(restaurantList)
  console.log(restaurantList)
  console.log(restaurantList)
  console.log(restaurantList)




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
                  style={styles.passwordToggle}>
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

export default LogInForm;
