// import { useDispatch } from "react-redux";
// import { getCityFromCoordinates } from "../utils";
// import { useState, useCallback } from "react";
// import { setCurrentCity } from "../store/store";

// export const useLocation = () => {
//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);

//   const dispatch = useDispatch();

//   const apiKey = "AIzaSyCXB87rKoiCqEI_As-a_eytKZZRDADW_ig";

//   const handleLocationUpdate = useCallback((lat, long) => {
//     setLatitude(lat);
//     setLongitude(long);
//   }, []);

//   const handleLocationSearch = async () => {
//     try {
//       const city = await getCityFromCoordinates(latitude, longitude, apiKey);
//       dispatch(setCurrentCity(city));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return { handleLocationUpdate, handleLocationSearch };
// };
