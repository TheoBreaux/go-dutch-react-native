import Constants from "expo-constants";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import Logo from "../components/Logo";
import { months } from "../data/data";
import { useNavigation } from "@react-navigation/native";
import AWS from "aws-sdk";
import React, { useEffect, useRef, useState } from "react";
import Spinner from "../components/Spinner";

const CheckCloseOutDetails = () => {
  const stampScale = useRef(new Animated.Value(1)).current;
  const stampOpacity = useRef(new Animated.Value(1)).current;
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [viewReceipt, setViewReceipt] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const diningEvent = useSelector((state) => state.diningEvent);
  const eventTitle = diningEvent.event.eventTitle;
  const diners = diningEvent.diners;
  const eventLocation =
    diningEvent.event.selectedRestaurant ||
    diningEvent.event.enteredSelectedRestaurant;
  const primaryDiner = diningEvent.diners[0].additional_diner_username;
  const totalMealCost = diningEvent.event.totalMealCost;
  const eventDate = diningEvent.event.eventDate;
  const receiptImageKey = diningEvent.event.receipt_image_key;
  //convert string date to month, day, year format
  const parts = eventDate.split("-");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  const formattedEventDate = `${months[month - 1]} ${day}, ${year}`;

  const navigation = useNavigation();

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

  useEffect(() => {
    animateStamp();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        navigation.navigate("ViewUserProfileScreen", { selectedUser: item })
      }
    >
      <Text>@{item.additional_diner_username}</Text>
      <Text>${item.diner_meal_cost}</Text>
    </TouchableOpacity>
  );

  const animateStamp = () => {
    Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(stampScale, {
            toValue: 1.5,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(stampScale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ),
      Animated.timing(stampOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimationDone(true);
    });

    // Stop the animation after 3 seconds
    setTimeout(() => {
      setIsAnimationDone(true);
    }, 6000);
  };

  // Get the screen height
  const screenHeight = Dimensions.get("window").height;
  // Calculate the position of the stamp
  const stampPosition = screenHeight / 2 - 300;

  // Dynamic styles
  const stampStyles = StyleSheet.create({
    stamp: {
      position: "absolute",
      top: stampPosition,
      width: 300,
      height: 300,
      resizeMode: "contain",
      zIndex: 5,
    },
  });

  return (
    <>
      <Logo />
      <View style={styles.cardContainer}>
        {!isAnimationDone && (
          <Animated.Image
            source={require("../assets/completed-stamp.png")}
            style={[
              stampStyles.stamp,
              {
                transform: [{ scale: stampScale }],
                opacity: stampOpacity,
              },
            ]}
          />
        )}

        <View style={styles.contentContainer}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 360,
                marginBottom: 10,
              }}
            >
              <Text style={styles.eventTitle}>{eventTitle}</Text>
              <View style={styles.button}>
                <Button
                  title="X"
                  color={Colors.goDutchRed}
                  onPress={() =>
                    navigation.navigate("Main", { screen: "Home" })
                  }
                />
              </View>
            </View>
          </View>

          <View
            style={{
              borderWidth: 5,
              borderColor: Colors.goDutchBlue,
            }}
          >
            {isLoadingImage && <Spinner children={"Loading..."} />}
            {!isLoadingImage && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}
          </View>

          <View>
            <Text style={styles.text}>{formattedEventDate}</Text>
            <Text style={[styles.text, styles.bold]}>{eventLocation}</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Primary Diner: </Text>@{primaryDiner}
            </Text>
          </View>

          {!viewReceipt && (
            <Image
              style={styles.iconImage}
              source={require("../assets/go-dutch-split-button.png")}
            />
          )}

          {!viewReceipt && (
            <PrimaryButton onPress={() => setViewReceipt(!viewReceipt)}>
              View Receipt
            </PrimaryButton>
          )}

          {viewReceipt && (
            <View
              style={{
                borderWidth: 5,
                borderColor: Colors.goDutchBlue,
              }}
            >
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
          )}

          <View style={styles.additionalDinerContainer}>
            <Text style={styles.additionalDinerText}>Diners</Text>
          </View>

          <FlatList
            data={diners}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
          />
          <Text style={styles.totalMealCostText}>
            Total Meal Cost: ${totalMealCost}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 20,
    marginTop: -5,
    margin: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  eventTitle: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 30,
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    width: 30,
  },
  iconImage: {
    width: 250,
    height: 200,
    resizeMode: "center",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "red-hat-normal",
  },
  bold: {
    fontFamily: "red-hat-bold",
  },
  additionalDinerContainer: {
    width: 360,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginBottom: 5,
  },
  additionalDinerText: {
    fontSize: 20,
    fontFamily: "red-hat-bold",
    textAlign: "center",
    color: Colors.goDutchRed,
  },
  flatListContainer: {
    flexGrow: 1,
    // justifyContent: 'space-between',
  },
  totalMealCostText: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 360,
    padding: 8,
    marginBottom: 3,
    backgroundColor: "#fff",
    shadowColor: Colors.goDutchRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  document: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default CheckCloseOutDetails;
