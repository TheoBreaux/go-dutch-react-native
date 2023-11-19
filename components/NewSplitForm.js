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
import { useSelector } from "react-redux";
import { getCurrentDate } from "../utils";
import ReceiptCapture from "./ReceiptCapture";

const NewSplitForm = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState(0);
  const [isCapturingReceipt, setIsCapturingReceipt] = useState(false);

  const restaurantList = useSelector((state) => state.userInfo.restaurantList);
  const primaryDinerUsername = useSelector(
    (state) => state.userInfo.user.username
  );

  const sortedRestaurantList = restaurantList
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

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

  const changeRestaurantHandler = (handleChange) => {
    handleChange("selectedRestaurant")("");
    handleChange("enteredSelectedRestaurant")("");
  };

  //SEND TO DATABASE AS DINING EXPERIENCE BEGINNING

  const handleFormSubmit = async (values, actions) => {
    actions.resetForm();
    const diningEventInfo = {
      dining_date: getCurrentDate(),
      restaurant_bar: values.selectedRestaurant,
      title: values.eventTitle,
      primary_diner_username: primaryDinerUsername,
      tax: null,
      tip: null,
      total_meal_cost: null,
    };
    try {
      const response = await fetch(
        "https://0e24-2603-8000-c0f0-a570-6cee-6c44-f20e-afc7.ngrok-free.app/diningevents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(diningEventInfo),
        }
      );
      const result = await response.json();
      setEventId(result.event_id);
      setIsCapturingReceipt(!isCapturingReceipt);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(eventId);

  return (
    <>
      <Logo />
      {!isCapturingReceipt && (
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
              onSubmit={handleFormSubmit}>
              {({ handleChange, handleSubmit, handleBlur, values }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date:</Text>
                  <TextInput
                    style={styles.input}
                    value={getCurrentDate()}
                    editable={false}
                  />

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                      Select a dining experience:
                    </Text>
                  </View>

                  <View>
                    <View>
                      <Picker
                        style={styles.input}
                        selectedValue={values.selectedRestaurant}
                        onValueChange={(itemValue, itemIndex) =>
                          handleChange("selectedRestaurant")(itemValue)
                        }>
                        <Picker.Item label="Select a restaurant..." value="" />
                        {sortedRestaurantList.map((restaurant) => (
                          <Picker.Item
                            key={restaurant.place_id}
                            label={restaurant.name + ", " + restaurant.vicinity}
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
                          onPress={() => changeRestaurantHandler(handleChange)}
                        />
                      </View>
                      <TextInput
                        style={styles.restaurantInput}
                        value={values.enteredSelectedRestaurant}
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
                      placeholder="Input unlisted restaurant"
                    />
                    <ErrorMessage
                      name="enteredSelectedRestaurant"
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
                      placeholder="ex. Tonya's birthday dinner"
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
      )}
      {isCapturingReceipt && <ReceiptCapture />}
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
    marginTop: 2,
    fontFamily: "red-hat-bold",
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    color: "black",
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
    color: Colors.goDutchBlue,
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
    color: "red",
  },
});

export default NewSplitForm;
