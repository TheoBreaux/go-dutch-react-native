import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import Logo from "./Logo";
import { Picker } from "@react-native-picker/picker";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useState } from "react";
import LocateUser from "./LocateUser";

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
};

const NewSplitForm = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  const handleRestaurantDataReceived = (restaurantData) => {
    setRestaurants(restaurantData);
  };

  const initialValues = {
    eventDate: getCurrentDate(),
    selectedRestaurant: "",
    enteredSelectedRestaurant: "",
    eventTitle: "",
  };

  const validateForm = (values) => {
    const errors = {};

    if (!values.selectedRestaurant && !values.enteredSelectedRestaurant) {
      errors.selectedRestaurant = "Please select or enter your restaurant";
    }

    if (!values.eventTitle) {
      errors.eventTitle = "Please create an event title";
    }

    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return errors;
  };

  const changeRestaurantHandler = () => {
    console.log("close");
  };

  // console.log("NEW SPLIT FORM DATA:", restaurants.results.length);

  return (
    <>
      <LocateUser onRestaurantDataReceived={handleRestaurantDataReceived} />
      <Logo />

      <ScrollView>
        <Image
          style={styles.friendsImage}
          source={require("../images/friends.png")}
        />
        <Text style={styles.title}>SELECT A DINING EXPERIENCE</Text>
        <View style={styles.container}>
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={(values, actions) => {
              actions.resetForm();
              console.log(values);
            }}>
            {({ handleChange, handleSubmit, handleBlur, values }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date:</Text>
                <TextInput
                  style={styles.input}
                  value={getCurrentDate()}
                  editable={false}
                />

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Select a dining experience:</Text>
                  <View>
                    <Picker
                      style={styles.input}
                      selectedValue={values.selectedRestaurant}
                      onValueChange={handleChange("selectedRestaurant")}
                      onBlur={handleBlur("selectedRestaurant")}>
                      {restaurants.results.map((restaurant) => (
                          <Picker.Item
                            key={restaurant.place_id}
                            value={restaurant.name}
                            id={restaurant.vicinity}
                          />
                        ))}
                    </Picker>
                  </View>
                  <ErrorMessage
                      name="selectedRestaurant"
                      component={Text}
                      style={styles.errorText}
                    />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Restaurant/Bar:</Text>
                  <View style={styles.exitRestaurant}>
                    <View style={styles.button}>
                      <Button
                        color={Colors.goDutchRed}
                        title="X"
                        onPress={changeRestaurantHandler}
                      />
                    </View>
                    <TextInput
                      style={styles.restaurantInput}
                      value={values.selectedRestaurant}
                      editable={false}
                    />
                  </View>
                  <Text style={styles.notListedText}>
                    Not listed? Input below
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Input unlisted restaurant:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("enteredSelectedRestaurant")}
                    onBlur={handleBlur("enteredSelectedRestaurant")}
                    value={values.enteredSelectedRestaurant}
                  />
                  <ErrorMessage
                    name="selectedRestaurant"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Title:</Text>
                  <TextInput
                    style={styles.input}
                    value={values.eventTitle}
                    onChangeText={handleChange("eventTitle")}
                    onBlur={handleBlur("eventTitle")}
                  />
                  <ErrorMessage
                    name="eventTitle"
                    component={Text}
                    style={styles.errorText}
                  />
                </View>

                <View>
                  <SecondaryButton onPress={handleSubmit}>
                    Continue
                  </SecondaryButton>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
  },
  friendsImage: {
    marginTop: -15,
    width: 400,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    color: Colors.goDutchBlue,
    fontSize: 25,
    marginTop: -15,
    marginBottom: -20,
  },
  notListedText: {
    color: "red",
    fontSize: 12,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    marginTop: 5,
    fontFamily: "red-hat-regular",
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "100%",
  },
  exitRestaurant: {
    flexDirection: "row",
    width: "100%",
  },
  restaurantInput: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "88%",
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    padding: 0,
    margin: 0,
    marginRight: "2%",
    width: "10%",
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#fc8181",
  },
});

export default NewSplitForm;
