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

const FavoriteRestaurantsList = () => {
  const [imageError, setImageError] = useState(false);
  const favoriteRestaurantsList = useSelector(
    (state) => state.userInfo.favoriteRestaurantsList
  );

  const navigation = useNavigation();

  const navigateToFeaturedRestuarantDetails = (restaurant) => {
    navigation.navigate("FeaturedRestaurantDetailsScreen", { restaurant });
  };

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
              style={[styles.image, { resizeMode: "contain" }]}
            />
          ) : (
            <Image
              source={{ uri: item.imgUrl }}
              style={styles.image}
              onError={() => setImageError(true)}
            />
          )}
        </View>
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={[
                styles.text,
                { fontFamily: "red-hat-bold", width: "50%" },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.text,
                { fontFamily: "red-hat-bold", width: "50%" },
              ]}
            >
              {item.rating + " ⭐"}
            </Text>
          </View>

          <Text style={styles.text}>{item.address}</Text>
          <Text style={styles.text}>
            {item.city + ", " + item.state + " " + item.zip}
          </Text>

          <Text style={[styles.text, { fontFamily: "red-hat-bold" }]}>
            {item.phone}
          </Text>
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
  text: {
    fontSize: 14,
    fontFamily: "red-hat-normal",
  },
});

export default FavoriteRestaurantsList;
