import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ErrorMessage, Formik } from "formik";
import Colors from "../constants/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { updateDinerProfileImageKey } from "../store/store";
import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";

const UserProfileScreen = () => {
  //for uploading image to backend
  const FormData = global.FormData;

  const [profileImageKey, setProfileImageKey] = useState();
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState(false);
  const [imagePath, setImagePath] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const username = useSelector((state) => state.userInfo.user.username);
  const user = useSelector((state) => state.userInfo.user);

  const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Please grant camera roll permissions inside your system's settings"
      );
    } else {
      console.log("Media Permissions are granted");
    }
  };

  useEffect(() => {
    checkForCameraRollPermission();
  }, []);

  const onButtonPress = () => {
    setImageUploadModal(!imageUploadModal);
  };

  const uploadImage = async (mode) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        setImageUploadModal(false);
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        setImageUploadModal(false);
      }
      if (!result.canceled) {
        //save image
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert("Error uploading image: 😥", error.message);
    }
  };

  const saveImage = async (profileImageKey) => {
    //update display image
    setProfileImageKey(profileImageKey);
    setImageUploadModal(false);
  };

  const removeImage = () => {
    saveImage(null);
    setImageUploadModal(false);
  };

  const postData = async () => {
    let imageKey;

    //send to AWS S3 bucket
    if (profileImageKey) {
      try {
        const formData = new FormData();

        formData.append("image", {
          uri: profileImageKey,
          type: "image/png",
          name: "profile-image",
        });

        const response = await fetch(
          "https://db5d-2603-8000-c0f0-a570-4019-5e91-620e-3551.ngrok-free.app/users/profileimages",
          {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            body: formData,
          }
        );
        const responseData = await response.json();
        imageKey = responseData.imageKey;
        dispatch(updateDinerProfileImageKey(imageKey));
        setProfileImageKey(imageKey);
        console.log(imageKey);
      } catch (error) {
        console.error("Error uploading image to AWS S3:", error);
      }
    }

    const userData = {
      profileImageKey: imageKey,
      username: username,
    };

    try {
      const response = await fetch(
        "https://db5d-2603-8000-c0f0-a570-4019-5e91-620e-3551.ngrok-free.app/profilephoto",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const updateProfileImage = () => {
    //make call to backend to update file path
    postData();
    //navigate back to user home page
    navigation.navigate("Main", { screen: "Home" });
  };

  // Form
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    createUsername: "",
    password: "",
    confirmedPassword: "",
    profileImageKey: "",
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
    setLoading(true);
    let imageKey;

    //send to AWS S3 bucket
    if (imagePath) {
      try {
        const formData = new FormData();

        formData.append("image", {
          uri: imagePath,
          type: "image/png",
          name: "profile-image",
        });

        const response = await fetch(
          "https://db5d-2603-8000-c0f0-a570-4019-5e91-620e-3551.ngrok-free.app/users/profileimages",
          {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            body: formData,
          }
        );
        const responseData = await response.json();
        imageKey = responseData.imageKey;
      } catch (error) {
        console.error("Error uploading image to AWS S3:", error);
      }
    }

    const newUser = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.createUsername.toLowerCase(),
      password: values.password,
      profileImageKey: imageKey || null,
    };

    try {
      const response = await fetch(
        "https://db5d-2603-8000-c0f0-a570-4019-5e91-620e-3551.ngrok-free.app/signup",
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

  console.log(user);

  return (
    <>
      <Logo />
      <View style={styles.container}>
        {imageUploadModal && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={imageUploadModal}
          >
            <View style={styles.overlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>Profile Photo</Text>

                  <View style={styles.photoOptionsContainer}>
                    <TouchableOpacity>
                      <View style={styles.modalIconContainer}>
                        <MaterialCommunityIcons
                          name="camera-outline"
                          size={40}
                          color={Colors.goDutchRed}
                          onPress={() => uploadImage()}
                        />
                        <Text style={styles.modalOptionText}>Camera</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.modalIconContainer}>
                        <MaterialCommunityIcons
                          name="image-outline"
                          size={40}
                          color={Colors.goDutchRed}
                          onPress={() => uploadImage("gallery")}
                        />
                        <Text style={styles.modalOptionText}>Gallery</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.modalIconContainer}>
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={40}
                          color={Colors.goDutchRed}
                          onPress={removeImage}
                        />
                        <Text style={styles.modalOptionText}>Remove</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
        <Text style={styles.editText}>Edit Profile</Text>
        <View style={styles.cameraIconContainer}>
          <MaterialCommunityIcons
            name="camera"
            size={30}
            color={Colors.goDutchRed}
            onPress={onButtonPress}
          />
        </View>

        <View style={styles.imageIconcontainer}>
          {profileImageKey ? (
            <Image
              source={{ uri: profileImageKey }}
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
        {profileImageKey && (
          <PrimaryButton onPress={updateProfileImage}>Update</PrimaryButton>
        )}

        {/* Form */}
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    justifyContent: "center",
    // padding: 16,
    alignItems: "center",
  },
  editText: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },

  cameraIconContainer: {
    backgroundColor: "lightgrey",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    borderWidth: 2,
    borderColor: Colors.goDutchBlue,
    top: 100,
    left: 275,
  },
  imageIconcontainer: {
    elevation: 10,
    height: 200,
    width: 200,
    position: "relative",
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: Colors.goDutchRed,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(162, 164, 167, 0.563)",
    padding: 10,
    width: 80,
    borderRadius: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    height: 200,
    width: 350,
  },
  modalText: {
    fontFamily: "red-hat-bold",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 10,
  },
  photoOptionsContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  modalOptionText: {
    fontFamily: "red-hat-bold",
    fontSize: 15,
    textAlign: "center",
  },

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

export default UserProfileScreen;
