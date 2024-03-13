import Constants from "expo-constants";
import React, { useState, useEffect } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  updateDinerProfileImageKey,
  updateUserProfileImageKey,
} from "../store/store";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import AWS from "aws-sdk";
import Spinner from "../components/Spinner";

const ProfileScreen = () => {
  //for uploading image to backend
  const FormData = global.FormData;

  const user = useSelector((state) => state.userInfo.user);
  const username = useSelector((state) => state.userInfo.user.username);

  const [profileImageKey, setProfileImageKey] = useState(user.profileImageKey);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

    const DEFAULT_IMAGE_KEY = "default-profile-icon.jpg";
    


    
    const diningEvent = useSelector((state) => state.diningEvent);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

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

  useEffect(() => {
    // if (profileImageKey && profileImageKey !== DEFAULT_IMAGE_KEY) {
    const s3 = new AWS.S3({
      accessKeyId: Constants.expoConfig.extra.AWS_ACCESS_KEY,
      secretAccessKey: Constants.expoConfig.extra.AWS_SECRET_KEY,
      region: Constants.expoConfig.extra.AWS_BUCKET_REGION,
    });

    const getImageFromS3 = async () => {
      setIsLoadingImage(true);
      const params = {
        Bucket: Constants.expoConfig.extra.AWS_BUCKET_NAME,
        Key: profileImageKey,
      };

      try {
        const data = await s3.getObject(params).promise();
        setImageUri(`data:image/jpeg;base64,${data.Body.toString("base64")}`);
      } catch (error) {
        console.error("Error retrieving image from S3:", error);
      } finally {
        setIsLoadingImage(false);
      }
    };

    getImageFromS3();
    // }
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
        setImageUri(result.assets[0].uri);
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
          "https://db5d-2603-8000-c0f0-a570-4019-5e91-620e-3551.ngrok-free.app/users/profileimages",
          {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            body: formData,
          }
        );
        const responseData = await response.json();
        imageKey = responseData.imageKey;
        dispatch(updateUserProfileImageKey(imageKey));
        dispatch(updateDinerProfileImageKey(imageKey));
        setProfileImageKey(imageKey);
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
        <Text style={styles.text}>Edit Profile</Text>
        <View style={styles.cameraIconContainer}>
          <MaterialCommunityIcons
            name="camera"
            size={30}
            color={Colors.goDutchRed}
            onPress={onButtonPress}
          />
        </View>
        <View style={styles.imageIconcontainer}>
          {isLoadingImage && <Spinner indicatorSize={200} />}
          {!isLoadingImage && profileImageKey ? (
            <Image
              source={{ uri: imageUri }}
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

        {isEditingProfile ? (
          isEditingProfile && (
            <>
              <Text>FORM</Text>
              <PrimaryButton onPress={updateProfileImage}>Submit</PrimaryButton>
            </>
          )
        ) : (
          <PrimaryButton onPress={() => setIsEditingProfile(true)}>
            Edit Profile
          </PrimaryButton>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    justifyContent: "center",
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
    top: 160,
    borderColor: Colors.goDutchBlue,
    left: 270,
  },
  text: {
    marginTop: -10,
    fontFamily: "red-hat-bold",
    fontSize: 25,
    color: "black",
    margin: 5,
  },
  imageIconcontainer: {
    zIndex: 0,
    // elevation: 10,
    height: 200,
    width: 200,
    position: "relative",
    borderWidth: 1,
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
});

export default ProfileScreen;
