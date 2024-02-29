import { StyleSheet, View, ScrollView, Text } from "react-native";
import Logo from "../components/Logo";
import FoodItemDropArea from "./FoodItemDropArea";
import DinnerItem from "../components/DinnerItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setDiners } from "../store/store";
import Colors from "../constants/colors";

const AssignItemsArea = () => {
  const [assignmentComplete, setAssigmentComplete] = useState(false);

  const updatedDiners = useSelector((state) => state.diningEvent.diners);

  const separatedDinnerItems = useSelector(
    (state) => state.diningEvent.allReceiptItemsCopy
  );

  const diners = useSelector((state) => state.diningEvent.diners);
  const finalDiner = diners[diners.length - 1].additional_diner_username;

  useEffect(() => {
    if (separatedDinnerItems.length === 0) {
      setAssigmentComplete(true);
    }
  }, [separatedDinnerItems]);

  const dispatch = useDispatch();

  //dispatch updating the diners array with updatedDiners
  useEffect(() => {
    dispatch(setDiners(updatedDiners));
  }, [updatedDiners]);

  console.log(
    "IN ASSIGNITEMS COMPONENT - DINERS",
    useSelector((state) => state.diningEvent.diners)
  );

  return (
    <>
      <Logo />
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.container}>
          <FoodItemDropArea />
          <View style={styles.spacer} />

          <View style={styles.foodItemsListContainer}>
            {assignmentComplete ? (
              <View style={styles.textContainer}>
                <Text style={styles.completeText}>COMPLETE!</Text>
                <Text style={styles.text}>
                  Please review the final bill for @{finalDiner}
                </Text>
              </View>
            ) : (
              separatedDinnerItems.map((item) => {
                return (
                  <View key={item.id}>
                    <DinnerItem item={item} updatedDiners={updatedDiners} />
                  </View>
                );
              })
            )}
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
  textContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  completeText: {
    marginTop: 90,
    letterSpacing: 5,
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 55,
    textAlign: "center",
    borderWidth: 5,
    elevation: 5,
    backgroundColor: "white",
    padding: 15,
    borderColor: Colors.goDutchRed,
  },
  text: { fontFamily: "red-hat-bold", fontSize: 18, marginTop: 10 },
});

export default AssignItemsArea;
