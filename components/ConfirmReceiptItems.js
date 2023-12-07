import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAllReceiptItems, setDiners } from "../store/store";
import Logo from "./Logo";
import DinnerItem from "./ui/DinnerItem";
import Colors from "../constants/colors";
import PrimaryButton from "./ui/PrimaryButton";
import ConfirmableDinnerItem from "./ui/ConfirmableDinnerItem";

//loop through receiptAmounts array to configure data for use
const configureReceiptData = (receiptAmounts) => {
  const configuredData = [];

  for (let i = 0; i < receiptAmounts.length; i++) {
    let lineItem = receiptAmounts[i].text;
    let match = lineItem.match(
      /^(\d+)\s*([^\d]+(?:\(\d+\))?[a-zA-Z\s-]+)\s*(\d*\.?\d+)$/
    );

    if (match) {
      let count = parseInt(match[1], 10);
      let name = match[2];
      let price = parseFloat(match[3]); // Convert the price to a floating-point number

      if (count > 1) {
        price /= count;
      }
      configuredData.push({ count, name, price });
    }
  }
  return configuredData;
};

const ConfirmReceiptItems = () => {
  const [addedToDiner, setAddedToDiner] = useState(false);
  const separatedDinnerItemsRef = useRef([]);
  const [profilePicPaths, setProfilePicPaths] = useState([]);

  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
  const eventId = useSelector((state) => state.diningEvent.event.eventId);
  const receiptAmounts = receiptValues.amounts;
  const diners = useSelector((state) => state.diningEvent.diners);

  const dispatch = useDispatch();

  useEffect(() => {
    const configuredData = configureReceiptData(receiptAmounts);

    // Initialize array for separate quantities of more than 1 into individual dinner items
    const items = [];
    configuredData.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        items.push({
          ...item,
          id: (Date.now() + Math.random() + item.name).toString(),
        });
      }
    });

    separatedDinnerItemsRef.current = items;
    dispatch(setAllReceiptItems(items));
  }, [receiptAmounts]);

  useEffect(() => {
    // Fetch profile pictures when the component mounts
    const fetchProfilePicPaths = async () => {
      try {
        const response = await fetch(
          `https://362d-2603-8000-c0f0-a570-5920-d82-cda4-62e5.ngrok-free.app/additionaldiners/profilepics/${eventId}`
        );
        const data = await response.json();
        setProfilePicPaths(data);
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
      }
    };
    fetchProfilePicPaths();
  }, [eventId]);

  const updatedDiners = [];

  for (let i = 0; i < profilePicPaths.length; i++) {
    const diner = profilePicPaths[i];
    const additional = diners[i];

    if (diner.profile_pic_image_path) {
      updatedDiners.push({
        ...additional,
        profile_pic_image_path: diner.profile_pic_image_path,
      });
    } else {
      updatedDiners.push(diner);
    }
  }

  console.log(separatedDinnerItemsRef);
  console.log(updatedDiners);

  return (
    <View style={styles.container}>
      <Logo />

      <View style={styles.confirmContainer}>
        <Text style={styles.title}>All items listed below?</Text>
        <View style={styles.buttonContainer}>
          <PrimaryButton width={100}>No</PrimaryButton>
          <PrimaryButton width={100}>Yes</PrimaryButton>
        </View>
      </View>

      <ScrollView style={styles.foodItemsListContainer}>
        {separatedDinnerItemsRef.current.map((item) => {
          return <ConfirmableDinnerItem key={item.id} item={item} />;
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  confirmContainer: {
    backgroundColor: "white",
    // padding: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    height: 150,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: "red-hat-regular",
    fontSize: 25,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  foodItemsListContainer: {
    padding: 10,
    marginBottom: 5,
  },
});

export default ConfirmReceiptItems;
