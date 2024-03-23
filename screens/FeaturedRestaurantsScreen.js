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
      {!isLoading && <Text style={styles.title}>Featured Restaurants</Text>}

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
