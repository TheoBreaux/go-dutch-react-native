import { View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import Constants from "expo-constants";
import FavoriteDinerCard from "./FavoriteDinerCard";

const FavoriteDinersList = ({ favoriteDiners, refreshControl }) => {
  const filteredFavoritedDiners = favoriteDiners
    ? favoriteDiners.filter((diner) => diner.isFavorited)
    : [];

  const [imageURIs, setImageURIs] = useState({});
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    const s3 = new AWS.S3({
      accessKeyId: Constants.expoConfig.extra.AWS_ACCESS_KEY,
      secretAccessKey: Constants.expoConfig.extra.AWS_SECRET_KEY,
      region: Constants.expoConfig.extra.AWS_BUCKET_REGION,
    });

    const getImageFromS3 = async (profileImageKey, dinerUsername) => {
      setIsLoadingImage(true);
      const params = {
        Bucket: Constants.expoConfig.extra.AWS_BUCKET_NAME,
        Key: profileImageKey,
      };

      try {
        const data = await s3.getObject(params).promise();
        setImageURIs((prevState) => ({
          ...prevState,
          [dinerUsername]: `data:image/jpeg;base64,${data.Body.toString(
            "base64"
          )}`,
        }));
      } catch (error) {
        console.error("Error retrieving image from S3:", error);
      } finally {
        setIsLoadingImage(false);
      }
    };



    
    // Check if the image is already cached before making an API call
    favoriteDiners.forEach((diner) => {
      const dinerUsername = diner.username;
      if (!imageURIs[dinerUsername]) {
        const profileImageKey = diner.profileImageKey;
        getImageFromS3(profileImageKey, dinerUsername);
      }
    });
  }, [favoriteDiners, imageURIs]);




  const renderFavoriteDinerCard = ({ item }) => {
    return (
      <FavoriteDinerCard
        item={item}
        isLoadingImage={isLoadingImage}
        imageURIs={imageURIs}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={filteredFavoritedDiners}
        renderItem={renderFavoriteDinerCard}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={10}
        refreshControl={refreshControl}
      />
    </View>
  );
};

export default FavoriteDinersList;
