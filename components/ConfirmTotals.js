import { StyleSheet, Text, View, Button } from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import Logo from "./Logo";
import PrimaryButton from "./ui/PrimaryButton";
import { useNavigation } from "@react-navigation/native";

const ConfirmTotals = () => {
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
  console.log(receiptValues);

  const lineItemAmounts = receiptValues.amounts;
  const restaurantName = receiptValues.merchantName.data;
  const restaurantAddress = receiptValues.merchantAddress.data;

  const navigation = useNavigation();

  const findAdditionalCharge = (array, searchString) => {
    const matchingObject = array.find(
      (obj) =>
        obj.text.toLowerCase() && obj.text.toLowerCase().includes(searchString)
    );
    return matchingObject ? matchingObject.text : 0;
  };

  const tax = findAdditionalCharge(lineItemAmounts, "tax");
  const tip = findAdditionalCharge(lineItemAmounts, "tip");
  const gratuity = findAdditionalCharge(lineItemAmounts, "gratuity");
  const service = findAdditionalCharge(lineItemAmounts, "service");
  const entertainment = findAdditionalCharge(lineItemAmounts, "entertainment");

  console.log(receiptValues);
  return (
    <>
      <Logo />

      <View style={styles.cardContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Restaurant name: </Text>
          <View style={styles.button}>
            <Button
              color={Colors.goDutchRed}
              title="X"
              onPress={() => changeRestaurantHandler(handleChange)}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Tax: </Text>
          <View style={styles.button}>
            <Button
              color={Colors.goDutchRed}
              title="X"
              onPress={() => changeRestaurantHandler(handleChange)}
            />
          </View>
        </View>

        {/* <View style={styles.button}>
          <Button
            color={Colors.goDutchRed}
            title="X"
            onPress={() => changeRestaurantHandler(handleChange)}
          />
        </View> */}

        {/* <View style={styles.contentContainer}>
          <View>
            <Text style={{ textAlign: "center" }}>{restaurantName}</Text>
            <Text style={{ textAlign: "center" }}>{restaurantAddress}</Text>
          </View>
        </View> */}

        {/* once confirmed we will send the restaurant name, event title, tax, tip and total mean cost */}
        {/* <PrimaryButton onPress={() => navigation.navigate("New Split")}>
          Confirm
        </PrimaryButton> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 16,
    marginTop: -5,
    margin: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    //   justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    padding: 0,
    margin: 0,
    marginRight: "2%",
    width: "10%",
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: "cover",
  },
  additionalDinerText: {
    fontSize: 20,
    fontFamily: "red-hat-bold",
    letterSpacing: 3,
    textAlign: "center",
    color: Colors.goDutchRed,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    marginVertical: 5,
  },
  title: {
    fontSize: 30,
    fontFamily: "red-hat-bold",
    letterSpacing: 3,
    textAlign: "center",
    color: Colors.goDutchRed,
    marginBottom: -5,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 3,
    fontFamily: "red-hat-regular",
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    width: 30,
  },
  primaryDiner: {
    fontFamily: "red-hat-bold",
  },
  flatListContainer: {
    flexGrow: 1,
    // justifyContent: 'space-between',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 360, // Make sure each item takes up 100% of the width
    padding: 10, // Add padding for spacing
    marginBottom: 2,
    backgroundColor: "#fff", // Set a background color if needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default ConfirmTotals;
