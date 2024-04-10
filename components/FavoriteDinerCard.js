import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Colors from "../constants/colors";
import FavoritesIconButton from "./FavoritesIconButton";
import Spinner from "./Spinner";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const FavoriteDinerCard = ({ isLoadingImage, imageURIs, item }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const userId = useSelector((state) => state.userInfo.user.userId);
  const navigation = useNavigation();

  const navigateToUserProfile = (selectedUser) => {
    navigation.navigate("ViewUserProfileScreen", {
      source: "FavoriteDinerCard",
      item: selectedUser,
    });
  };

  const handleFavoriteToggle = async () => {
    setIsFavorited((prevIsFavorited) => !prevIsFavorited);

    const newFavoriteDiner = {
      userId: userId,
      favoriteDinerUsername: item.username,
      dateFavorited: new Date().toISOString(),
      isFavorited: isFavorited,
      type: "diner",
    };

    try {
      const response = await fetch(
        "https://83a7-2603-8000-c0f0-a570-98f5-ecae-b39a-6e07.ngrok-free.app/updatefavorite",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFavoriteDiner),
        }
      );

      const data = await response.json();
      if (data.detail) {
        setError(data.detail);
      }
    } catch (error) {
      console.error(error);
    }
    navigation.goBack();
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigateToUserProfile(item)}
    >
      <View style={styles.imageIconContainer}>
        {isLoadingImage ? (
          <Spinner indicatorSize={80} />
        ) : (
          <Image
            source={
              imageURIs[item.username]
                ? { uri: imageURIs[item.username] }
                : require("../assets/default-profile-icon.jpg")
            }
            style={styles.image}
          />
        )}
      </View>

      <View style={styles.dinerInfoContainer}>
        <View style={styles.dinerInfo}>
          <Text style={styles.name}>
            {item.firstName + " " + item.lastName}
          </Text>
          <Text style={styles.text}>@{item.username}</Text>
          <Text style={styles.text}>{item.location}</Text>
        </View>

        <View style={styles.favoritesIconContainer}>
          <FavoritesIconButton
            size={50}
            name={item.isFavorited ? "heart-circle" : "heart-outline"}
            color={item.isFavorited ? Colors.goDutchRed : Colors.goDutchBlue}
            onPress={handleFavoriteToggle}
            isFavorited={item.isFavorited}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 8,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: Colors.goDutchRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  imageIconContainer: {
    height: 80,
    width: 80,
    marginRight: 10,
    borderRadius: 40,
  },
  dinerInfoContainer: { flexDirection: "row", alignItems: "center" },
  dinerInfo: { flexDirection: "column", width: "50%" },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "contain",
  },
  name: { fontSize: 18, fontFamily: "red-hat-bold" },
  text: {
    fontSize: 16,
    fontFamily: "red-hat-normal",
  },
  favoritesIconContainer: { width: "70%" },
});

export default FavoriteDinerCard;
