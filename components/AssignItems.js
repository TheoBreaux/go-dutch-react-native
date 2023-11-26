import { StyleSheet, View } from "react-native";
import Logo from "./Logo";
import DinnerItem from "./ui/DinnerItem";
import { useSelector } from "react-redux";
import FoodItemDropArea from "./FoodItemDropArea";
import { useState } from "react";

const dinnerItems = [
  { count: 1, name: "Chocolate Cake", price: 25.95 },
  { count: 2, name: "Chicken Tacos", price: 5.95 },
  { count: 2, name: "Casamigos Blanco", price: 32.0 },
  { count: 1, name: "Mule", price: 20.0 },
];

//initialize array for seperate quantities of more than 1 into individual dinner items
const updatedDinnerItems = [];

dinnerItems.forEach((item) => {
  for (let i = 0; i < item.count; i++) {
    updatedDinnerItems.push({
      ...item,
      id: (Date.now() + Math.random() + item.name).toString(),
    });
  }
});

const AssignItems = () => {
  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
  console.log("IN ASSIGNITEMS - RECEIPT VALUES:", receiptValues);

  const [addedToDiner, setAddedToDiner] = useState(false);

  const handleDrop = () => {
    setAddedToDiner(true);
  };

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <FoodItemDropArea
          addedToDiner={addedToDiner}
          setAddedToDiner={setAddedToDiner}
        />
        <View style={styles.spacer} />
        <View style={styles.foodItemsListContainer}>
          {updatedDinnerItems.map((item) => {
            return (
              <View key={item.id}>
                <DinnerItem item={item} handleDrop={handleDrop} />
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
});

export default AssignItems;
