import Constants from "expo-constants";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import AWS from "aws-sdk";
import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const DiningEventHistoryCard = ({ item }) => {
  const [imageUri, setImageUri] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const navigation = useNavigation();
  const dateObj = new Date(item.dining_date);
  const receiptImageKey = item.receipt_image_key;

  // Extract the year, month, and day from the Date object
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const day = dateObj.getDate();

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
        Key: receiptImageKey,
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
  }, [receiptImageKey]);

  const showEventDetails = () => {
    navigation.navigate("DiningEventDetailsScreen", { item, imageUri });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={showEventDetails}>
      {isLoadingImage && (
        <Spinner children={"Loading..."} indicatorSize={55} fontSize={20} />
      )}
      {!isLoadingImage && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{month + " " + day + ", " + year}</Text>
        <Text style={[styles.text, styles.bold]}>{item.restaurant_bar}</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Primary Diner: </Text>@
          {item.primary_diner_username}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    // borderColor: Colors.goDutchRed,
    // borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 3,
    shadowColor: Colors.goDutchRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  title: {
    fontSize: 20,
    fontFamily: "red-hat-normal",
    letterSpacing: 3,
    color: Colors.goDutchRed,
  },
  image: {
    width: 100,
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "red-hat-normal",
  },
  bold: {
    fontFamily: "red-hat-bold",
  },
});

export default DiningEventHistoryCard;
