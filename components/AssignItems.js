import { StyleSheet, View, Text } from "react-native";
import Logo from "./Logo";
import DinnerItem from "./ui/DinnerItem";
import { useSelector } from "react-redux";
import FoodItemDropArea from "../components/ui/FoodItemDropArea"
import { useState } from "react";
import Colors from "../constants/colors";

const dinnerItems = [
  { count: 1, name: "Chocolate Cake", price: 25.95 },
  { count: 2, name: "Chicken Tacos", price: 5.95 },
  { count: 2, name: "Casamigos Blanco", price: 32.0 },
  { count: 1, name: "Mule", price: 20.0 },
];

//initialize array for seperate quantities of more than 1 into individual dinner items
const separatedDinnerItems = [];

dinnerItems.forEach((item) => {
  for (let i = 0; i < item.count; i++) {
    separatedDinnerItems.push({
      ...item,
      id: (Date.now() + Math.random() + item.name).toString(),
    });
  }
});

const AssignItems = () => {
  const [addedToDiner, setAddedToDiner] = useState(false);
  const [foodItems, setFoodItems] = useState(separatedDinnerItems);

  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);

  console.log("IN ASSIGNITEMS - RECEIPT VALUES:", receiptValues);

  const handleDrop = () => {
    setAddedToDiner(true);
  };

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Text style={styles.dinerInfo}>What did this diner have?</Text>
        <FoodItemDropArea
          addedToDiner={addedToDiner}
          setAddedToDiner={setAddedToDiner}
        />
        <View style={styles.spacer} />
        <View style={styles.foodItemsListContainer}>
          {separatedDinnerItems.map((item) => {
            return (
              <View key={item.id}>
                <DinnerItem
                  item={item}
                  handleDrop={handleDrop}
                  separatedDinnerItems={separatedDinnerItems}
                  setFoodItems={setFoodItems}
                  foodItems={foodItems}
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
  },
  dinerInfo: {
    // marginTop: 20,
    fontFamily: "red-hat-regular",
    fontSize: 25,
    color: "black",
    textAlign: "center",
  },
});

export default AssignItems;
