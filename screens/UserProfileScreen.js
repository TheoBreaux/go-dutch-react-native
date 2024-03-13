import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { updateDinerProfileImageKey } from "../store/store";
import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";

const UserProfileScreen = () => {
  //for uploading image to backend
  const FormData = global.FormData;

  const user = useSelector((state) => state.userInfo.user);
  const username = useSelector((state) => state.userInfo.user.username);

  const [profileImageKey, setProfileImageKey] = useState(user.profileImageKey);
  const [imageUploadModal, setImageUploadModal] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  //getting camera permissions
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
      //send photo to AWS
      try {
        const formData = new FormData();

        formData.append("image", {
          uri: profileImageKey,
          type: "image/png",
          name: "profile-image",
        });

        const response = await fetch(
          "https://db5d-2603-8000-c0f0-a570-4019-5e91-620e-3551.ngrok-free.app/users/profileimages/update",
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
      //updating profile Imagekey for AWS
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
        {!profileImageKey && (
          <Text style={styles.text}>Please update profile image</Text>
        )}
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
    top: 140,
    left: 275,
  },
  imageIconcontainer: {
    // elevation: 10,
    height: 200,
    width: 200,
    position: "relative",
    borderRadius: 100,
    overflow: "hidden",
    // marginBottom: 10,
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
});

export default UserProfileScreen;