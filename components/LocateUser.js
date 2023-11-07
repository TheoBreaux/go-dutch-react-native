import { useState, useEffect, useCallback } from "react";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

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
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Location permission not granted");
    }
  }, []);

  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);
};

export default LocateUser;
