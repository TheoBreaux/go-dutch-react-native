import { StyleSheet, Text, View } from "react-native";
import FavoriteRestaurantsList from "../components/FavoriteRestaurantsList";
import FavoriteDinersList from "../components/FavoriteDinersList";
import Logo from "../components/Logo";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";

const FavoritesScreen = () => {
  const favoriteRestaurantsExists = useSelector(
    (state) => state.userInfo.favoriteRestaurantsList.length > 0
  );

  const favoriteDinersExists = useSelector(
    (state) => state.userInfo.favoriteDinersList.length > 0
  );

  const favoritesSaved = favoriteDinersExists || favoriteRestaurantsExists;

  return (
    <>
      <Logo />
      <View style={styles.container}>
        {favoriteRestaurantsExists && (
          <View style={styles.favoriteRestaurantsContainer}>
            <Text style={[styles.title]}>Favorite Restaurants</Text>
            <FavoriteRestaurantsList />
          </View>
        )}

        {favoriteDinersExists && (
          <View style={styles.favoriteDinersContainer}>
            <Text style={styles.title}>Favorite Diners</Text>
            <FavoriteDinersList />
          </View>
        )}

        {!favoritesSaved && (
          <Text style={styles.text}>You have no favorites saved.</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  favoriteRestaurantsContainer: {
    flex: 1,
    padding: 15,
    marginTop: -20,
  },
  noFavoritesText: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    textAlign: "center",
    fontSize: 30,
    width: "auto",
  },
  favoriteDinersContainer: {
    flex: 1,
    padding: 15,
    marginBottom:25,
  },
  title: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    fontSize: 30,
    color: Colors.goDutchRed,
  },
  text: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    textAlign: "center",
    fontSize: 30,
    width: "auto",
  },
});

export default FavoritesScreen;
