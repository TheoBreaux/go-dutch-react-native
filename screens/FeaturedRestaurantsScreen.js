import { StyleSheet, Text, View } from "react-native";
import Logo from "../components/Logo";
import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isLoading ? (
          <Spinner
            indicatorSize={200}
            fontSize={20}
            children="Loading featured restaurants..."
          />
        ) : (
          <Text>ADVERTISING SPACE FOR FEATURED RESTAURANT CARDS</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default FeaturedRestaurantsScreen;

// POSSIBLY CARDS WITH INFO FOR ALL PAYING ADVERTISERS WITH LINKS IN A FLATLIST
