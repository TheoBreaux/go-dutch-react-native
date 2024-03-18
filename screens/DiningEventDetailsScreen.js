import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import Logo from "../components/Logo";

import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Colors from "../constants/colors";
import PrimaryButton from "../components/PrimaryButton";

const DiningEventDetailsScreen = ({ route }) => {
  const [diners, setDiners] = useState([]);
  const [viewReceipt, setViewReceipt] = useState(false);
  const navigation = useNavigation();

  const { item } = route.params;
  const { imageUri } = route.params;

  const dateObj = new Date(item.dining_date);
  const eventId = item.event_id;

  // Extract the year, month, and day from the Date object
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const day = dateObj.getDate();

  useEffect(() => {
    getAdditionalDiners();
  }, []);

  const renderItem = ({ item }) => (
    //onpress needs to naviaget to ViewUserProfile
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        navigation.navigate("ViewUserProfileScreen", { selectedUser: item })
      }
    >
      <Text>@{item.additionalDinerUsername}</Text>
      <Text>${item.diner_meal_cost}</Text>
    </TouchableOpacity>
  );

  const handleReturnToHistory = () => {
    navigation.goBack();
  };

  // fetch additional diners from a specific dining eventId
  const getAdditionalDiners = async () => {
    try {
      const response = await fetch(
        `https://5a08-2603-8000-c0f0-a570-71c6-1bf7-216d-37ac.ngrok-free.app/additionaldiners/${eventId}`
      );
      const data = await response.json();
      setDiners(data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Logo />
      <View style={styles.cardContainer}>
        <View style={styles.contentContainer}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: 360,
                marginBottom: 10,
              }}
            >
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.button}>
                <Button
                  title="X"
                  color={Colors.goDutchRed}
                  onPress={handleReturnToHistory}
                />
              </View>
            </View>
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



          <View>
            <Text style={styles.text}>{month + " " + day + ", " + year}</Text>
            <Text style={[styles.text, styles.bold]}>
              {item.restaurant_bar}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Primary Diner: </Text>@
              {item.primary_diner_username}
            </Text>
          </View>




          <View style={styles.additionalDinerContainer}>
            <Text style={styles.additionalDinerText}>Diners</Text>
          </View>

          <FlatList
            data={diners}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
          />
          <Text style={styles.totalMealCostText}>
            Total Meal Cost: ${item.total_meal_cost}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 16,
    marginTop: -5,
    margin: 5,
    borderRadius: 8,
    shadowColor: Colors.goDutchBlue,
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
    marginBottom: 5,
  },
  bold: {
    fontFamily: "red-hat-bold",
  },
  additionalDinerContainer: {
    width: 360,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  additionalDinerText: {
    fontSize: 20,
    fontFamily: "red-hat-bold",
    textAlign: "center",
    color: Colors.goDutchRed,
  },
  flatListContainer: {
    flexGrow: 1,
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
    shadowColor: Colors.goDutchBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default DiningEventDetailsScreen;
