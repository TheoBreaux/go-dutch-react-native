import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import FavoritesIconButton from "./FavoritesIconButton";

const FavoriteRestaurantsList = () => {
  const [imageError, setImageError] = useState(false);
  const [allowFavoritesRemoval, setAllowFavoritesRemoval] = useState(false);
  const favoriteRestaurantsList = useSelector(
    (state) => state.userInfo.favoriteRestaurantsList
  );

  const navigation = useNavigation();

  const navigateToFeaturedRestuarantDetails = (restaurant) => {
    navigation.navigate("FeaturedRestaurantDetailsScreen", { restaurant });
  };

  const test = () => {
    console.log("test");
  };
  const isFavorited = true;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
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
          <View>
            <View style={[styles.restaurantInfo, { width: "50%" }]}>
              <Text style={[styles.text, { width: "100%" }]}>{item.name}</Text>
            </View>

            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.address}>
              {item.city + ", " + item.state + " " + item.zip}
            </Text>

            <Text style={styles.text}>{item.phone}</Text>
          </View>

          {!allowFavoritesRemoval && (
            <View style={{ width: "35%" }}>
              <FavoritesIconButton
                size={50}
                name="heart-circle"
                color={Colors.goDutchRed}
                onPress={test}
                isFavorited={isFavorited}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={favoriteRestaurantsList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
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

export default FavoriteRestaurantsList;
