import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Logo from "../components/Logo";

const FeaturedRestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;

  console.log(restaurant);
  return (
    <>
      <Logo />
      <Text>{restaurant.name}</Text>
      <Text>{restaurant.bio}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 16 },
});

export default FeaturedRestaurantDetailsScreen;
