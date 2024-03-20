import Constants from "expo-constants";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import Logo from "../components/Logo";
import { months } from "../data/data";
import { useNavigation } from "@react-navigation/native";
import AWS from "aws-sdk";
import React, { useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import PrimaryButton from "../components/PrimaryButton";

const CheckCloseOutDetailsScreen = ({ route }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const [viewReceipt, setViewReceipt] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const diningEvent = useSelector((state) => state.diningEvent);
  const diners = diningEvent.diners;
  const eventLocation =
    diningEvent.event.selectedRestaurant ||
    diningEvent.event.enteredSelectedRestaurant;
  const eventTitle = useSelector((state) => state.diningEvent.event.eventTitle);
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

  // const { finalBirthdayDinerNumbers } = route.params;

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

  const renderItem = ({ item }) => (
    <View style={{ zIndex: 100 }}>
      <TouchableOpacity
        style={styles.dinerCard}
        onPress={() => {
          navigation.navigate("ViewUserProfileScreen", { selectedUser: item });
        }}
      >
        <Text style={styles.dinerCardInfo}>
          @{item.additionalDinerUsername}
          {item.primaryDiner && (
            <Text style={{ color: Colors.goDutchRed }}>PRIMARY DINER</Text>
          )}
        </Text>
        <Text style={styles.dinerCardInfo}>
          ${item.dinerMealCost} {item.celebratingBirthday ? "🎂" : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Logo />

      <LottieView
        source={require("../assets/confetti-animation.json")}
        style={styles.confettiBurst}
        autoPlay={true}
        loop={false}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        {!viewReceipt && (
          <Image
            style={styles.iconImage}
            source={require("../assets/go-dutch-split-button.png")}
          />
        )}

        {!viewReceipt && (
          <View style={{ flexDirection: "row", zIndex: 100 }}>
            <PrimaryButton
              height={50}
              onPress={() => setViewReceipt(!viewReceipt)}
            >
              View Receipt
            </PrimaryButton>
          </View>
        )}

        {viewReceipt && (
          <View>
            <View
              style={{
                borderWidth: 5,
                borderColor: Colors.goDutchBlue,
              }}
            >
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>

            {viewReceipt && (
              <View style={{ zIndex: 10 }}>
                <PrimaryButton
                  height={50}
                  onPress={() =>
                    navigation.navigate("Main", { screen: "Home" })
                  }
                >
                  Close
                </PrimaryButton>
              </View>
            )}
          </View>
        )}

        <View>
          <Text style={styles.text}>{eventTitle}</Text>
          <Text style={styles.text}>{formattedEventDate}</Text>
        </View>

        <View style={styles.additionalDinerContainer}>
          <Text
            style={[styles.text, styles.bold, { color: Colors.goDutchBlue }]}
          >
            {eventLocation}
          </Text>
          <Text style={styles.additionalDinerText}>Diners</Text>
        </View>

        {/* <View style={styles.marginText}>
          <Text style={styles.marginOfError}>Diner Meal Cost (+/- $0.05)</Text>
        </View> */}

        <FlatList
          data={diners}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
        />

        <Text style={styles.totalMealCostText}>
          Total Meal Cost: ${totalMealCost}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    flex: 1,
  },
  eventTitle: {
    textAlign: "center",
    fontFamily: "red-hat-normal",
    color: Colors.goDutchRed,
    fontSize: 30,
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    width: "10%",
    borderColor: "black",
    borderWidth: 2,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
  },
  additionalDinerText: {
    fontSize: 20,
    fontFamily: "red-hat-bold",
    textAlign: "center",
    color: Colors.goDutchRed,
  },
  // flatListContainer: {
  //   marginBottom: 1,
  // },
  totalMealCostText: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
  },
  marginText: {
    alignSelf: "flex-end",
    paddingRight: 25,
    paddingBottom: 5,
  },
  marginOfError: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
  },
  dinerCard: {
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
  dinerCardInfo: {
    fontFamily: "red-hat-bold",
    fontSize: 16,
  },
  confettiBurst: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
});

export default CheckCloseOutDetailsScreen;
