import React, { useState, useEffect } from "react";
import { Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Logo from "../components/Logo";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const UpdateProfileImage = () => {
  const [imagePath, setImagePath] = useState(null);
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

  const addImage = async () => {
    let selectedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!selectedImage.canceled) {
      setImagePath(selectedImage.assets[0].uri);
    } else {
      setImagePath(null);
    }
  };

  const profilePicSelectedStyles = imagePath
    ? { borderColor: Colors.goDutchRed, borderWidth: 1 }
    : "";

  const postData = async () => {
    const userData = {
      profilePicPath: imagePath,
      username: username,
    };

    try {
      const response = await fetch(
        "https://68a9-2603-8000-c0f0-a570-6935-af29-f20-ded2.ngrok-free.app/profilephoto",
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
      <View style={styles.imageIconUploadContainer}>
        <View style={[styles.container, profilePicSelectedStyles]}>
          {imagePath ? (
            <>
              <Image
                source={{ uri: imagePath }}
                style={{ width: 200, height: 200 }}
              />
            </>
          ) : (
            <View style={styles.defaultIconContainer}>
              <MaterialCommunityIcons
                name="face-man-profile"
                size={150}
                color={Colors.goDutchRed}
              />
            </View>
          )}

          <View style={styles.uploadBtnContainer}>
            <TouchableOpacity onPress={addImage} style={styles.uploadBtn}>
              <Text style={styles.text}>
                {imagePath ? "Edit" : "Update"} Profile Image
              </Text>
              <AntDesign name="camera" size={30} color={Colors.goDutchBlue} />
            </TouchableOpacity>
          </View>
        </View>

        {imagePath && (
          <PrimaryButton onPress={updateProfileImage}>Update</PrimaryButton>
        )}
        {!imagePath && (
          <Text style={styles.text}>Please update profile image</Text>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  imageIconUploadContainer: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -150,
  },
  container: {
    elevation: 4,
    height: 200,
    width: 200,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 10,
  },
  defaultIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
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
    fontSize: 15,
    color: Colors.goDutchBlue,
    marginTop: 5,
  },
});

export default UpdateProfileImage;
