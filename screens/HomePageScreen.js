import { View, Text, StyleSheet, Dimensions } from "react-native";
import Logo from "../components/Logo";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { setInitialPrimaryDiner } from "../store/store";
import { useEffect } from "react";
import CustomProfileIcon from "../components/CustomProfileIcon";
import CustomModal from "../components/CustomModal";
import { featuredRestaurants } from "../data/data";
import CarouselFeaturedRestaurant from "../components/CarouselFeaturedRestaurant";
import Colors from "../constants/colors";

const HomePageScreen = () => {
  //check to see if users current profile pic path is null
  const usingDefaultProfilePhoto =
    useSelector((state) => state.userInfo.user.profileImageKey) === null;

  const [showUpdateProfilePhotoModal, setShowUpdateProfilePhotoModal] =
    useState(usingDefaultProfilePhoto);
  const [shuffledRestaurants, setShuffledRestaurants] = useState([]);

  const firstName = useSelector((state) => state.userInfo.user.firstName);
  const goDutchUsername = useSelector((state) => state.userInfo.user.username);
  const user = useSelector((state) => state.userInfo.user);
  const currentCityResponse = useSelector(
    (state) => state.userInfo.currentCity
  );
  const profileImageKey = useSelector(
    (state) => state.userInfo.user.profileImageKey
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    // Shuffle the featuredRestaurants array when component mounts
    const shuffled = [...featuredRestaurants].sort(() => Math.random() - 0.5);
    setShuffledRestaurants(shuffled);
  }, []);

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

  const renderItem = useMemo(() => {
    return ({ item }) => {
      return <CarouselFeaturedRestaurant item={item} />;
    };
  }, []);

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
    alignItems: "center",
  },
  title: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 32,
    color: Colors.goDutchRed,
    marginRight: 5,
  },
  subtitle: {
    fontFamily: "red-hat-normal",
    textAlign: "center",
    fontSize: 18,
  },
});

export default HomePageScreen;
