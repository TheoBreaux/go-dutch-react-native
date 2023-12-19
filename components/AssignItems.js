import { StyleSheet, View, ScrollView } from "react-native";
import Logo from "./Logo";
import FoodItemDropArea from "../components/ui/FoodItemDropArea";
import { useRoute } from "@react-navigation/native";
import DinnerItem from "./ui/DinnerItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setDiners } from "../store/store";

const AssignItems = () => {
  const route = useRoute();

  const { updatedDiners } = route.params;

  const separatedDinnerItems = useSelector((state) => state.diningEvent.allReceiptItemsCopy)

  const dispatch = useDispatch();

  //dispatch updating the dinersarray with updatedDiners
  useEffect(() => {
    dispatch(setDiners(updatedDiners));
  }, [updatedDiners]);

  return (
    <>
      <View style={styles.container}>
        <Logo />
        <FoodItemDropArea />
        <View style={styles.spacer} />

        <View style={styles.foodItemsListContainer}>
          {separatedDinnerItems.map((item) => {
            return (
              <View key={item.id}>
                <DinnerItem item={item} updatedDiners={updatedDiners} />
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
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  spacer: {
    height: 200,
  },
  foodItemsListContainer: {
    flex: 2,
    padding: 10,
    // marginTop: 25,
    marginBottom: 5,
  },
});

export default AssignItems;
