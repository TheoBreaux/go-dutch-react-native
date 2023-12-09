import { StyleSheet, View } from "react-native";
import Logo from "./Logo";
import FoodItemDropArea from "../components/ui/FoodItemDropArea";
import { useRoute } from "@react-navigation/native";

const AssignItems = () => {
  const route = useRoute();
  const { updatedDiners, separatedDinnerItems } = route.params;

  console.log("IN ASSIGN ITEMS - updatedDiners", updatedDiners);
  console.log("IN ASSIGN ITEMS - separatedDinnerItems", separatedDinnerItems);

  return (
    <>
      <View style={styles.container}>
        <Logo />
        <FoodItemDropArea updatedDiners={updatedDiners} />
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
