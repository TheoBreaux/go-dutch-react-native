import { View, Text, StyleSheet, Dimensions } from "react-native";
import Logo from "../components/Logo";
import Carousel from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setInitialPrimaryDiner } from "../store/store";
import { useEffect } from "react";
import CustomProfileIcon from "../components/CustomProfileIcon";
import CustomModal from "../components/CustomModal";
import CarouselFeaturedRestaurant from "../components/CarouselFeaturedRestaurant";
import Colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";


const HomePageScreen = () => {
  //check to see if users current profile pic path is null
  const usingDefaultProfilePhoto =
    useSelector((state) => state.userInfo.user.profileImageKey) === null;

  const [showUpdateProfilePhotoModal, setShowUpdateProfilePhotoModal] =
    useState(usingDefaultProfilePhoto);
  const [shuffledRestaurants, setShuffledRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);

  const user = useSelector((state) => state.userInfo.user);
  const firstName = user.firstName;
  const goDutchUsername = user.username;
  const profileImageKey = user.profileImageKey;

  const currentCityResponse = useSelector(
    (state) => state.userInfo.currentCity
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    getFeaturedRestaurants();
  }, []);

  useEffect(() => {
    // Shuffle the featuredRestaurants array when component mounts
    const shuffled = [...featuredRestaurants].sort(() => Math.random() - 0.5);
    setShuffledRestaurants(shuffled);
  }, [featuredRestaurants]);

  useEffect(() => {
    dispatch(
      setInitialPrimaryDiner({
        eventId: null,
        id: Date.now(),
        additionalDinerUsername: goDutchUsername,
        primaryDiner: true,
        dinerMealCost: 0,
        items: [],
        celebratingBirthday: false,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        location: user.location,
        favoriteCuisine: user.favoriteCuisine,
        birthday: user.birthday,
        dateJoined: user.dateJoined,
        profileImageKey: profileImageKey,
        pushNotificationToken: user.pushNotificationToken,
        primaryPaymentSource: user.primaryPaymentSource,
        primaryPaymentSourceUsername: user.primaryPaymentSourceUsername,
        secondaryPaymentSource: user.secondaryPaymentSource,
        secondaryPaymentSourceUsername: user.secondaryPaymentSourceUsername,
      })
    );
  }, [goDutchUsername]);

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

  let currentCity, error;

  if (typeof currentCityResponse === "object" && currentCityResponse !== null) {
    currentCity = currentCityResponse.city;
    error = currentCityResponse.error;
  } else {
    currentCity = currentCityResponse;
    error = null;
  }

  const renderItem = ({ item }) => <CarouselFeaturedRestaurant item={item} />;

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
          <View style={styles.profileIconContainer}>
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
          data={shuffledRestaurants}
          renderItem={renderItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          autoplay={true}
          autoplayInterval={3000}
          loop={true}
          loopClonesPerSide={shuffledRestaurants.length}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "red-hat-bold",
    fontSize: 32,
    color: Colors.goDutchRed,
    marginRight: 5,
  },
  subtitle: {
    marginTop: -4,
    fontFamily: "red-hat-normal",
    textAlign: "center",
    fontSize: 20,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
});

export default HomePageScreen;
