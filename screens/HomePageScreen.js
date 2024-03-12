import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Linking,
  Modal,
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

const HomePageScreen = () => {
  //check to see if users current profile pic path is null
  const usingDefaultProfilePhoto =
    useSelector((state) => state.userInfo.user.profileImageKey) === null;

  const [showUpdateProfilePhotoModal, setShowUpdateProfilePhotoModal] =
    useState(usingDefaultProfilePhoto);

  const username = useSelector((state) => state.userInfo.user.firstName);
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={showUpdateProfilePhotoModal}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image
                  style={styles.modalImage}
                  source={require("../assets/default-profile-icon.jpg")}
                />

                <Text style={styles.modalText}>
                  Would you like to update your profile photo so users can find
                  you easier?
                </Text>

                <View style={styles.buttonsContainer}>
                  <PrimaryButton
                    width={100}
                    onPress={() => {
                      navigation.navigate("UpdateProfileImageScreen");
                      setShowUpdateProfilePhotoModal(false);
                    }}
                  >
                    Yes
                  </PrimaryButton>

                  <PrimaryButton
                    width={100}
                    onPress={() => setShowUpdateProfilePhotoModal(false)}
                  >
                    No
                  </PrimaryButton>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.container}>
        <View style={styles.titlesContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.title}>Welcome, {username}!</Text>
            <CustomProfileIcon
              onPress={() => navigation.navigate("UserProfileScreen")}
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
    height: 600,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: "center",
    borderRadius: 150,
  },
  modalText: {
    fontFamily: "red-hat-regular",
    fontSize: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  titlesContainer: {
    marginBottom: 10,
  },

  title: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 32,
    marginRight: 5,
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
    fontFamily: "red-hat-regular",
    fontSize: 18,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomePageScreen;
