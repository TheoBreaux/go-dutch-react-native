import { Image, StyleSheet, Text, Pressable, View } from "react-native";
import React, { useState } from "react";
import FavoritesIconButton from "./FavoritesIconButton";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useAnimatedKeyboard } from "react-native-reanimated";

const FavoriteRestaurantCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const [favorited, setFavorited] = useState(item.isFavorited);
  const [error, setError] = useState(null);

  const userId = useSelector((state) => state.userInfo.user.userId);
  const navigation = useNavigation();

  const navigateToFeaturedRestuarantDetails = (restaurant) => {
    navigation.navigate("RestaurantDetailsScreen", {
      restaurant,
      source: "FavoriteRestaurantCard",
    });
  };

  const handleFavoriteToggle = async () => {
    //set selected resturant isFavorited value to true
    setFavorited((prevIsFavorited) => !prevIsFavorited);

    item.isFavorited = !favorited;

    const newFavoriteRestaurant = {
      favoriteRestaurantId: item.favoriteRestaurantId,
      userId: userId,
      name: item.name,
      address: item.address,
      city: item.city,
      state: item.state,
      zip: item.zip,
      rating: item.rating,
      bio: item.bio,
      website: item.website,
      phone: item.phone,
      dateFavorited: new Date().toISOString(),
      isFavorited: !favorited,
      imgUrl: item.imgUrl,
      type: "restaurant",
    };

    try {
      const response = await fetch(
        "https://e4ed-2603-8000-c0f0-a570-8006-1cea-bf13-870d.ngrok-free.app/updatefavorite",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFavoriteRestaurant),
        }
      );

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() => navigateToFeaturedRestuarantDetails(item)}
    >
      <View>
        {imageError ? (
          <Image
            source={require("../assets/restaurant-placeholder.png")}
            style={styles.image}
          />
        ) : (
          <Image
            source={{ uri: item.imgUrl }}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        )}
      </View>

      <View style={styles.restaurantInfo}>
        <View style={{ width: "55%" }}>
          <Text style={styles.text}>{item.name}</Text>

          <Text style={styles.address}>{item.address}</Text>
          <Text style={styles.address}>
            {item.city + ", " + item.state + " " + item.zip}
          </Text>

          <Text style={styles.text}>{item.phone}</Text>
        </View>

        <View style={{ width: "45%" }}>
          <FavoritesIconButton
            size={50}
            onPress={handleFavoriteToggle}
            isFavorited={favorited}
          />
        </View>
      </View>
    </Pressable>
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
  restaurantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  address: {
    fontSize: 16,
    fontFamily: "red-hat-normal",
  },
  text: {
    fontSize: 16,
    fontFamily: "red-hat-bold",
  },
});

export default FavoriteRestaurantCard;
