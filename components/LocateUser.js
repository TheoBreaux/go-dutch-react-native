import { useState, useEffect, useCallback } from "react";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { FlatList, Text, View, StyleSheet } from "react-native";

const LocateUser = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [restaurantList, setRestaurantList] = useState([]);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = useCallback(async () => {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION_FOREGROUND
    );
    if (status === "granted") {
      try {
        let location = await Location.getCurrentPositionAsync({});
        setHasLocationPermission(true);
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        handleRestaurantSearch();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Location permission not granted");
    }
  }, []);

  const handleRestaurantSearch = () => {
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
    const location = `location=${latitude},${longitude}`;
    const radius = "&radius=2000";
    const type = "&keyword=restaurant";
    const key = "&key=AIzaSyCXB87rKoiCqEI_As-a_eytKZZRDADW_ig";
    const restaurantSearchUrl = url + location + radius + type + key;

    fetch(restaurantSearchUrl)
      .then((response) => response.json())
      .then((result) => setRestaurantList(result))
      .catch((e) => console.log(e));
  };

  console.log("RESULTS:", restaurantList.results.length);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurantList.results}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        style={{
          backgroundColor: "grey",
          width: "80%",
          margin: 60,
          padding: 5,
        }}
      />
      <Text
        style={{
          backgroundColor: "grey",
          color: "white",
          padding: 20,
          marginBottom: 50,
        }}>
        Search Restaurants
      </Text>
    </View>
  );
};

export default LocateUser;
