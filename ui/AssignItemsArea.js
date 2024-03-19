import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
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
  const finalDiner = diners[diners.length - 1].additionalDinerUsername;

  useEffect(() => {
    if (separatedDinnerItems.length === 0) {
      setAssigmentComplete(true);
    }
  }, [separatedDinnerItems]);

  const dispatch = useDispatch();

  //dispatch updating the diners array with dinersUpdated
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
            {assignmentComplete ? (
              <View style={styles.textContainer}>
                <View style={{ flexDirection: "row" }}>
                  <Image source={require("../assets/up-arrow.png")} />
                  <Image source={require("../assets/up-arrow.png")} />
                  <Image source={require("../assets/up-arrow.png")} />
                </View>

                <Text style={styles.reviewText}>REVIEW!</Text>
                <Text style={styles.text}>
                  Please review the final bill for{" "}
                  <Text style={{ fontFamily: "red-hat-bold" }}>
                    @{finalDiner}
                  </Text>
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
    height: 40,
  },
  foodItemsListContainer: {
    padding: 10,
    marginBottom: 5,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  reviewText: {
    marginTop: 20,
    letterSpacing: 5,
    fontFamily: "stamper",
    color: Colors.goDutchRed,
    fontSize: 55,
    textAlign: "center",
    borderWidth: 5,
    elevation: 5,
    backgroundColor: "white",
    padding: 15,
    borderColor: Colors.goDutchRed,
  },
  text: {
    fontFamily: "red-hat-normal",
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
  },
});

export default AssignItemsArea;
