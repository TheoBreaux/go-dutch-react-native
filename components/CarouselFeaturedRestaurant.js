import { Linking, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import PrimaryButton from "../components/PrimaryButton";

const CarouselFeaturedRestaurant = ({ item }) => {
  const handleExternalLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.carouselContainer}>
      <View style={styles.carouselImageContainer}>
        <Image source={{ uri: item.imgUrl }} style={styles.carouselImage} />
      </View>

      <View style={styles.restaurantInfoContainer}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.restaurantText}>{item.address}</Text>
          <Text style={styles.restaurantText}>
            {item.city}, {item.state} {item.zip}
          </Text>
          <Text style={styles.restaurantText}>Rating:{item.rating}⭐</Text>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            width={150}
            height={50}
            onPress={() => handleExternalLink(item.website)}
          >
            Reserve
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 2,
    marginTop: 10,
    marginBottom: 200,
  },
  carouselImageContainer: {
    width: "90%",
    marginHorizontal: "5%",
    height: "75%",
  },
  carouselImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  restaurantInfoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  restaurantInfo: {
    alignItems: "center",
    marginTop: -55,
  },
  restaurantName: {
    fontFamily: "red-hat-bold",
    fontSize: 35,
    paddingTop: 15,
  },
  restaurantText: {
    fontFamily: "red-hat-normal",
    fontSize: 18,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CarouselFeaturedRestaurant;
