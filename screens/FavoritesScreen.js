import {
  StyleSheet,
  Text,
  View,
  Pressable,
  RefreshControl,
} from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);
  
  const userId = useSelector((state) => state.userInfo.user.userId);

  const favoritesSaved =
    (!favoriteDiners || favoriteDiners.length === 0) &&
    (!favoriteRestaurants || favoriteRestaurants.length === 0);

  //if there are restaurants favorited and the length is longer thatn diners list, make it active screen
  const activeScreen =
    favoriteDiners && favoriteDiners.length > favoriteRestaurants.length
      ? "Diners"
      : "Restaurants";

  const [activeTab, setActiveTab] = useState("Restaurants");

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites("restaurants");
    fetchFavorites("diners");
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulating a delay of 2 seconds for demonstration purpo
  };

  useEffect(() => {
    fetchFavorites("restaurants");
    fetchFavorites("diners");
  }, [activeTab]);

  const fetchFavorites = async (type) => {
    try {
      const response = await fetch(
        `https://abd2-2603-8000-c0f0-a570-e840-db4a-515a-91a5.ngrok-free.app/getfavorite?type=${type}&userId=${userId}`
      );
      const data = await response.json();

      if (type === "restaurants") {
        setFavoriteRestaurants(data);
      } else if (type === "diners") {
        setFavoriteDiners(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            <View style={styles.tabContent}>
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
            <View style={styles.tabContent}>
              <Text style={styles.title}>Diners</Text>

              <Ionicons
                name="people-circle"
                size={25}
                color={Colors.goDutchRed}
              />
            </View>
          </Pressable>
        </View>

        {!favoritesSaved && (
          <Text style={styles.refreshText}>Swipe down to refresh screen</Text>
        )}

        {favoritesSaved && (
          <Text style={styles.title}>You have no favorites saved.</Text>
        )}

        {activeTab === "Diners" ? (
          <FavoriteDinersList
            favoriteDiners={favoriteDiners}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <FavoriteRestaurantsList
            favoriteRestaurants={favoriteRestaurants}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
    marginTop: -40,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.goDutchBlue,
    width: "100%",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  refreshText: {
    textAlign: "center",
    marginVertical: 10,
    color: Colors.goDutchRed,
    fontFamily: "red-hat-bold",
    fontSize: 18,
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
