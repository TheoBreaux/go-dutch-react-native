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
import React, { useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import FavoritesIconButton from "../components/FavoritesIconButton";
import { useSelector } from "react-redux";

const RestaurantDetailsScreen = ({ route }) => {
  const { source, restaurant } = route.params;

  const userId = useSelector((state) => state.userInfo.user.userId);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [notes, setNotes] = useState("");
  const [saveButtonPressed, setSaveButtonPressed] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState(Colors.goDutchBlue);
  const [loading, setLoading] = useState(true); // Added loading state

  const navigation = useNavigation();

  const handleChangeNotes = (text) => {
    setNotes(text);
  };

  useEffect(() => {
    fetchFavoritesStatus();
  }, []);

  const fetchFavoritesStatus = async () => {
    try {
      const response = await fetch(
        `https://2971-2603-8000-c0f0-a570-6ce7-ecef-b5ff-9a39.ngrok-free.app/getfavoritestatus?userId=${userId}&restaurantId=${restaurant.favoriteRestaurantId}`
      );
      const data = await response.json();
      // Set isFavorited based on the response from the server
      setIsFavorited(data.isFavorited);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteRestaurantToggle = async () => {
    //set selected resturant isFavorited value to true
    setIsFavorited((prevIsFavorited) => !prevIsFavorited);

    restaurant.isFavorited = !isFavorited;

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
        "https://2971-2603-8000-c0f0-a570-6ce7-ecef-b5ff-9a39.ngrok-free.app/updatefavoriterestaurants",
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
    navigation.goBack();
  };


  const handleSaveNotes = async () => {
    setSaveButtonPressed(true);
    setSaveButtonText("Saved");
    setSaveButtonColor(Colors.goDutchRed);

    const newNotes = {
      notes: notes,
      favoriteRestaurantId: restaurant.favoriteRestaurantId,
      userId: userId,
    };

    try {
      const response = await fetch(
        "https://2971-2603-8000-c0f0-a570-6ce7-ecef-b5ff-9a39.ngrok-free.app/saverestaurantnotes",
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
    navigation.goBack();
  };

  // Get the screen dimensions
  const screenHeight = Dimensions.get("window").height;

  // Calculate the image height to take up 50% of the screen height
  const imageHeight = screenHeight * 0.45;

  const handleExternalLink = (url) => {
    Linking.openURL(url);
  };

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

                  {source !== "FavoriteRestaurantCard" && ( // Conditional rendering
                    <FavoritesIconButton
                      onPress={handleFavoriteRestaurantToggle}
                      size={35}
                      isFavorited={isFavorited}
                    />
                  )}
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
          <View style={styles.restaurantBioTextContainer}>
            <Text style={styles.restaurantBioText}>{restaurant.bio}</Text>
          </View>

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
  restaurantInfoContainer: { paddingVertical: 10 },
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
    // flexDirection: "row",
    // alignContent: "center",
    // justifyContent: "space-between",
  },
  restaurantHeader: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    // width: "100%",
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
  restaurantBioTextContainer: { marginTop: -10 },
  restaurantBioText: {
    fontSize: 15,
    textAlign: "justify",
    color: "#555151",
    fontFamily: "red-hat-normal",
    paddingHorizontal: 10,
  },
  favoritesIconContainer: {
    position: "absolute",
    left: 80,
    top: 60,
  },
  buttonContainer: { marginHorizontal: -5 },
  buttonText: { fontSize: 25, textDecorationLine: "underline" },
  textInputContainer: {
    paddingHorizontal: 10,
    marginTop: -10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555151",
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    fontFamily: "red-hat-bold",
  },
  saveButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 5,
  },
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

export default RestaurantDetailsScreen;
