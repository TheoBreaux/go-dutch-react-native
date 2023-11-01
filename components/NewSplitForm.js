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
import Footer from "./Footer";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useState } from "react";

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NewSplitForm = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");

  const initialValues = {
    eventDate: getCurrentDate(),
    selectedRestaurant: "",
    inputSelectedRestaurant: "",
    eventTitle: "",
  };

  const validateForm = (values) => {
    const errors = {};

    if (!values.selectedRestaurant || !values.inputSelectedRestaurant) {
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

  // const continueHandler = () => {
  //   console.log("coontinue");
  // };

  return (
    <>
      <Logo />
      <Image
        style={styles.friendsImage}
        source={require("../images/friends.png")}
      />
      <Text style={styles.title}>SELECT A DINING EXPERIENCE</Text>
      <ScrollView>
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
                      {/* {restaurants.map((item, index) => (
                        <Picker.Item
                          key={item.abbreviation}
                          value={item.name}
                          label={item.name}
                        />
                      ))} */}
                    </Picker>
                  </View>
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
                    <TextInput style={styles.restaurantInput}></TextInput>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Input unlisted restaurant:</Text>
                  <TextInput style={styles.input} />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Title:</Text>
                  <TextInput style={styles.input} />
                </View>

                <View>
                  <SecondaryButton onPress={handleSubmit}>
                    Submit
                  </SecondaryButton>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
      <Footer />
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
    marginTop: -20,
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
  },
  inputContainer: {
    width: "100%",
  },
  label: {
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
});

export default NewSplitForm;
