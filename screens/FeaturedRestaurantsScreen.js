import { StyleSheet, Text, View, FlatList } from "react-native";
import Logo from "../components/Logo";
import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import FeaturedRestaurantCard from "../components/FeaturedRestaurantCard";
import { featuredRestaurants } from "../data/data";
import Colors from "../constants/colors";

const FeaturedRestaurantsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Logo />
      <View style={styles.titleContainer}>
        {!isLoading && (
          <View style={styles.textContainer}>
            <Text style={styles.title}>Featured Restaurants</Text>
          </View>
        )}
      </View>

      <View style={styles.container}>
        {isLoading && (
          <Spinner
            indicatorSize={200}
            fontSize={16}
            children="Loading featured restaurants in your area..."
          />
        )}

        {!isLoading && (
          <FlatList
            data={featuredRestaurants}
            renderItem={({ item }) => (
              <FeaturedRestaurantCard restaurant={item} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    borderBottomColor: Colors.goDutchBlue,
    width: "100%",
    paddingHorizontal: 15,
  },
  textContainer: {
    borderBottomColor: Colors.goDutchBlue,
    borderBottomWidth: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopColor: Colors.goDutchBlue,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderLeftColor: Colors.goDutchBlue,
    borderLeftWidth: 1,
    borderRightColor: Colors.goDutchBlue,
    borderRightWidth: 1,
    padding: 5,
  },
  title: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    fontSize: 30,
    marginTop: -10,
    color: Colors.goDutchRed,
  },
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    marginTop: -10,
  },
});

export default FeaturedRestaurantsScreen;
