import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FavoriteRestaurantsList from "../components/FavoriteRestaurantsList";
import FavoriteDinersList from "../components/FavoriteDinersList";
import Logo from "../components/Logo";
import Colors from "../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { assignAndRemoveFavoriteDiners } from "../store/store";

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const favoriteRestaurantsList = useSelector(
    (state) => state.userInfo.favoriteRestaurantsList
  );

  const favoriteDinersList = useSelector(
    (state) => state.userInfo.favoriteDinersList
  );

  const favoritesSaved =
    favoriteDinersList.length === 0 && favoriteRestaurantsList.length === 0;

  //if there are restaurants favorited and the length is longer thatn diners list, make it active screen
  const activeScreen =
    favoriteDinersList &&
    favoriteDinersList.length > favoriteRestaurantsList.length
      ? "Diners"
      : "Restaurants";

  const [activeTab, setActiveTab] = useState(activeScreen);

  const isDinerFavorited = (item) =>
    useSelector((state) => {
      const favoriteDinersList = state.userInfo.favoriteDinersList;

      const dinerNameToFind = item.additionalDinerUsername;

      const foundDiner = favoriteDinersList.find((selectedUser) => {
        return selectedUser.additionalDinerUsername === dinerNameToFind;
      });

      return foundDiner ? foundDiner.isFavorited : false;
    });

  const handleFavorites = (item) => {
    dispatch(assignAndRemoveFavoriteDiners(item));
  };

  return (
    <>
      <Logo />

      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
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
          </TouchableOpacity>
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>

        {favoritesSaved && (
          <Text style={styles.title}>You have no favorites saved.</Text>
        )}

        {activeTab === "Diners" ? (
          <FavoriteDinersList
            isDinerFavorited={isDinerFavorited}
            handleFavorites={handleFavorites}
          />
        ) : (
          <FavoriteRestaurantsList />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.goDutchBlue,
    width: "100%",
    marginTop: 5,
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
