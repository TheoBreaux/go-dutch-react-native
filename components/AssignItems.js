import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Logo from "./Logo";
import DinnerItemList from "./ui/DinnerItemList";
import DinnerItem from "./ui/DinnerItem";
import { useSelector } from "react-redux";
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Colors from "../constants/colors";

const dinnerItems = [
  { id: 1, count: 1, name: "Chocolate Cake", price: 25.95 },
  { id: 2, count: 2, name: "Chicken Tacos", price: 5.95 },
  { id: 3, count: 2, name: "Casamigos Blanco", price: 32.0 },
  { id: 4, count: 1, name: "Mule", price: 20.0 },
];

const AssignItems = () => {
  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);

  console.log("IN ASSIGNITEMS - RECEIPT VALUES:", receiptValues);

  const renderItem = ({ item, drag, isActive, index }) => {
    const backgroundColor =
      index % 2 === 0 ? Colors.goDutchBlue : Colors.goDutchRed;

    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? Colors.goDutchRed : backgroundColor },
          ]}>
          <DinnerItem item={item} />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <NestableScrollContainer>
          <Text style={styles.diner}>Diner 1</Text>
          <NestableDraggableFlatList
            data={dinnerItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </NestableScrollContainer>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    margin: 10,
    borderWidth: 1,
  },
  diner: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
  },
  rowItem: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
});

export default AssignItems;
