import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";

const LocateUser = ({ onRestaurantDataReceived }) => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [restaurantList, setRestaurantList] = useState([]);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      try {
        let location = await Location.getCurrentPositionAsync({});
        setHasLocationPermission(true);
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        await handleRestaurantSearch();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Location permission not granted");
    }
  }, []);

  const handleRestaurantSearch = async () => {
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
    const location = `location=${latitude},${longitude}`;
    const radius = "&radius=2000";
    const type = "&keyword=restaurant";
    const key = "&key=AIzaSyCXB87rKoiCqEI_As-a_eytKZZRDADW_ig";
    const restaurantSearchUrl = url + location + radius + type + key;

    fetch(restaurantSearchUrl)
      .then((response) => response.json())
      .then((result) => {
        setRestaurantList(result);
        onRestaurantDataReceived(result); // Pass the restaurant data to the parent component
      })
      .catch((e) => console.log(e));
  };

  return null; // This component doesn't render anything
};

export default LocateUser;
