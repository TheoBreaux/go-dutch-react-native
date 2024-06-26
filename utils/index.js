import { useEffect } from "react";
import { BackHandler } from "react-native";

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
};

//get the name of my current city from the provided coordinates
export const getCityFromCoordinates = async (latitude, longitude, apiKey) => {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const addressComponents = data.results[0].address_components;

    // Find the city in the address components
    const cityComponent = addressComponents.find(
      (component) =>
        component.types.includes("locality") ||
        component.types.includes("administrative_area_level_2")
    );

    const city = cityComponent ? cityComponent.long_name : "City not found";
    return city;
  } catch (error) {
    console.error("Error fetching city:", error);
    //find a better way to handle this
    return {
      city: null,
      error: "Unable to retrieve current location",
    };
  }
};

export const useDisableBackButton = () => {
  useEffect(() => {
    const handleBackButton = () => {
      return true; // Returning true prevents default behavior (going back)
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);
};
