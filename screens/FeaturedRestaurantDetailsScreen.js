import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import FavoritesIconButton from "../components/FavoritesIconButton";
import { useDispatch, useSelector } from "react-redux";

const FeaturedRestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;

  const userId = useSelector((state) => state.userInfo.user.userId);

  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [notes, setNotes] = useState("");
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [saveButtonPressed, setSaveButtonPressed] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState(Colors.goDutchBlue);

  const navigation = useNavigation();

  const handleChangeNotes = (text) => {
    setNotes(text);
  };

  const handleFavoriteRestaurantToggle = async () => {
    //set selected resturant isFavorited value to true
    setIsFavorited((prevIsFavorited) => !prevIsFavorited);

    const newFavoriteRestaurant = {
      favoriteRestaurantId: restaurant.restaurantId,
      userId: userId,
      name: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      zip: restaurant.zip,
      rating: restaurant.rating,
      bio: restaurant.bio,
      website: restaurant.website,
      phone: restaurant.phone,
      dateFavorited: new Date().toISOString(),
      isFavorited: !isFavorited,
      imgUrl: restaurant.imgUrl,
    };

    try {
      const response = await fetch(
        "https://c16a-2603-8000-c0f0-a570-19a1-7ff5-79b9-aef1.ngrok-free.app/updatefavoriterestaurants",
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

  const handleSaveNotes = async () => {
    setSaveButtonPressed(true);
    setSaveButtonText("Saved");
    setSaveButtonColor(Colors.goDutchRed);

    const newNotes = {
      notes: notes,
      favoriteRestaurantId: restaurant.restaurantId,
      userId: userId,
    };

    try {
      const response = await fetch(
        "https://c16a-2603-8000-c0f0-a570-19a1-7ff5-79b9-aef1.ngrok-free.app/saverestaurantnotes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNotes),
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

  // Get the screen dimensions
  const screenHeight = Dimensions.get("window").height;

  // Calculate the image height to take up 50% of the screen height
  const imageHeight = screenHeight * 0.45;

  const handleExternalLink = (url) => {
    Linking.openURL(url);
  };

  console.log("RESTAURANT", restaurant);

  return (
    <>
      <SafeAreaView>
        <ScrollView>
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
          </View>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-sharp" size={30} color="#cdc8c8" />
          </TouchableOpacity>

          <View style={styles.restaurantInfoContainer}>
            <View style={styles.splitButtonImageContainer}>
              <Image
                source={require("../assets/go-dutch-split-button.png")}
                style={styles.splitButtonImage}
              />
            </View>
          </View>
          <View style={[styles.restaurantInfo]}>
            <View>
              <View style={styles.restaurantHeader}>
                <View style={{ flexDirection: "row", marginBottom: -5 }}>
                  <Text style={styles.restaurantNameAndRating}>
                    {restaurant.name}
                  </Text>

                  <FavoritesIconButton
                    onPress={handleFavoriteRestaurantToggle}
                    size={35}
                    isFavorited={isFavorited}
                  />
                </View>

                <Text style={styles.restaurantNameAndRating}>
                  {restaurant.rating + " ⭐"}
                </Text>
              </View>

              <Text style={styles.restaurantText}>{restaurant.address}</Text>
              <Text style={styles.restaurantText}>
                {restaurant.city +
                  ", " +
                  restaurant.state +
                  " " +
                  restaurant.zip}
              </Text>

              <View style={styles.buttonContainer}>
                <PrimaryButton
                  onPress={() => handleExternalLink(restaurant.website)}
                >
                  Reserve{" "}
                  <Text style={styles.buttonText}>{restaurant.name}</Text>
                </PrimaryButton>
              </View>
            </View>
          </View>
          <Text style={styles.restaurantBioText}>{restaurant.bio}</Text>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.input}
              multiline={true}
              numberOfLines={2}
              onChangeText={handleChangeNotes}
              value={notes}
              placeholder="Enter your notes..."
            />
            <TouchableOpacity
              onPress={handleSaveNotes}
              style={[styles.saveButton, { backgroundColor: saveButtonColor }]}
            >
              <View style={styles.saveButtonContainer}>
                <Text style={styles.saveButtonText}>{saveButtonText}</Text>
                {saveButtonPressed && (
                  <Ionicons name="checkmark-sharp" size={20} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
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
  restaurantInfoContainer: { padding: 10 },
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
    marginTop: 15,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  restaurantHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  restaurantNameAndRating: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
    flexWrap: "wrap",
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
  restaurantBioText: {
    fontSize: 15,
    textAlign: "justify",
    color: "#555151",
    fontFamily: "red-hat-normal",
    padding: 10,
    marginTop: -10,
  },
  favoritesIconContainer: {
    position: "absolute",
    left: 80,
    top: 60,
  },
  buttonContainer: { marginBottom: -15, marginHorizontal: -5 },
  buttonText: { fontSize: 25, textDecorationLine: "underline" },
  textInputContainer: {
    marginBottom: -10,
    padding: 10,
    marginTop: -10,
  },
  input: {
    marginTop: -25,
    borderWidth: 1,
    borderColor: "#555151",
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    fontFamily: "red-hat-bold",
  },
  saveButtonContainer: { flexDirection: "row", alignItems: "center" },
  saveButton: {
    backgroundColor: Colors.goDutchBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "red-hat-bold",
  },
});

export default FeaturedRestaurantDetailsScreen;
