import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AWS from "aws-sdk";
import Constants from "expo-constants";
import Spinner from "./Spinner";

const FavoriteDinersList = () => {
  const [imageUri, setImageUri] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const navigation = useNavigation();
  const favoriteDiners = useSelector(
    (state) => state.userInfo.favoriteDinersList
  );

  const navigateToUserProfile = (selectedUser) => {
    navigation.navigate("ViewUserProfileScreen", { selectedUser });
  };

  useEffect(() => {
    const s3 = new AWS.S3({
      accessKeyId: Constants.expoConfig.extra.AWS_ACCESS_KEY,
      secretAccessKey: Constants.expoConfig.extra.AWS_SECRET_KEY,
      region: Constants.expoConfig.extra.AWS_BUCKET_REGION,
    });

    const getImageFromS3 = async (profileImageKey) => {
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

    favoriteDiners.forEach((diner) => {
      console.log("PROFIE", diner);
      const profileImageKey = diner.profileImageKey;
      getImageFromS3(profileImageKey);
    });
  }, [favoriteDiners]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => navigateToUserProfile(item)}
      >
        <View style={styles.imageIconContainer}>
          {isLoadingImage && <Spinner indicatorSize={200} />}
          {!isLoadingImage && imageUri ? (
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
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={[
                styles.text,
                { fontFamily: "red-hat-bold", width: "50%" },
              ]}
            >
              {item.additionalDinerUsername}
            </Text>
            <Text
              style={[
                styles.text,
                { fontFamily: "red-hat-bold", width: "50%" },
              ]}
            >
              {item.birthday + " ⭐"}
            </Text>
          </View>

          <Text style={[styles.text, { fontFamily: "red-hat-bold" }]}>
            {item.birthday}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  console.log("FAVORITE DINERS", favoriteDiners);

  return (
    <View>
      <FlatList
        data={favoriteDiners}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    width: "auto",
    elevation: 2,
    shadowColor: Colors.goDutchRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: 100,
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: "red-hat-normal",
  },
});

export default FavoriteDinersList;
