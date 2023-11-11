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
    if (hasLocationPermission) {
      const url =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
      const location = `location=${latitude},${longitude}`;
      const radius = "&radius=2000";
      const type = "&keyword=restaurant";
      const key = "&key=AIzaSyCXB87rKoiCqEI_As-a_eytKZZRDADW_ig";
      const restaurantSearchUrl = url + location + radius + type + key;

      try {
        const response = await fetch(restaurantSearchUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const data = result.results;
        console.log("THIS IS THE DATA RESULT:", data);
        setRestaurantList(data);

        if (onRestaurantDataReceived) {
          onRestaurantDataReceived(data);
        }
        return data;
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }
  };

  return null; // This component doesn't render anything
};

export default LocateUser;
