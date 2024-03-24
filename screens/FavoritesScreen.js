import { StyleSheet, Text, View } from "react-native";
import FavoriteRestaurantsList from "../components/FavoriteRestaurantsList";
import FavoriteDinersList from "../components/FavoriteDinersList";
import Logo from "../components/Logo";
import Colors from "../constants/colors";

const FavoritesScreen = () => {
  return (
    <>
      <Logo />
      <Text style={styles.title}>Favorites</Text>
      <View style={styles.container}>
        <FavoriteRestaurantsList />
        {/* <FavoriteDinersList items={item} /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 15,
    justifyContent: "center",
    marginTop: -10,
  },
  title: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    fontSize: 30,
    marginTop: -10,
    color: Colors.goDutchRed,
  },
});

export default FavoritesScreen;
