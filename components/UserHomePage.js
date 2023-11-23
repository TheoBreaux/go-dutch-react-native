import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import Logo from "./Logo";
import { featuredRestaurants } from "../data/data";
import Carousel from "react-native-snap-carousel";
import PrimaryButton from "./ui/PrimaryButton";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const UserHomePage = () => {
  const username = useSelector((state) => state.userInfo.user.firstName);
  const currentCity = useSelector((state) => state.userInfo.currentCity);

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
            <Text style={styles.restaurantText}>{item.address}</Text>
            <Text style={styles.restaurantText}>
              {item.city}, {item.state} {item.zip}
            </Text>
            <Text style={styles.restaurantText}>Rating:{item.rating}⭐</Text>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={handleExternalLink}>Reserve</PrimaryButton>
            {/* <Ionicons name="star" color="red" size={30} /> */}
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
          <Text style={styles.title}>Welcome, {username}!</Text>
          <Text style={styles.subtitle}>
            Featured restaurants near {currentCity}!
          </Text>
        </View>
        <Carousel
          data={featuredRestaurants}
          renderItem={renderItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          autoplay={true}
          autoplayInterval={3000}
          loop={true}
          loopClonesPerSide={featuredRestaurants.length}
        />
      </View>
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
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 32,
  },
  subtitle: {
    fontFamily: "red-hat-regular",
    textAlign: "center",
    fontSize: 18,
  },
  carouselContainer: {
    flex: 2,
    marginTop: 0,
    marginBottom: 200,
  },
  carouselImageContainer: {
    width: "100%",
    height: "55%",
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
  },
  restaurantName: {
    fontFamily: "red-hat-bold",
    fontSize: 40,
    paddingTop: 10,
  },
  restaurantText: {
    fontFamily: "red-hat-regular",
    fontSize: 18,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserHomePage;
