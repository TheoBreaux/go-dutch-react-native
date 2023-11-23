import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Logo from "./Logo";
import DinnerItemList from "./ui/DinnerItemList";
import DinnerItem from "./ui/DinnerItem";

const dinnerItems = [
  { id: Date.now(), count: 1, name: "Chocolate Cake", price: 25.95 },
  { id: Date.now(), count: 2, name: "Chicken Tacos", price: 5.95 },
  { id: Date.now(), count: 2, name: "Casamigos Blanco", price: 32.0 },
  { id: Date.now(), count: 1, name: "Mule", price: 20.0 },
];

const AssignItems = () => {
  return (
    <>
      <Logo />
      <View style={styles.container}>
        <DinnerItemList>
          {dinnerItems.map((item) => {
            <DinnerItem key={item.id} {...DinnerItem} />;
          })}
        </DinnerItemList>
        <Text>ItemList</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 10,
    borderWidth: 1,
    borderBlockColor: "red",
  },
});

export default AssignItems;
