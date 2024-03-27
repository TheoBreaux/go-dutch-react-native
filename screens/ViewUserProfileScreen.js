import { StyleSheet, Text, View, Image } from "react-native";
import Logo from "../components/Logo";
import AWS from "aws-sdk";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import Spinner from "../components/Spinner";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import FavoritesIconButton from "../components/FavoritesIconButton";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/colors";
import { assignAndRemoveFavoriteDiners } from "../store/store";

const ViewUserProfile = ({ route }) => {
  const [imageUri, setImageUri] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const { selectedUser } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const firstName = selectedUser.firstName;
  const lastName = selectedUser.lastName;
  const username = selectedUser.additionalDinerUsername;
  const bio = selectedUser.bio;
  const birthday = selectedUser.birthday;
  const favoriteCuisine = selectedUser.favoriteCuisine;
  const location = selectedUser.location;
  const profileImageKey = selectedUser.profileImageKey;
  const dateJoined = selectedUser.dateJoined;
  const date = new Date(dateJoined);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const isFavorited = useSelector((state) => {
    const favoriteDinersList = state.userInfo.favoriteDinersList;

    const dinerNameToFind = selectedUser.additionalDinerUsername;

    const foundDiner = favoriteDinersList.find((selectedUser) => {
      return selectedUser.additionalDinerUsername === dinerNameToFind;
    });

    return foundDiner ? foundDiner.isFavorited : false;
  });

  const handleFavorites = (selectedUser) => {
    dispatch(assignAndRemoveFavoriteDiners(selectedUser));
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
      <View style={styles.container}>
        <View style={styles.imageIconContainer}>
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
          <Text style={styles.userFullName}>{firstName + " " + lastName}</Text>

          <FavoritesIconButton
            size={50}
            name={selectedUser.isFavorited ? "heart-circle" : "heart-outline"}
            color={
              selectedUser.isFavorited ? Colors.goDutchRed : Colors.goDutchBlue
            }
            onPress={() => handleFavorites(selectedUser)}
            isFavorited={isFavorited}
          />
        </View>

        <Text style={styles.username}>@{username}</Text>

        <View style={styles.bioContainer}>
          <Text style={styles.bio}>About</Text>
          <Text style={styles.bioText}>{bio}</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
        </View>

        <Image
          style={styles.backgroundImage}
          source={require("../assets/go-dutch-pattern.png")}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIconContainer: {
    marginTop: 20,
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
    fontSize: 40,
    // marginBottom: -5,
  },
  username: {
    fontFamily: "red-hat-bold",
    fontSize: 18,
    marginBottom: 5,
  },
  bioContainer: {
    borderWidth: 2,
    width: "95%",
    height: "auto",
    borderColor: "#b3b0b0",
    padding: 5,
    borderRadius: 10,
  },
  bio: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
  },
  bioText: {
    fontFamily: "red-hat-normal",
    fontSize: 15,
    // marginBottom: 5,
    textAlign: "justify",
  },
  userInfo: {
    fontFamily: "red-hat-normal",
    textAlign: "left",
    fontSize: 15,
  },
  bold: { fontFamily: "red-hat-bold", fontSize: 16 },
  backgroundImage: {
    height: 500,
    marginTop: 10,
    marginLeft: 40,
    resizeMode: "contain",
  },
});

export default ViewUserProfile;
