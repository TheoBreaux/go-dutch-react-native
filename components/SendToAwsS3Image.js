import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import AWS from "aws-sdk";
import Constants from "expo-constants";

const SendToAwsS3Image = ({
  imageKey,
  width = 40,
  height = 40,
  borderRadius = 20,
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
        Key: imageKey,
      };

      try {
        const data = await s3.getObject(params).promise();
        setImageUri(`data:image/jpeg;base64,${data.Body.toString("base64")}`);
      } catch (error) {
        console.error("Error retrieving image from S3:", error);
      }
    };

    getImageFromS3();
  }, [imageKey]);

  return (
    <View>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.profilePic,
            {
              width,
              height,
              borderRadius,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    borderWidth: 1,
    borderColor: "black",
    resizeMode: "cover",
  },
});

export default SendToAwsS3Image;
