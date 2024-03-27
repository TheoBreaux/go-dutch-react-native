import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import FavoritesIconButton from "./FavoritesIconButton";
import Spinner from "./Spinner";

const FavoriteDinerCard = ({
  isLoadingImage,
  imageURIs,
  item,
  isDinerFavorited,
  handleFavorites,
}) => {
  const navigation = useNavigation();

  const navigateToUserProfile = (selectedUser) => {
    navigation.navigate("ViewUserProfileScreen", { selectedUser });
  };;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigateToUserProfile(item)}
    >
      <View style={styles.imageIconContainer}>
        {isLoadingImage ? (
          <Spinner indicatorSize={80} />
        ) : (
          <Image
            source={
              imageURIs[item.additionalDinerUsername]
                ? { uri: imageURIs[item.additionalDinerUsername] }
                : require("../assets/default-profile-icon.jpg")
            }
            style={styles.image}
          />
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "column", width: "50%" }}>
          <Text style={styles.text}>
            {item.firstName + " " + item.lastName}
          </Text>
          <Text style={styles.text}>@{item.additionalDinerUsername}</Text>
          <Text style={styles.text}>{item.location}</Text>
        </View>

        <View style={{ width: "75%" }}>
          <FavoritesIconButton
            size={50}
            name={item.isDinerFavorited ? "heart-circle" : "heart-outline"}
            color={
              item.isDinerFavorited ? Colors.goDutchRed : Colors.goDutchBlue
            }
            onPress={() => handleFavorites(item)}
            isFavorited={isDinerFavorited}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 8,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: Colors.goDutchRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  imageIconContainer: {
    height: 80,
    width: 80,
    marginRight: 10,
    borderRadius: 40,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "contain",
  },
  text: {
    fontSize: 14,
    fontFamily: "red-hat-bold",
  },
});

export default FavoriteDinerCard;
