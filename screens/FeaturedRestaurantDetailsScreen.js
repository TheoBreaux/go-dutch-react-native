import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";

const FeaturedRestaurantDetailsScreen = ({ route }) => {
  const [imageError, setImageError] = useState(false);
  const { restaurant } = route.params;

  const navigation = useNavigation();

  // Get the screen dimensions
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Calculate the image height to take up 50% of the screen height
  const imageHeight = screenHeight * 0.4;

  console.log(restaurant);

  return (
    <>
      <View style={{ alignItems: "center" }}>
        <View
          style={[styles.restaurantImageContainer, { height: imageHeight }]}
        >
          {imageError ? (
            <Image
              source={require("../assets/restaurant-placeholder.png")}
              style={[styles.restaurantImage, { resizeMode: "contain" }]}
            />
          ) : (
            <Image
              source={{ uri: restaurant.imgUrl }}
              style={styles.restaurantImage}
              onError={() => setImageError(true)}
            />
          )}
        </View>
        {/* <LinearGradient
            colors={[
              "transparent",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0.1)",
              "rgba(0,0,0,0.3)",
              "rgba(0,0,0,0.5)",
            ]}
            style={StyleSheet.absoluteFill}
          /> */}
      </View>
      <TouchableOpacity
        style={styles.returnButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-sharp" size={30} color="#cdc8c8" />
      </TouchableOpacity>
      <View style={{ padding: 10 }}>
        <View style={styles.splitButtonImageContainer}>
          <Image
            source={require("../assets/go-dutch-split-button.png")}
            style={styles.splitButtonImage}
          />
        </View>
      </View>
      <View style={styles.restaurantInfo}>
        <View>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantText}>{restaurant.address}</Text>
          <Text style={styles.restaurantText}>
            {restaurant.city + ", " + restaurant.state + " " + restaurant.zip}
          </Text>
        </View>
        <View>
          <PrimaryButton>Reserve</PrimaryButton>
        </View>
      </View>
      <Text
        style={[
          styles.restaurantText,
          {
            color: "#555151",
            fontFamily: "red-hat-normal",
            padding: 10,
          },
        ]}
      >
        {restaurant.bio}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 16 },
  returnButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 25,
    position: "absolute",
    backgroundColor: Colors.goDutchBlue,
    top: 30,
    left: 20,
  },
  splitButtonImageContainer: {
    borderColor: "#cdc8c8",
    backgroundColor: "white",
    borderWidth: 1,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 45,
    position: "absolute",
    top: -45,
    left: 10,
  },
  splitButtonImage: {
    width: 75,
    height: 75,
    resizeMode: "center",
  },
  restaurantInfo: {
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  restaurantName: {
    fontFamily: "red-hat-bold",
    fontSize: 30,
  },
  restaurantImageContainer: {
    width: "100%",
    resizeMode: "cover",
    position: "relative",
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  restaurantText: {
    fontFamily: "red-hat-bold",
    fontSize: 15,
    textAlign: "justify",
  },
});

export default FeaturedRestaurantDetailsScreen;
