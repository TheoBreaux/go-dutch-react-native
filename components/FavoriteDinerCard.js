import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import Spinner from "./Spinner";
import FavoritesIconButton from "./FavoritesIconButton";
import { useDispatch, useSelector } from "react-redux";
import { assignAndRemoveFavoriteDiners } from "../store/store";

const FavoriteDinerCard = ({ isLoadingImage, imageURIs, item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const navigateToUserProfile = (selectedUser) => {
    navigation.navigate("ViewUserProfileScreen", { selectedUser });
  };

  const isFavorited = useSelector((state) => {
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
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigateToUserProfile(item)}
    >
      {isLoadingImage && <Spinner indicatorSize={200} />}
      {!isLoadingImage && imageURIs[item.additionalDinerUsername] ? (
        <Image
          source={{ uri: imageURIs[item.additionalDinerUsername] }}
          style={styles.image}
        />
      ) : (
        <Image
          source={require("../assets/default-profile-icon.jpg")}
          style={styles.image}
        />
      )}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "column", width: "50%" }}>
          <Text style={styles.text}>
            {item.firstName + " " + item.lastName}
          </Text>
          <Text style={styles.text}>@{item.additionalDinerUsername}</Text>
          <Text style={styles.text}>{item.location}</Text>
        </View>

        <View style={{ width: "50%" }}>
          <FavoritesIconButton
            size={50}
            name={item.isFavorited ? "heart-circle" : "heart-outline"}
            color={item.isFavorited ? Colors.goDutchRed : Colors.goDutchBlue}
            onPress={() => handleFavorites(item)}
            isFavorited={isFavorited}
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
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: Colors.goDutchRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
    resizeMode: "cover",
  },
  text: {
    fontSize: 14,
    fontFamily: "red-hat-bold",
  },
});

export default FavoriteDinerCard;
