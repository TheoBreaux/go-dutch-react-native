import Constants from "expo-constants";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import AWS from "aws-sdk";

const ProfileImageMedallion = ({
  profileImageKey,
  iconSize,
  width,
  height,
  borderRadius,
}) => {
  const [imageUri, setImageUri] = useState(null);

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
    <View>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.profilePic,
            {
              width: width || 40,
              height: height || 40,
              borderRadius: borderRadius || 20,
            },
          ]}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    resizeMode: "cover",
  },
});

export default ProfileImageMedallion;
