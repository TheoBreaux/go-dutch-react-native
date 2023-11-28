import { StyleSheet, View, Text } from "react-native";
import Logo from "./Logo";
import DinnerItem from "./ui/DinnerItem";
import { useSelector } from "react-redux";
import FoodItemDropArea from "../components/ui/FoodItemDropArea";
import { useState, useEffect } from "react";

//loop through receiptAmounts array to configure data for use
const configureReceiptData = (receiptAmounts) => {
  const configuredData = [];

  for (let i = 0; i < receiptAmounts.length; i++) {
    let lineItem = receiptAmounts[i].text;
    console.log("LINE ITEM:", lineItem);
    let match = lineItem.match(/^(\d*\.?\d+)\s+([a-zA-Z\s]+)\s+(\d*\.?\d+)$/);

    if (match) {
      let count = parseInt(match[1], 10);
      let name = match[2];
      let price = parseFloat(match[3]); // Convert the price to a floating-point number

      if (count > 1) {
        price /= count;
      }
      configuredData.push({ count, name, price });
    }
  }
  return configuredData;
};

const AssignItems = () => {
  const [addedToDiner, setAddedToDiner] = useState(false);
  const [parsedFoodItems, setParsedFoodItems] = useState([]);

  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
      const receiptAmounts = receiptValues.amounts;

  useEffect(() => {
    const configuredData = configureReceiptData(receiptAmounts);
    setParsedFoodItems(configuredData);
  }, [receiptAmounts]);

  //initialize array for seperate quantities of more than 1 into individual dinner items
  const separatedDinnerItems = [];

  parsedFoodItems.forEach((item) => {
    for (let i = 0; i < item.count; i++) {
      separatedDinnerItems.push({
        ...item,
        id: (Date.now() + Math.random() + item.name).toString(),
      });
    }
  });

  const handleDrop = () => {
    setAddedToDiner(true);
  };

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Text style={styles.dinerInfo}>What did this diner have?</Text>
        <FoodItemDropArea
          addedToDiner={addedToDiner}
          setAddedToDiner={setAddedToDiner}
        />
        <View style={styles.spacer} />
        <View style={styles.foodItemsListContainer}>
          {separatedDinnerItems.map((item) => {
            return (
              <View key={item.id}>
                <DinnerItem
                  item={item}
                  handleDrop={handleDrop}
                  separatedDinnerItems={separatedDinnerItems}
                />
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
    marginBottom: 10,
  },
  dinerInfo: {
    marginTop: 20,
    fontFamily: "red-hat-regular",
    fontSize: 25,
    color: "black",
    textAlign: "center",
    letterSpacing: 3,
  },
});

export default AssignItems;
