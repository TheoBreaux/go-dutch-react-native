import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Logo from "../components/Logo";
import AWS from "aws-sdk";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import Spinner from "../components/Spinner";
import PrimaryButton from "../components/PrimaryButton";
import FavoritesIconButton from "../components/FavoritesIconButton";
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const ViewUserProfile = ({ route }) => {
  const { selectedUser, source, item } = route.params;

  const [imageUri, setImageUri] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [notes, setNotes] = useState("");
  const [saveButtonPressed, setSaveButtonPressed] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState(Colors.goDutchBlue);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  let favoriteDinerUsername,
    firstName,
    lastName,
    username,
    location,
    bio,
    birthday,
    favoriteCuisine,
    dateJoined,
    profileImageKey;

  if (source === "DiningEventDetailsScreen") {
    favoriteDinerUsername = selectedUser.additionalDinerUsername;
    firstName = selectedUser.firstName;
    lastName = selectedUser.lastName;
    username = selectedUser.additionalDinerUsername;
    location = selectedUser.location;
    bio = selectedUser.bio;
    birthday = selectedUser.birthday;
    favoriteCuisine = selectedUser.favoriteCuisine;
    dateJoined = selectedUser.dateJoined;
    profileImageKey = selectedUser.profileImageKey;
  } else if (source === "FavoriteDinerCard") {
    favoriteDinerUsername = item.username;
    firstName = item.firstName;
    lastName = item.lastName;
    username = item.username;
    location = item.location;
    bio = item.bio;
    birthday = item.birthday;
    favoriteCuisine = item.favoriteCuisine;
    dateJoined = item.dateJoined;
    profileImageKey = item.profileImageKey;
  }

  const date = new Date(dateJoined);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const userId = useSelector((state) => state.userInfo.user.userId);

  const handleChangeNotes = (text) => {
    setNotes(text);
  };

  const handleSaveNotes = async () => {
    setSaveButtonPressed(true);
    setSaveButtonText("Saved");
    setSaveButtonColor(Colors.goDutchRed);

    const newNotes = {
      userId: userId,
      username:
        source === "DiningEventDetailsScreen"
          ? selectedUser.additionalDinerUsername
          : item.username,
      dateFavorited: new Date().toISOString(),
      isFavorited: true,
      notes: notes,
      type: "userNotes",
    };

    try {
      const response = await fetch(
        `https://c33a-2603-8000-c0f0-a570-cc6d-9967-8312-c904.ngrok-free.app/savenotes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNotes),
        }
      );
      const data = await response.json();
      if (data.detail) {
        setError(data.detail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFavoritesStatus();
  }, [isFavorited]);

  const fetchFavoritesStatus = async () => {
    try {
      const response = await fetch(
        `https://c33a-2603-8000-c0f0-a570-cc6d-9967-8312-c904.ngrok-free.app/getfavoritestatus?userId=${userId}&favoriteDinerUsername=${favoriteDinerUsername}`
      );
      const data = await response.json();
      // Set isFavorited based on the response from the server
      setIsFavorited(data.isFavorited);
      setNotes(data.notes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteToggle = async () => {
    setIsFavorited((prevIsFavorited) => !prevIsFavorited);

    const newFavoriteDiner = {
      userId: userId,
      favoriteDinerUsername: selectedUser.additionalDinerUsername,
      dateFavorited: new Date().toISOString(),
      isFavorited: !isFavorited,
      type: "diner",
    };

    try {
      const response = await fetch(
        "https://c33a-2603-8000-c0f0-a570-cc6d-9967-8312-c904.ngrok-free.app/updatefavorite",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFavoriteDiner),
        }
      );

      const data = await response.json();
      if (data.detail) {
        setError(data.detail);
      }
    } catch (error) {
      console.error(error);
    }
    navigation.goBack();
  };

  useEffect(() => {
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
  }, []);

  return (
    <>
      <Logo />
      <KeyboardAvoidingView>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.imageIconContainer}>
            {isLoadingImage && <Spinner indicatorSize={150} />}
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
          <Text style={styles.bold}>
            Member since:{" "}
            <Text style={styles.userInfo}>{month + " " + year}</Text>
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.userFullName}>
              {firstName + " " + lastName}
            </Text>

            {source === "DiningEventDetailsScreen" && (
              <FavoritesIconButton
                onPress={handleFavoriteToggle}
                size={35}
                isFavorited={isFavorited}
              />
            )}
          </View>

          <View style={styles.bioContainer}>
            <View style={styles.aboutContainer}>
              <Text style={styles.bio}>About</Text>
              <Text style={styles.usernameText}> @{username}</Text>
            </View>

            <Text style={styles.bioText}>{bio}</Text>

            <View style={styles.userInfoContainer}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.bold}>
                  Location: <Text style={styles.userInfo}>{location}</Text>
                </Text>

                <Text style={styles.bold}>
                  Birthday: <Text style={styles.userInfo}>{birthday}</Text>
                </Text>

                <Text style={styles.bold}>
                  Favorite Cuisine:{" "}
                  <Text style={styles.userInfo}>{favoriteCuisine}</Text>
                </Text>
              </View>

              <View>
                <PrimaryButton width={100} onPress={() => navigation.goBack()}>
                  Return
                </PrimaryButton>
              </View>
            </View>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.input}
                multiline={true}
                numberOfLines={3}
                onChangeText={handleChangeNotes}
                value={notes}
                placeholder="Enter your notes..."
              />
              <TouchableOpacity
                onPress={handleSaveNotes}
                style={[
                  styles.saveButton,
                  { backgroundColor: saveButtonColor },
                ]}
              >
                <View style={styles.saveButtonContainer}>
                  <Text style={styles.saveButtonText}>{saveButtonText}</Text>
                  {saveButtonPressed && (
                    <Ionicons name="checkmark-sharp" size={20} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Image
            style={styles.backgroundImage}
            source={require("../assets/go-dutch-pattern.png")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageIconContainer: {
    elevation: 10,
    height: 200,
    width: 200,
    position: "relative",
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 5,
  },
  userFullName: {
    fontFamily: "red-hat-bold",
    fontSize: 30,
  },
  bioContainer: {
    borderWidth: 2,
    width: "95%",
    height: "auto",
    borderColor: "#b3b0b0",
    padding: 5,
    borderRadius: 10,
  },
  aboutContainer: { flexDirection: "row", alignItems: "center" },
  bio: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
  },
  usernameText: {
    fontSize: 15,
    color: Colors.goDutchRed,
    fontFamily: "red-hat-bold",
  },
  bioText: {
    fontFamily: "red-hat-normal",
    fontSize: 14,
    textAlign: "justify",
  },
  userInfo: {
    fontFamily: "red-hat-normal",
    textAlign: "left",
    fontSize: 14,
  },
  bold: { fontFamily: "red-hat-bold", fontSize: 16 },
  backgroundImage: {
    height: 500,
    marginTop: 10,
    marginLeft: 40,
    resizeMode: "contain",
  },
  userInfoContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInputContainer: {
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555151",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    fontFamily: "red-hat-bold",
  },
  saveButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: Colors.goDutchBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "red-hat-bold",
  },
});

export default ViewUserProfile;
