import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import Colors from "../constants/colors";
import SecondaryButton from "../components/SecondaryButton";
import { ErrorMessage, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { logOut, setUser, updateUserInfo } from "../store/store";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const UpdateProfileForm = ({
  updateProfileImage,
  setIsUpdatingProfile,
  setShowUpdatePasswordAndPaymentModal,
}) => {
  const [formValues, setFormValues] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.userInfo.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setFormValues(initialValues);
  }, []);

  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    bio: user.bio,
    favoriteCuisine: user.favoriteCuisine,
    birthday: user.birthday,
    location: user.location,
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "Can't be left blank";
    }

    if (!values.lastName) {
      errors.lastName = "Can't be left blank";
    }

    if (!values.email) {
      errors.email = "Can't be left blank";
    } else if (!isValidEmail(values.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!values.username) {
      errors.username = "Can't be left blank";
    }

    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleLogOut = () => {
    dispatch(logOut());
    navigation.navigate("Welcome");
  };

  const handleFormSubmit = async (values, actions) => {
    setIsUpdatingProfile(true);
    //update profile Image
    await updateProfileImage();
    //reset Form
    actions.resetForm();

    const updatedUserInfo = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.username.toLowerCase(),
      bio: values.bio,
      favoriteCuisine: values.favoriteCuisine,
      birthday: values.birthday,
      location: values.location,
      userId: user.userId,
      type: "userInfoProfileUpdate",
    };

    dispatch(updateUserInfo(updatedUserInfo));

    try {
      const response = await fetch(
        "https://d580-2603-8000-c0f0-a570-a14e-4f47-d368-7088.ngrok-free.app/updateprofile",
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
      setError("An error occurred while updating profile.");
    }
  };

  const updateProfileComponentHeight = 600;
  const formInputsHeight = 200;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height; // Get the screen height
  const buttonWidth = screenWidth - 32;
  const buttonMarginTop = Math.max(
    screenHeight - 100 - formInputsHeight - updateProfileComponentHeight,
    0
  ); // Ensure button is at least 50 pixels from the bottom

  return (
    <View style={styles.inputContainer}>
      <Formik
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleSubmit, handleBlur }) => (
          <>
            <View style={styles.fullScreenWidthInputContainer}>
              <Text style={styles.inputLabels}>Bio</Text>
              <TextInput
                style={[styles.input, { height: "auto" }]}
                placeholder="Enter your bio here..."
                multiline={true}
                numberOfLines={2}
                textAlignVertical="top"
                autoCapitalize="sentences"
                onChangeText={(text) => {
                  setFormValues({ ...formValues, bio: text });
                  handleChange("bio")(text);
                }}
                onBlur={handleBlur("bio")}
                value={formValues.bio}
              />
            </View>

            <View style={styles.fullScreenWidthInputContainer}>
              <Text style={styles.inputLabels}>Favorite Cuisine</Text>
              <TextInput
                style={styles.input}
                placeholder="Share your favorite cuisine..."
                textAlignVertical="top"
                autoCapitalize="sentences"
                onChangeText={(text) => {
                  setFormValues({ ...formValues, favoriteCuisine: text });
                  handleChange("favoriteCuisine")(text);
                }}
                onBlur={handleBlur("favoriteCuisine")}
                value={formValues.favoriteCuisine}
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfScreenWidthInput}>
                <Text style={styles.inputLabels}>First Name</Text>

                <TextInput
                  style={[styles.input, { marginRight: 5 }]}
                  onChangeText={(text) => {
                    setFormValues({ ...formValues, firstName: text });
                    handleChange("firstName")(text);
                  }}
                  onBlur={handleBlur("firstName")}
                  value={formValues.firstName}
                />

                <ErrorMessage
                  name="firstName"
                  component={Text}
                  style={styles.errorText}
                />
              </View>

              <View style={styles.halfScreenWidthInput}>
                <Text style={styles.inputLabels}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    setFormValues({ ...formValues, lastName: text });
                    handleChange("lastName")(text);
                  }}
                  onBlur={handleBlur("lastName")}
                  value={formValues.lastName}
                />
                <ErrorMessage
                  name="lastName"
                  component={Text}
                  style={styles.errorText}
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfScreenWidthInput}>
                <Text style={styles.inputLabels}>Username</Text>
                <TextInput
                  style={[styles.input, { marginRight: 5 }]}
                  onChangeText={(text) => {
                    setFormValues({ ...formValues, username: text });
                    handleChange("username")(text);
                  }}
                  onBlur={handleBlur("username")}
                  value={formValues.username}
                  autoCapitalize="none"
                />
                <ErrorMessage
                  name="username"
                  component={Text}
                  style={styles.errorText}
                />
              </View>
              <View style={styles.halfScreenWidthInput}>
                <Text style={styles.inputLabels}>Email</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    setFormValues({ ...formValues, email: text });
                    handleChange("email")(text);
                  }}
                  onBlur={handleBlur("email")}
                  value={formValues.email}
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <ErrorMessage
                  name="email"
                  component={Text}
                  style={styles.errorText}
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfScreenWidthInput}>
                <Text style={styles.inputLabels}>Birthday</Text>

                <TextInput
                  style={[styles.input, { marginRight: 5 }]}
                  placeholder="ex. June 21"
                  onChangeText={(text) => {
                    setFormValues({ ...formValues, birthday: text });
                    handleChange("birthday")(text);
                  }}
                  onBlur={handleBlur("birthday")}
                  value={formValues.birthday}
                />
              </View>

              <View style={styles.halfScreenWidthInput}>
                <Text style={styles.inputLabels}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex. Los Angeles, CA"
                  onChangeText={(text) => {
                    setFormValues({ ...formValues, location: text });
                    handleChange("location")(text);
                  }}
                  onBlur={handleBlur("location")}
                  value={formValues.location}
                />
              </View>
            </View>

            <View
              style={[styles.buttonContainer, { marginTop: buttonMarginTop }]}
            >
              <SecondaryButton
                width={buttonWidth}
                onPress={() => {
                  setShowUpdatePasswordAndPaymentModal(true);
                }}
              >
                Return
              </SecondaryButton>
              <SecondaryButton width={buttonWidth} onPress={handleSubmit}>
                Save
              </SecondaryButton>

              <SecondaryButton width={buttonWidth} onPress={handleLogOut}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.logOutText}>Log Out</Text>
                  <Entypo name="log-out" size={30} color="white" />
                </View>
              </SecondaryButton>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: -25,
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  fullScreenWidthInputContainer: {
    width: "100%",
  },
  inputLabels: {
    marginTop: 5,
    fontFamily: "red-hat-normal",
  },
  rowContainer: {
    flexDirection: "row",
  },
  halfScreenWidthInput: {
    width: "50%",
  },
  input: {
    fontFamily: "red-hat-bold",
    padding: 10,
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 200,
  },
  logOutText: {
    color: "whitesmoke",
    fontSize: 18,
    fontFamily: "red-hat-bold",
    marginRight: 5,
  },
  errorText: {
    color: "red",
  },
});

export default UpdateProfileForm;
