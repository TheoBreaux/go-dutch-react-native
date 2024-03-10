import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/colors";
import Logo from "../components/Logo";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PrimaryButton from "../components/PrimaryButton";

const UpdateProfileImageScreen = () => {
  const [image, setImage] = useState();
  const [imageUploadModal, setImageUploadModal] = useState(false);

  const username = useSelector((state) => state.userInfo.user.username);

  const navigation = useNavigation();

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

  const saveImage = async (image) => {
    //update display image
    setImage(image);
    //save make API call to save
    // sendToBackEnd();
    setImageUploadModal(false);
  };

  const removeImage = () => {
    saveImage(null);
    setImageUploadModal(false);
  };

  const postData = async () => {
    const userData = {
      profilePicPath: image,
      username: username,
    };

    try {
      const response = await fetch(
        "https://6f5f-2603-8000-c0f0-a570-e5b7-47a9-2b5c-7a47.ngrok-free.app/profilephoto",
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

        <View style={styles.cameraIconContainer}>
          <MaterialCommunityIcons
            name="camera"
            size={30}
            color={Colors.goDutchRed}
            onPress={onButtonPress}
          />
        </View>

        <View style={styles.imageIconcontainer}>
          {image ? (
            <Image
              source={{ uri: image }}
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
        {image && (
          <PrimaryButton onPress={updateProfileImage}>Update</PrimaryButton>
        )}
        {!image && <Text style={styles.text}>Please update profile image</Text>}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginTop: 150,
    padding: 16,
    alignItems: "center",
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
    left: 270,
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
  text: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
    color: "black",
    margin: 5,
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

export default UpdateProfileImageScreen;
