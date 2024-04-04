import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/colors";

const UploadProfileImage = ({ handleImageChange }) => {
  const [image, setImage] = useState();
  const [imageUploadModal, setImageUploadModal] = useState(false);

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
        handleImageChange(result.assets[0].uri);
      }
    } catch (error) {
      alert("Error uploading image: 😥", error.message);
    }
  };

  const saveImage = async (image) => {
    //update display image
    setImage(image);
    setImageUploadModal(false);
  };

  const removeImage = () => {
    saveImage(null);
    setImageUploadModal(false);
  };

  return (
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
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        ) : (
          <View>
            <Image
              source={require("../assets/default-profile-icon.jpg")}
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
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
    top: 140,
    borderColor: Colors.goDutchBlue,
    left: 260,
  },
  imageIconcontainer: {
    zIndex: 0,
    elevation: 5,
    height: 200,
    width: 200,
    position: "relative",
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#000",
  },
  text: {
    fontFamily: "red-hat-bold",
    fontSize: 15,
    color: "black",
    marginTop: 5,
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

export default UploadProfileImage;
