import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
} from "react-native";
import Footer from "./Footer";
import Logo from "./Logo";
import { featuredRestaurants } from "../data/data";
import Carousel from "react-native-snap-carousel";

const UserHomePage = () => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Image source={{ uri: item.imgUrl }} style={styles.carouselImage} />
      </View>
    );
  };

  const screenWidth = Dimensions.get("window").width; // Get the screen width

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, firstName!</Text>
        <Text style={styles.subtitle}>
          Featured restaurants near city/town!
        </Text>
        <Carousel
          data={featuredRestaurants}
          renderItem={renderItem}
          sliderWidth={screenWidth} // Match with screen width
          itemWidth={screenWidth} // Match with screen width to display only one item
          autoplay={true}
          autoplayInterval={3000}
          loop={true}
          loopClonesPerSide={featuredRestaurants.length}
        />
      </View>
  
      
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 400,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
  carouselItem: {
    flex: 1, // Adjust the flex value as needed
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  carouselImage: {
    width: "100%", // You can adjust this value as needed
    height: "100%", // You can adjust this value as needed
    resizeMode: "cover", // Use "cover" for better image scaling
  },
});

export default UserHomePage;

