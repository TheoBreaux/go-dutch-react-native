import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Linking,
  Modal,
} from "react-native";
import Logo from "./Logo";
import { featuredRestaurants } from "../data/data";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import PrimaryButton from "./ui/PrimaryButton";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const UserHomePage = () => {
  const defaultProfilePicPath =
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fgodutch-89861ff9-de0d-4bef-b89e-94d3138aed5e/ImagePicker/53346be3-193d-4b15-8b23-a73ccdd4bc78.jpeg";

  //check to see if users current profile pic path is the default pic
  const usingDefaultProfilePhoto =
    defaultProfilePicPath ===
    useSelector((state) => state.userInfo.user.profilePicPath);

  const [showUpdateProfilePhotoModal, setShowUpdateProfilePhotoModal] =
    useState(usingDefaultProfilePhoto);

  const username = useSelector((state) => state.userInfo.user.firstName);
  const currentCityResponse = useSelector(
    (state) => state.userInfo.currentCity
  );

  const navigation = useNavigation();

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
      {showUpdateProfilePhotoModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showUpdateProfilePhotoModal}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image
                  style={styles.modalImage}
                  source={require("../images/profile-icon.jpg")}
                />

                <Text style={styles.modalText}>
                  Would you like to update your profile photo so users can find
                  you easier?
                </Text>

                <View style={styles.buttonsContainer}>
                  <PrimaryButton
                    width={100}
                    onPress={() => {
                      navigation.navigate("UpdateProfileImage");
                      setShowUpdateProfilePhotoModal(false);
                    }}>
                    Yes
                  </PrimaryButton>

                  <PrimaryButton
                    width={100}
                    onPress={() => setShowUpdateProfilePhotoModal(false)}>
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
          <Text style={styles.title}>Welcome, {username}!</Text>

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
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
