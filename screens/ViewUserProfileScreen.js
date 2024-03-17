import { StyleSheet, Text, View, Image } from "react-native";
import Logo from "../components/Logo";
import AWS from "aws-sdk";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import Spinner from "../components/Spinner";

const ViewUserProfile = ({ route }) => {
  const [imageUri, setImageUri] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const { selectedUser } = route.params;

  const firstName = selectedUser.first_name;
  const lastName = selectedUser.last_name;
  const profileImageKey = selectedUser.profile_image_key;

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

        <Text style={styles.userFullName}>{firstName + " " + lastName}</Text>
        <Text style={styles.username}>@{selectedUser.username}</Text>
        <View style={styles.bioContainer}>
          <Text style={styles.bio}>{selectedUser.bio}</Text>
        </View>

        <Text style={styles.birthday}>{selectedUser.birthday}</Text>
        <Text style={styles.favoriteCuisine}>
          {selectedUser.favoriteCuisine}
        </Text>

        <Text style={styles.location}>{selectedUser.location}</Text>
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
  imageIconcontainer: {
    elevation: 10,
    height: 200,
    width: 200,
    position: "relative",
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 10,
  },
  userFullName: {
    fontFamily: "red-hat-bold",
    fontSize: 40,
  },
  username: {
    fontFamily: "red-hat-bold",
    fontSize: 18,
    margin: 5,
  },
  bioContainer: {
    borderWidth: 2,
    borderColor: "#ddd",
    padding: 20,
    borderRadius: 10,
  },
  bio: {
    fontFamily: "red-hat-normal",
    fontSize: 18,
    textAlign: "center",
  },
});

export default ViewUserProfile;
