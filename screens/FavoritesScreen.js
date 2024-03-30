import { StyleSheet, Text, View, Pressable } from "react-native";
import FavoriteRestaurantsList from "../components/FavoriteRestaurantsList";
import FavoriteDinersList from "../components/FavoriteDinersList";
import Logo from "../components/Logo";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const FavoritesScreen = () => {
  const [favoriteDiners, setFavoriteDiners] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);

  const userId = useSelector((state) => state.userInfo.user.userId);

  const favoritesSaved =
  (!favoriteDiners || favoriteDiners.length === 0) &&
  (!favoriteRestaurants || favoriteRestaurants.length === 0);

  //if there are restaurants favorited and the length is longer thatn diners list, make it active screen
  const activeScreen =
    favoriteDiners && favoriteDiners.length > favoriteRestaurants.length
      ? "Diners"
      : "Restaurants";

  const [activeTab, setActiveTab] = useState(activeScreen);

  useEffect(() => {
    fetchFavorites();
  }, [favoriteRestaurants]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(
        `https://8ca5-2603-8000-c0f0-a570-b992-8298-958c-98c9.ngrok-free.app/getfavoriterestaurants?userId=${userId}`
      );
      const data = await response.json();
      setFavoriteRestaurants(data);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await fetch(
        `https://8ca5-2603-8000-c0f0-a570-b992-8298-958c-98c9.ngrok-free.app/getfavoritediners?userId=${userId}`
      );
      const data = await response.json();
      setFavoriteDiners(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredFavoritedRestaurants = favoriteRestaurants.filter(
    (restaurant) => restaurant.isFavorited
  );

  const filteredFavoritedDiners = favoriteDiners.filter(
    (diner) => diner.isFavorited
  );


  return (
    <>
      <Logo />

      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Pressable
            style={[
              styles.tab,
              activeTab === "Restaurants" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Restaurants")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.title}>Restaurants</Text>
              <Ionicons
                name="restaurant-sharp"
                size={25}
                color={Colors.goDutchRed}
              />
            </View>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "Diners" && styles.activeTab]}
            onPress={() => setActiveTab("Diners")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.title}>Diners</Text>
              <Ionicons
                name="people-circle"
                size={25}
                color={Colors.goDutchRed}
              />
            </View>
          </Pressable>
        </View>

        {favoritesSaved && (
          <Text style={styles.title}>You have no favorites saved.</Text>
        )}

        {activeTab === "Diners" ? (
          <FavoriteDinersList
            filteredFavoritedDinerss={filteredFavoritedDinerss}
          />
        ) : (
          <FavoriteRestaurantsList
            filteredFavoritedRestaurants={filteredFavoritedRestaurants}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: -50,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.goDutchBlue,
    width: "100%",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomColor: Colors.goDutchBlue,
    borderBottomWidth: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopColor: Colors.goDutchBlue,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderLeftColor: Colors.goDutchBlue,
    borderLeftWidth: 1,
    borderRightColor: Colors.goDutchBlue,
    borderRightWidth: 1,
    marginTop: 35,
    marginBottom: 5,
  },
  title: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    textAlign: "center",
    fontSize: 25,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FavoritesScreen;
