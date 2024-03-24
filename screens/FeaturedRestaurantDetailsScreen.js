import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import Logo from "../components/Logo";
import { LinearGradient } from "expo-linear-gradient";

const FeaturedRestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;

  console.log(restaurant);

  // Get the screen dimensions
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Calculate the image height to take up 50% of the screen height
  const imageHeight = screenHeight * 0.4;

  return (
    <>
      <Logo />
      <View style={{ alignItems: "center" }}>
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image source={{ uri: restaurant.imgUrl }} style={styles.image} />
          {/* <LinearGradient
            colors={[
              "transparent",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0.1)",
              "rgba(0,0,0,0.3)",
              "rgba(0,0,0,0.5)",
            ]}
            style={StyleSheet.absoluteFill}
          /> */}
        </View>
      </View>
      <Text>{restaurant.name}</Text>
      <Text>{restaurant.bio}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 16 },
  imageContainer: {
    width: "100%",
    resizeMode: "cover",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default FeaturedRestaurantDetailsScreen;
