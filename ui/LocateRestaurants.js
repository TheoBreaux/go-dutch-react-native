import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { setRestaurantList } from "../store/store";
import { useDispatch } from "react-redux";

const LocateRestaurants = ({ onLocationUpdate }) => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const dispatch = useDispatch();

  //get current location coordinates
  const getLocationAsync = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      try {
        let location = await Location.getCurrentPositionAsync({});

        setHasLocationPermission(true);
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        await handleRestaurantSearch();

        onLocationUpdate(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Location permission not granted");
    }
  }, [onLocationUpdate]);

  useEffect(() => {
    getLocationAsync();
  }, [getLocationAsync, latitude, longitude, hasLocationPermission]);

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
        dispatch(setRestaurantList(data));
        return data;
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }
  };
};

export default LocateRestaurants;
