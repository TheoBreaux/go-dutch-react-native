import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import Logo from "../components/Logo";
import { featuredRestaurants } from "../data/data";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import PrimaryButton from "../components/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setInitialPrimaryDiner } from "../store/store";
import { useEffect } from "react";
import CustomProfileIcon from "../components/CustomProfileIcon";
import CustomModal from "../components/CustomModal";

const HomePageScreen = () => {
  //check to see if users current profile pic path is null
  const usingDefaultProfilePhoto =
    useSelector((state) => state.userInfo.user.profileImageKey) === null;

  const [showUpdateProfilePhotoModal, setShowUpdateProfilePhotoModal] =
    useState(usingDefaultProfilePhoto);

  const firstName = useSelector((state) => state.userInfo.user.firstName);
  const goDutchUsername = useSelector((state) => state.userInfo.user.username);
  const currentCityResponse = useSelector(
    (state) => state.userInfo.currentCity
  );
  const profileImageKey = useSelector(
    (state) => state.userInfo.user.profileImageKey
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(
      setInitialPrimaryDiner({
        event_id: null,
        id: Date.now(),
        additional_diner_username: goDutchUsername,
        primary_diner: true,
        diner_meal_cost: 0,
        items: [],
        birthday: false,
        profile_image_key: profileImageKey,
      })
    );
  }, [goDutchUsername]);

  let currentCity, error;

  if (typeof currentCityResponse === "object" && currentCityResponse !== null) {
    currentCity = currentCityResponse.city;
    error = currentCityResponse.error;
  } else {
    currentCity = currentCityResponse;
    error = null;
  }

  const handleExternalLink = (url) => {
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => {
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
            <PrimaryButton onPress={() => handleExternalLink(item.website)}>
              Reserve
            </PrimaryButton>
          </View>
        </View>
      </View>
    );
  };

  const screenWidth = Dimensions.get("window").width; // Get the screen width

  return (
    <>
      <Logo />
      {showUpdateProfilePhotoModal && (
        <CustomModal
          animationType="slide"
          transparent={true}
          visible={showUpdateProfilePhotoModal}
          source={require("../assets/default-profile-icon.jpg")}
          modalText="Would you like to update your photo so users can find you easier?"
          buttonWidth={100}
          onPress1={() => {
            navigation.navigate("ProfileScreen");
            setShowUpdateProfilePhotoModal(false);
          }}
          onPress2={() => setShowUpdateProfilePhotoModal(false)}
          buttonText1="Yes"
          buttonText2="No"
        />
      )}

      <View style={styles.container}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.title}>Welcome, {firstName}!</Text>
            <CustomProfileIcon
              onPress={() => navigation.navigate("ProfileScreen")}
              height={60}
              width={60}
              borderRadius={30}
            />
          </View>

          {error ? (
            <Text style={styles.subtitle}>{error}!</Text>
          ) : (
            <Text style={styles.subtitle}>
              Featured restaurants near {currentCity}!
            </Text>
          )}
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
  title: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 32,
    marginRight: 5,
  },
  subtitle: {
    fontFamily: "red-hat-normal",
    textAlign: "center",
    fontSize: 18,
  },
  carouselContainer: {
    flex: 2,
    marginTop: 10,
    marginBottom: 200,
  },
  carouselImageContainer: {
    width: "90%",
    marginHorizontal: "5%",
    height: "75%",
  },
  carouselImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
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
    fontSize: 35,
    paddingTop: 15,
  },
  restaurantText: {
    fontFamily: "red-hat-normal",
    fontSize: 18,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomePageScreen;
