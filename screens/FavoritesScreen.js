import { StyleSheet, Text, View } from "react-native";
import FavoriteRestaurantsList from "../components/FavoriteRestaurantsList";
import FavoriteDinersList from "../components/FavoriteDinersList";
import Logo from "../components/Logo";
import Colors from "../constants/colors";
import { useState } from "react";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";

const FavoritesScreen = () => {
  const [viewFavoriteDiners, setViewFavoriteDiners] = useState(false);
  const [viewFavoriteRestaurants, setViewFavoriteRestaurants] = useState(false);

  const favoriteRestaurantsExists = useSelector(
    (state) => state.userInfo.favoriteRestaurantsList.length > 0
  );

  const favoriteDinersExists = useSelector(
    (state) => state.userInfo.favoriteDinersList.length > 0
  );

  const favoritesSaved = viewFavoriteDiners || viewFavoriteRestaurants;

  return (
    <>
      <Logo />
      <Text style={[styles.title, { marginTop: -10 }]}>
        Favorite Restaurants
      </Text>
      <View style={styles.favoriteRestaurantsContainer}>
        <FavoriteRestaurantsList />
      </View>
      <Text style={[styles.title, { marginTop: -15 }]}>Favorite Diners</Text>
      <View style={styles.favoriteDinersContainer}>
        <FavoriteDinersList />
      </View>
      {favoritesSaved && (
        <Text style={styles.text}>You have no favorites saved.</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  favoriteRestaurantsContainer: {
    flex: 1,
    padding: 15,
    // borderColor: "black",
    // borderWidth: 1,
  },
  favoriteDinersContainer: {
    flex: 1,
    padding: 15,
    // borderColor: "black",
    // borderWidth: 1,
  },
  title: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    fontSize: 25,
    marginBottom: -15,
    color: Colors.goDutchRed,
  },
  text: {
    fontFamily: "red-hat-bold",
    fontSize: 30,
    textAlign: "center",
  },
});

export default FavoritesScreen;
