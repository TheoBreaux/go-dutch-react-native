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

  const separatedDinnerItems = useSelector(
    (state) => state.diningEvent.allReceiptItemsCopy
  );

  const dispatch = useDispatch();

  //dispatch updating the dinersarray with updatedDiners
  useEffect(() => {
    dispatch(setDiners(updatedDiners));
  }, [updatedDiners]);

  return (
    <>
      <Logo />
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.container}>
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
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  spacer: {
    height: 50,
  },
  foodItemsListContainer: {
    flex: 1,
    padding: 10,
    marginBottom: 5,
  },
});

export default AssignItems;
