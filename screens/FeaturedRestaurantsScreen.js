import { StyleSheet, Text, View, FlatList } from "react-native";
import Logo from "../components/Logo";
import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import FeaturedRestaurantCard from "../components/FeaturedRestaurantCard";
import Colors from "../constants/colors";

const FeaturedRestaurantsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getFeaturedRestaurants();
  }, []);

  const getFeaturedRestaurants = async () => {
    try {
      const response = await fetch(
        `https://4b35-2603-8000-c0f0-a570-d59a-2761-e0d-b64.ngrok-free.app/featuredrestaurants`
      );
      const data = await response.json();
      setFeaturedRestaurants(data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {!isLoading && (
            <View style={styles.textContainer}>
              <Text style={styles.title}>Featured Restaurants</Text>
            </View>
          )}
        </View>

        {isLoading && (
          <Spinner
            indicatorSize={200}
            fontSize={18}
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
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    marginTop: -10,
  },
  titleContainer: {
    borderBottomColor: Colors.goDutchBlue,
    width: "100%",
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
});

export default FeaturedRestaurantsScreen;
