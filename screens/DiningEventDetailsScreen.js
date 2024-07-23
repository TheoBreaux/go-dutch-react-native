import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Logo from "../components/Logo";
import Constants from "expo-constants";
import AWS from "aws-sdk";
import { useEffect, useState } from "react";
import Colors from "../constants/colors";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import Spinner from "../components/Spinner";

const DiningEventDetailsScreen = ({ route }) => {
  const [dinerData, setDinerData] = useState([]);
  const [eventData, setEventData] = useState({});
  const [viewReceipt, setViewReceipt] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const { item } = route.params;

  const navigation = useNavigation();

  const receiptImageKey = item.receiptImageKey;
  const dateObj = new Date(item.diningDate);
  const eventId = item.eventId;

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

  useEffect(() => {
    getAdditionalDiners();
  }, []);

  const renderItem = ({ item }) => (
    //onpress needs to naviaget to ViewUserProfile
    <TouchableOpacity
      style={styles.dinerCard}
      onPress={() =>
        navigation.navigate("ViewUserProfileScreen", {
          source: ["DiningEventDetailsScreen", "CheckCloseOutDetailsScreen"],
          selectedUser: item,
        })
      }
    >
      <Text style={styles.dinerCardInfo}>
        @{item.additionalDinerUsername}
        {item.primaryDiner === item.additionalDinerUsername && (
          <Text style={{ color: Colors.goDutchRed }}> PRIMARY DINER</Text>
        )}
      </Text>

      <Text style={styles.dinerCardInfo}>
        ${item.dinerMealCost} {item.celebratingBirthday ? "🎂" : ""}
      </Text>
    </TouchableOpacity>
  );

  const handleReturnToHistory = () => {
    navigation.goBack();
  };

  // fetch additional diners from a specific dining eventId
  const getAdditionalDiners = async () => {
    try {
      const response = await fetch(
        `https://5574-76-32-124-165.ngrok-free.app/additionaldiners/${eventId}`
      );
      const data = await response.json();
      setDinerData(data.dinerData);
      setEventData(data.eventData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Logo />

      {isLoadingImage && (
        <View style={styles.spinnerContainer}>
          <Spinner children="Requesting data...🧾" />
        </View>
      )}

      {!isLoadingImage && (
        <View style={styles.contentContainer}>
          {!viewReceipt && (
            <Image
              style={styles.iconImage}
              source={require("../assets/go-dutch-split-button.png")}
            />
          )}

          {!viewReceipt && (
            <View style={{ flexDirection: "row" }}>
              <PrimaryButton
                width={140}
                height={50}
                onPress={() => setViewReceipt(!viewReceipt)}
              >
                View Receipt
              </PrimaryButton>
              <PrimaryButton
                width={140}
                height={50}
                onPress={() => navigation.goBack()}
              >
                Go Back
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
                  <PrimaryButton height={50} onPress={handleReturnToHistory}>
                    Return to History
                  </PrimaryButton>
                </View>
              )}
            </View>
          )}

          <View>
            <Text style={styles.eventTitle}>{eventData.eventTitle}</Text>
            <Text style={styles.eventDate}>
              {month + " " + day + ", " + year}
            </Text>
          </View>

          <View style={styles.additionalDinerContainer}>
            <Text
              style={[styles.text, styles.bold, { color: Colors.goDutchBlue }]}
            >
              {eventData.eventLocation}
            </Text>
            <Text style={styles.additionalDinerText}>Diners</Text>
          </View>

          <FlatList data={dinerData} renderItem={renderItem} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.totalMealCostText}>
              Total Meal Cost: ${eventData.totalMealCost}
            </Text>
            <Text style={styles.marginOfErrorText}>(± $0.05)</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -50,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
  },
  eventTitle: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 30,
  },
  eventDate: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    color: Colors.goDutchBlue,
    fontSize: 25,
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
  totalMealCostText: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
    marginBottom: 20,
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
  marginOfErrorText: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 15,
    marginBottom: 20,
  },
});

export default DiningEventDetailsScreen;
