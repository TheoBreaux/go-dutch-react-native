import { StyleSheet, Text, View } from "react-native";
import React from "react";

const FeaturedRestaurantsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>FeaturedRestaurantsScreen</Text>
    </View>
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
