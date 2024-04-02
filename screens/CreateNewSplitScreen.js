import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "../constants/colors";
import SecondaryButton from "../components/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDate } from "../utils";
import ReceiptCapture from "../ui/ReceiptCapture";
import { setDiningEvent } from "../store/store";

const CreateNewSplitScreen = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCapturingReceipt, setIsCapturingReceipt] = useState(false);

  const dispatch = useDispatch();
  const restaurantList = useSelector((state) => state.userInfo.restaurantList);

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
      errors.selectedRestaurant =
        "Please select or enter your restaurant below";
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

  const handleDiningEventSubmit = (values) => {
    dispatch(setDiningEvent(values));
    setIsCapturingReceipt(!isCapturingReceipt);
  };

  return (
    <>
      {isCapturingReceipt ? (
        <ReceiptCapture
          setIsCapturingReceipt={setIsCapturingReceipt}
          isCapturingReceipt={isCapturingReceipt}
        />
      ) : (
        <>
          {!isCapturingReceipt && (
            <ScrollView>
              <View>
                <Image
                  style={styles.friendsImage}
                  source={require("../assets/friends2.jpg")}
                />
                <View style={styles.overlay} />
              </View>

              <View style={styles.container}>
                <Formik
                  initialValues={initialValues}
                  validate={validateForm}
                  onSubmit={handleDiningEventSubmit}
                >
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
                            }
                          >
                            <Picker.Item
                              label="Select a restaurant..."
                              value=""
                            />
                            {sortedRestaurantList.map((restaurant) => (
                              <Picker.Item
                                key={restaurant.place_id}
                                label={
                                  restaurant.name + ", " + restaurant.vicinity
                                }
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
                              onPress={() =>
                                changeRestaurantHandler(handleChange)
                              }
                            />
                          </View>
                          <TextInput
                            style={styles.restaurantInput}
                            value={
                              values.enteredSelectedRestaurant ||
                              values.selectedRestaurant
                            }
                            editable={false}
                          />
                        </View>

                        {!isFormValid && (
                          <Text style={styles.notListedText}>
                            Not listed? Input below
                          </Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                          Input unlisted restaurant:
                        </Text>
                        <TextInput
                          style={styles.input}
                          onChangeText={handleChange(
                            "enteredSelectedRestaurant"
                          )}
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
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
  },
  friendsImage: {
    width: "100%",
    height: 325,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    marginRight: "2%",
    width: "10%",
    borderColor: "black",
    borderWidth: 2,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
  },
});

export default CreateNewSplitScreen;
