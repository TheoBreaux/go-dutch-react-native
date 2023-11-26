import { StyleSheet, View } from "react-native";
import Logo from "./Logo";
import DinnerItem from "./ui/DinnerItem";
import { useSelector } from "react-redux";
import FoodItemDropArea from "./FoodItemDropArea";

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

console.log(dinnerItems);

const AssignItems = () => {
  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
  console.log("IN ASSIGNITEMS - RECEIPT VALUES:", receiptValues);

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <FoodItemDropArea />
        <View style={styles.spacer} />
        <View style={styles.foodItemsListContainer}>
          {updatedDinnerItems.map((item, index) => {
            console.log(`DinnerItem key: ${item.id}`);
            return (
              <View key={item.id}>
                <DinnerItem item={item} />
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
