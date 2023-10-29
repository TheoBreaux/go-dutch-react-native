import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
  Linking,
} from "react-native";
import Footer from "./Footer";
import Logo from "./Logo";
import { featuredRestaurants } from "../data/data";
import Carousel from "react-native-snap-carousel";

const UserHomePage = () => {
  const renderItem = ({ item }) => {
    const handleExternalLink = () => {
      Linking.openURL(item.website);
    };

    return (
      <View style={styles.carouselContainer}>
        <View style={styles.carouselImageContainer}>
          <Image source={{ uri: item.imgUrl }} style={styles.carouselImage} />
        </View>

        <View style={styles.restaurantInfoContainer}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>
              {item.city}, {item.state} {item.zip}
            </Text>
            <Text>Rating:{item.rating}⭐</Text>
          </View>
          <View style={styles.reserveButton}>
            <Button
              title="Reserve"
              color={"#A40E24"}
              onPress={handleExternalLink}
            />
          </View>
        </View>
      </View>
    );
  };

  const screenWidth = Dimensions.get("window").width; // Get the screen width

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <View style={styles.titlesContainer}>
          <Text style={styles.title}>Welcome, firstName!</Text>
          <Text style={styles.subtitle}>
            Featured restaurants near city/town!
          </Text>
        </View>
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
        {/* <View style={styles.adSpace}>
          <Text>SOME USER INFO OR AD</Text>
        </View> */}
      </View>

      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  titlesContainer: {
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
  },
  carouselContainer: {
    flex: 2,
    marginTop: 0,
    marginBottom: 200,
  },
  carouselImageContainer: {
    width: "100%",
    height: "55%", // Adjust this value as needed
  },
  carouselImage: {
    height: "100%",
    width: "100%",
    resizeMode: "center",
  },
  restaurantInfoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  restaurantInfo: {
    alignItems: "center",
    marginTop: -55,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 32,
    paddingTop: 10,
  },
  reserveButton: {
    backgroundColor: "#A40E24",
    borderRadius: 5,
    padding: 5,
    width: 150,
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
  },
  adSpace: {
    flex: 1,
  },
});

export default UserHomePage;
