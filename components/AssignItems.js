import { StyleSheet, View, Text } from "react-native";
import Logo from "./Logo";
import DinnerItem from "./ui/DinnerItem";
import { useDispatch, useSelector } from "react-redux";
import FoodItemDropArea from "../components/ui/FoodItemDropArea";
import { useState, useEffect } from "react";
import { setAllReceiptItems } from "../store/store";

//loop through receiptAmounts array to configure data for use
const configureReceiptData = (receiptAmounts) => {
  const configuredData = [];

  for (let i = 0; i < receiptAmounts.length; i++) {
    let lineItem = receiptAmounts[i].text;
    let match = lineItem.match(/^(\d+)\s*([^\d]+(?:\(\d+\))?[a-zA-Z\s-]+)\s*(\d*\.?\d+)$/);

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

const AssignItems = () => {
  const [addedToDiner, setAddedToDiner] = useState(false);
  const [parsedFoodItems, setParsedFoodItems] = useState([]);
  const [profilePicPaths, setProfilePicPaths] = useState([]);

  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
  const eventId = useSelector((state) => state.diningEvent.event.eventId);
  const receiptAmounts = receiptValues.amounts;
  const diners = useSelector((state) => state.diningEvent.diners);

  const dispatch = useDispatch();




  


  useEffect(() => {
    const configuredData = configureReceiptData(receiptAmounts);
    setParsedFoodItems(configuredData);
  }, [receiptAmounts]);

  //initialize array for seperate quantities of more than 1 into individual dinner items
  const separatedDinnerItems = [];

  parsedFoodItems.forEach((item) => {
    for (let i = 0; i < item.count; i++) {
      separatedDinnerItems.push({
        ...item,
        id: (Date.now() + Math.random() + item.name).toString(),
      });
    }
  });

  useEffect(() => {
    dispatch(setAllReceiptItems(separatedDinnerItems));
  }, [separatedDinnerItems]);








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

  const handleDrop = () => {
    setAddedToDiner(true);
  };

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

  console.log("------------------------RECEIPT VALUES:", profilePicPaths);
  console.log("------------------------PATHS:", profilePicPaths);
  console.log("------------------------UPDATED DINERS:", updatedDiners);
  console.log("------------------------DINERS:", diners);

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Text style={styles.dinerInfo}>What did this diner have?</Text>
        <FoodItemDropArea
          addedToDiner={addedToDiner}
          setAddedToDiner={setAddedToDiner}
          updatedDiners={updatedDiners}
        />
        <View style={styles.spacer} />
        <View style={styles.foodItemsListContainer}>
          {separatedDinnerItems.map((item) => {
            return (
              <View key={item.id}>
                <DinnerItem
                  item={item}
                  // handleDrop={handleDrop}
                />
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    height: 200,
  },
  foodItemsListContainer: {
    padding: 10,
    marginBottom: 10,
  },
  dinerInfo: {
    fontFamily: "red-hat-regular",
    fontSize: 25,
    color: "black",
    textAlign: "center",
    letterSpacing: 3,
  },
});

export default AssignItems;
