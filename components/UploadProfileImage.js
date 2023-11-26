import React, { useState, useEffect } from "react";
import { Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const UploadProfileImage = () => {
  const defaultProfileIcon = (
    <MaterialCommunityIcons
      name="face-man-profile"
      size={200}
      color={Colors.goDutchRed}
    />
  );

  const [image, setImage] = useState(null);

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

  const addImage = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!image.canceled) {
      setImage(image.assets[0].uri);
    } else {
      setImage(defaultProfileIcon);
    }
  };

  return (
    <View style={styles.imageIconUploadContainer}>
      <View style={styles.container}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        ) : (
          <View style={styles.defaultIconContainer}>
            <MaterialCommunityIcons
              name="face-man-profile"
              size={100}
              color={Colors.goDutchRed}
            />
          </View>
        )}

        <View style={styles.uploadBtnContainer}>
          <TouchableOpacity onPress={addImage} style={styles.uploadBtn}>
            <Text style={styles.text}>
              {image ? "Edit" : "Upload"} Profile Image
            </Text>
            <AntDesign name="camera" size={30} color={Colors.goDutchBlue} />
          </TouchableOpacity>
        </View>
      </View>
      {/* <Text style={styles.text}>Please upload profile image</Text> */}
    </View>
  );
};
const styles = StyleSheet.create({
  imageIconUploadContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  container: {
    elevation: 4,
    height: 200,
    width: 200,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 100,
    overflow: "hidden",
  },
  defaultIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchBlue,
    marginTop: 5,
  },
});

export default UploadProfileImage;
