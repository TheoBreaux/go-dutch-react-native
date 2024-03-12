import { Image, TouchableOpacity } from "react-native";
import AWS from "aws-sdk";
import Constants from "expo-constants";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CustomProfileIcon = ({ width, height, onPress, borderRadius }) => {
  const [imageUri, setImageUri] = useState(null);

  const user = useSelector((state) => state.userInfo.user);
  const profileImageKey = user.profileImageKey;

  useEffect(() => {
    const s3 = new AWS.S3({
      accessKeyId: Constants.expoConfig.extra.AWS_ACCESS_KEY,
      secretAccessKey: Constants.expoConfig.extra.AWS_SECRET_KEY,
      region: Constants.expoConfig.extra.AWS_BUCKET_REGION,
    });

    const getImageFromS3 = async () => {
      const params = {
        Bucket: Constants.expoConfig.extra.AWS_BUCKET_NAME,
        Key: profileImageKey,
      };

      try {
        const data = await s3.getObject(params).promise();
        setImageUri(`data:image/jpeg;base64,${data.Body.toString("base64")}`);
      } catch (error) {
        console.error("Error retrieving image from S3:", error);
      }
    };

    getImageFromS3();
  }, [profileImageKey]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={{ uri: imageUri }}
        style={{ width, height, borderRadius, resizeMode: "cover" }}
      />
    </TouchableOpacity>
  );
};

export default CustomProfileIcon;
