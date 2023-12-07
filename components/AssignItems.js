import { StyleSheet, View } from "react-native";
import Logo from "./Logo";
import DinnerItem from "./ui/DinnerItem";
import { useDispatch, useSelector } from "react-redux";
import FoodItemDropArea from "../components/ui/FoodItemDropArea";
import { useState, useEffect, useRef } from "react";
import { setAllReceiptItems } from "../store/store";

const AssignItems = () => {
  return (
    <>
      <View style={styles.container}>
        <Logo />
        <FoodItemDropArea
          addedToDiner={addedToDiner}
          updatedDiners={updatedDiners}
        />
        <View style={styles.spacer} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  spacer: {
    height: 200,
  },
  foodItemsListContainer: {
    padding: 10,
    marginBottom: 5,
  },
});

export default AssignItems;
