import { View, FlatList } from "react-native";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import Constants from "expo-constants";
import FavoriteDinerCard from "./FavoriteDinerCard";

const FavoriteDinersList = ({
  isDinerFavorited,
  handleFavorites,
  favoriteDiners,
}) => {
  // const filteredFavoritedDiners = favoriteDiners
  //   ? favoriteDiners.filter((diner) => diner.isFavorited)
  //   : [];

  const [imageURIs, setImageURIs] = useState({});
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // const favoriteDiners = useSelector(
  //   (state) => state.userInfo.favoriteDinersList
  // );

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

    favoriteDiners.forEach((diner) => {
      const profileImageKey = diner.profileImageKey;
      const dinerUsername = diner.additionalDinerUsername;
      getImageFromS3(profileImageKey, dinerUsername);
    });
  }, [favoriteDiners]);

  const renderFavoriteDinerCard = (item) => {
    return (
      <FavoriteDinerCard
        key={item.additionalDinerUsername}
        item={item}
        isLoadingImage={isLoadingImage}
        imageURIs={imageURIs}
        isDinerFavorited={isDinerFavorited}
        handleFavorites={handleFavorites}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={favoriteDiners}
        renderItem={({ item }) => renderFavoriteDinerCard(item)}
        keyExtractor={(item) => item.additionalDinerUsername}
      />
    </View>
  );
};

export default FavoriteDinersList;
