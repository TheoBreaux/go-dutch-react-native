import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

const FeaturedRestaurantCard = ({ restaurant }) => {
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);

  const navigateToFeaturedRestuarantDetails = () => {
    navigation.navigate("FeaturedRestaurantDetailsScreen", { restaurant });
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={navigateToFeaturedRestuarantDetails}
    >
      <View>
        {imageError ? (
          <Image
            source={require("../assets/restaurant-placeholder.png")}
            style={[styles.image, {resizeMode: "contain"}]}
          />
        ) : (
          <Image
            source={{ uri: restaurant.imgUrl }}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        )}
      </View>
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={[styles.text, { fontFamily: "red-hat-bold", width: "50%" }]}
          >
            {restaurant.name}
          </Text>
          <Text
            style={[styles.text, { fontFamily: "red-hat-bold", width: "50%" }]}
          >
            {restaurant.rating + " ⭐"}
          </Text>
        </View>

        <Text style={styles.text}>{restaurant.address}</Text>
        <Text style={styles.text}>
          {restaurant.city + ", " + restaurant.state + " " + restaurant.zip}
        </Text>
        <Text style={[styles.text, { fontFamily: "red-hat-bold" }]}>
          {restaurant.phone}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    width: "auto",
    elevation: 2,
    shadowColor: Colors.goDutchRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: 100,
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: "red-hat-normal",
  },
});

export default FeaturedRestaurantCard;
