import { StyleSheet, Text, View } from "react-native";
import React from "react";

const FeaturedRestaurants = () => {
  return (
    <View style={styles.container}>
      <Text>FeaturedRestaurants</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default FeaturedRestaurants;
