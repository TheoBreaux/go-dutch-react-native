import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/colors";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import FeeTextInput from "../components/FeeTextInput";
import AddPropertyToListModal from "../components/AddPropertyToListModal";
import {
  updateBirthdayDinerFinalMealCost,
  updateFinalDiningEventValues,
} from "../store/store";
import CustomModal from "../components/CustomModal";

const ConfirmFeeTotalsScreen = () => {
  const [showAddFeesModal, setShowAddFeesModal] = useState(false);
  const [newFeeName, setNewFeeName] = useState("");
  const [newFeePrice, setNewFeePrice] = useState("");
  const [taxConfirmed, setTaxConfirmed] = useState("");
  const [tipConfirmed, setTipConfirmed] = useState("");
  const [sharedDinnerItemsConfirmed, setSharedDinnerItemsConfirmed] =
    useState("");
  const [gratuityConfirmed, setGratuityConfirmed] = useState("");
  const [serviceConfirmed, setServiceConfirmed] = useState("");
  const [entertainmentConfirmed, setEntertainmentConfirmed] = useState("");
  const [showTreatBirthdayDinersModal, setShowTreatBirthdayDinersModal] =
    useState(false);
  const [additionalCustomFeesAdded, setAdditionalCustomFeesAdded] = useState(
    []
  );
  const [feeValue, setFeeValue] = useState("");
  const [finalBirthdayDinerNumbers, setFinalBirthdayDinerNumbers] = useState(
    []
  );
  const dinersUpdated = useSelector((state) => state.diningEvent.diners);
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
  const evenlySplitItemsTotal = useSelector((state) =>
    state.diningEvent.evenlySplitItems
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2)
  );

  const mealSubtotal = useSelector(
    (state) => state.diningEvent.event.subtotal
  ).toFixed(2);

  const birthdayDiners = useSelector(
    (state) => state.diningEvent.birthdayDiners
  );

  const birthdayDinersPresent = birthdayDiners.length > 0;

  const eventId = useSelector((state) => state.diningEvent.event.eventId);

  const lineItemAmounts = receiptValues.amounts;
  const restaurantName = receiptValues.merchantName.data;
  const restaurantAddress = receiptValues.merchantAddress.data;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const findAdditionalCharge = (array, searchString) => {
    const matchingObject = array.find((obj) =>
      obj.text.toLowerCase().includes(searchString.toLowerCase())
    );
    if (matchingObject) {
      const value = matchingObject.text.match(/[+-]?\d+(\.\d+)?/g); // Extract numerical part
      return value ? parseFloat(value[0]) : 0; // Parse into float
    } else {
      return 0;
    }
  };

  const addAdditionalCustomFees = () => {
    if (newFeeName === "" || newFeePrice === "") {
      return setShowAddFeesModal(false);
    }

    setAdditionalCustomFeesAdded([
      ...additionalCustomFeesAdded,
      {
        feeName: newFeeName,
        feePrice: parseFloat(newFeePrice),
      },
    ]);
    setNewFeeName("");
    setNewFeePrice("");
    setShowAddFeesModal(false);
  };

  const handleFeeChange = (text) => {
    setFeeValue(text);
  };

  const handleFeeRemove = (index) => {
    const updatedFees = [...additionalCustomFeesAdded];
    updatedFees.splice(index, 1);
    setAdditionalCustomFeesAdded(updatedFees);
  };

  const handleNoBirthdaysPresent = () => {
    //calculate fees not taking care of or no birthday diners
    let sharedExpenses;
    if (evenlySplitItemsTotal !== "0.00") {
      sharedExpenses =
        (parseFloat(taxConfirmed) +
          parseFloat(tipConfirmed) +
          parseFloat(evenlySplitItemsTotal) +
          parseFloat(sumAdditionalFees())) /
        (dinersUpdated.length - 1);
    } else {
      sharedExpenses =
        (parseFloat(taxConfirmed) +
          parseFloat(tipConfirmed) +
          parseFloat(sumAdditionalFees())) /
        dinersUpdated.length;
    }

    if (birthdayDinersPresent) {
      setShowTreatBirthdayDinersModal(true);
    } else {
      //post final dining event values data to database
      postDataFinalDiningEventValues();
      //post final additional diner values data to database
      postDataFinalAdditionalDinerValues(sharedExpenses);
      //navigate to close out check
      navigation.navigate("CheckCloseOutDetailsScreen");
    }
  };

  //set initial values from receipt
  useEffect(() => {
    const tax = findAdditionalCharge(lineItemAmounts, "tax");

    const tip = parseFloat(mealSubtotal * 0.2)
      .toFixed(2)
      .toString();
    const gratuity = findAdditionalCharge(lineItemAmounts, "gratuity");
    const service = findAdditionalCharge(lineItemAmounts, "service");
    const entertainment = findAdditionalCharge(
      lineItemAmounts,
      "entertainment"
    );

    setTaxConfirmed(tax.toString());
    setTipConfirmed(tip.toString());
    setServiceConfirmed(service.toString());
    setGratuityConfirmed(gratuity.toString());
    setEntertainmentConfirmed(entertainment.toString());
    setSharedDinnerItemsConfirmed(evenlySplitItemsTotal.toString());
  }, []);

  const postDataFinalDiningEventValues = async () => {
    const data = {
      eventId: eventId,
      tax: taxConfirmed,
      tip: tipConfirmed,
      totalMealCost: parseFloat(totalMealCost),
      subtotal: parseFloat(mealSubtotal),
    };

    //update state
    dispatch(updateFinalDiningEventValues(data));

    try {
      const response = await fetch(
        `https://8ca5-2603-8000-c0f0-a570-b992-8298-958c-98c9.ngrok-free.app/diningevent/values`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      // const result = await response.json();
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const postDataFinalAdditionalDinerValues = async (
    sharedExpenses,
    coveringBirthdayDiners,
    evenlySplitItems
  ) => {
    const evenlySplitTotal = parseFloat(
      evenlySplitItemsTotal / (dinersUpdated.length - 1)
    );
    const totalSharedExpenses = Math.round(sharedExpenses * 100) / 100;

    const data = {
      eventId: eventId,
      sharedExpenses: totalSharedExpenses,
      dinersUpdated: dinersUpdated,
      coveringBirthdayDiners: coveringBirthdayDiners,
      evenlySplitItems: evenlySplitItems,
      birthdayDiners: birthdayDiners,
      tax: taxConfirmed,
      tip: tipConfirmed,
      subtotal: parseFloat(mealSubtotal),
      totalMealCost: parseFloat(totalMealCost),
    };

    try {
      const response = await fetch(
        `https://8ca5-2603-8000-c0f0-a570-b992-8298-958c-98c9.ngrok-free.app/additionaldiners/values`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      setFinalBirthdayDinerNumbers(result);
      dispatch(updateBirthdayDinerFinalMealCost(result));
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const calculateWithBirthdayDiners = () => {
    //calculate fees taking care of birthday diners
    let sharedExpenses;
    let evenlySplitItems;
    if (evenlySplitItemsTotal !== "0.00") {
      evenlySplitItems = true;
      sharedExpenses =
        parseFloat(taxConfirmed) +
        parseFloat(tipConfirmed) +
        parseFloat(evenlySplitItemsTotal) +
        parseFloat(sumAdditionalFees());
    } else {
      evenlySplitItems = false;
      sharedExpenses =
        (parseFloat(taxConfirmed) +
          parseFloat(tipConfirmed) +
          parseFloat(sumAdditionalFees())) /
        (dinersUpdated.length - birthdayDiners.length);
    }

    //post final dining event values data to database
    postDataFinalDiningEventValues();
    //post final additional diner values data to database
    postDataFinalAdditionalDinerValues(sharedExpenses, true, evenlySplitItems);
    //navigate to close out check
    navigation.navigate("CheckCloseOutDetailsScreen", {
      finalBirthdayDinerNumbers: finalBirthdayDinerNumbers,
    });
  };

  const calculateWithoutBirthdayDiners = () => {
    //calculate fees taking care of birthday diners
    let sharedExpenses;
    let evenlySplitItems;
    if (evenlySplitItemsTotal !== "0.00") {
      evenlySplitItems = true;
      sharedExpenses =
        (parseFloat(taxConfirmed) +
          parseFloat(tipConfirmed) +
          parseFloat(evenlySplitItemsTotal) +
          parseFloat(sumAdditionalFees())) /
        (dinersUpdated.length - 1);
    } else {
      evenlySplitItems = false;
      sharedExpenses =
        (parseFloat(taxConfirmed) +
          parseFloat(tipConfirmed) +
          parseFloat(sumAdditionalFees())) /
        dinersUpdated.length;
    }

    //post final dining event values data to database
    postDataFinalDiningEventValues();
    //post final additional diner values data to database
    postDataFinalAdditionalDinerValues(sharedExpenses, false, evenlySplitItems);
    //navigate to close out check
    navigation.navigate("CheckCloseOutDetailsScreen");
  };

  const sumAdditionalFees = () => {
    let totalAdditionalFees = 0;

    additionalCustomFeesAdded.forEach((fee) => {
      totalAdditionalFees += fee.feePrice;
    });
    return totalAdditionalFees.toFixed(2);
  };

  const totalMealCost =
    parseFloat(mealSubtotal) +
    parseFloat(taxConfirmed) +
    parseFloat(tipConfirmed) +
    parseFloat(sumAdditionalFees());

  return (
    <>
      <Logo />
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <Text style={styles.restaurantAddress}>{restaurantAddress}</Text>

          <View style={styles.feeContainer}>
            <Text style={styles.text}>Tip</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="$0.00"
              placeholderTextColor="gray"
              value={tipConfirmed}
              onChangeText={(text) => setTipConfirmed(text)}
            />

            <View style={styles.tipSuggestionsContainer}>
              <TouchableOpacity
                onPress={() =>
                  setTipConfirmed(
                    (0.18 * parseFloat(mealSubtotal)).toFixed(2).toString()
                  )
                }
              >
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.emoji}>🙂</Text>
                  <Text style={styles.suggestedTipText}>Good</Text>
                  <Text style={styles.suggestedTipPercentage}>18%</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setTipConfirmed(
                    (0.2 * parseFloat(mealSubtotal)).toFixed(2).toString()
                  )
                }
              >
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.emoji}>😃</Text>
                  <Text style={styles.suggestedTipText}>Great</Text>
                  <Text style={styles.suggestedTipPercentage}>20%</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setTipConfirmed(
                    (0.25 * parseFloat(mealSubtotal)).toFixed(2).toString()
                  )
                }
              >
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.emoji}>😄</Text>
                  <Text style={styles.suggestedTipText}>Wow!</Text>
                  <Text style={styles.suggestedTipPercentage}>25%</Text>
                </View>
              </TouchableOpacity>
            </View>

            <PrimaryButton width={40} height={55}>
              <Ionicons
                name="close"
                size={20}
                color="white"
                onPress={() => setTipConfirmed("")}
              />
            </PrimaryButton>
          </View>

          <View style={styles.feeContainer}>
            <Text style={styles.text}>Tax</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="$0.00"
              placeholderTextColor="gray"
              value={taxConfirmed}
              onChangeText={(text) => setTaxConfirmed(text)}
            />
            <PrimaryButton width={40} height={55}>
              <Ionicons
                name="close"
                size={20}
                color="white"
                onPress={() => setTaxConfirmed("")}
              />
            </PrimaryButton>
          </View>

          {/* render additional custom fees */}

          {evenlySplitItemsTotal !== "0.00" && (
            <View style={styles.feeContainer}>
              <Text style={styles.text}>Shared Items</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="$0.00"
                placeholderTextColor="gray"
                value={sharedDinnerItemsConfirmed}
                onChangeText={(text) => setSharedDinnerItemsConfirmed(text)}
              />
              <PrimaryButton width={40} height={55}>
                <Ionicons
                  name="close"
                  size={20}
                  color="white"
                  onPress={() => setSharedDinnerItemsConfirmed("")}
                />
              </PrimaryButton>
            </View>
          )}

          {!showAddFeesModal &&
            additionalCustomFeesAdded.map((fee, index) => (
              <FeeTextInput
                key={index}
                feeName={fee.feeName}
                value={fee.feePrice.toFixed(2).toString()}
                onChangeText={handleFeeChange}
                onClearPress={() => handleFeeRemove(index)}
              />
            ))}

          <Text style={styles.missingFeesText}>Missing Fees?</Text>

          <View style={{ marginBottom: 10, flexDirection: "row" }}>
            <PrimaryButton
              height={50}
              onPress={() => setShowAddFeesModal(!showAddFeesModal)}
            >
              Yes, add them!
            </PrimaryButton>

            {/* will navigate to breakdown page to close out check, send all info to DB, then back to Home */}
            <PrimaryButton height={50} onPress={handleNoBirthdaysPresent}>
              No, continue!
            </PrimaryButton>
          </View>

          {/* allow user to add custom fees that may go missing  */}
          {showAddFeesModal && (
            <AddPropertyToListModal
              visible={showAddFeesModal}
              onClose={() => setShowAddFeesModal(false)}
              onSubmit={addAdditionalCustomFees}
              newItemName={newFeeName}
              setNewItemName={setNewFeeName}
              newItemPrice={newFeePrice}
              setNewItemPrice={setNewFeePrice}
              type="Fee Name"
            />
          )}

          {/* ask if diners will take care of birthdat diner's meals */}

          {birthdayDinersPresent && (
            <CustomModal
              animationType="slide"
              transparent={true}
              visible={showTreatBirthdayDinersModal}
              modalText="Taking care of birthday diner(s)?"
              buttonText1="Yes"
              onPress1={calculateWithBirthdayDiners}
              buttonText2="No"
              onPress2={calculateWithoutBirthdayDiners}
              buttonWidth={100}
              source={require("../assets/party-face-emoji.png")}
            />
          )}

          {serviceConfirmed != "0" && (
            <FeeTextInput
              onChangeText={(text) => setServiceConfirmed(text)}
              onPress={() => setServiceConfirmed("")}
              value={serviceConfirmed}
            />
          )}

          {gratuityConfirmed != "0" && (
            <FeeTextInput
              onChangeText={(text) => setGratuityConfirmed(text)}
              onPress={() => setGratuityConfirmed("")}
              value={gratuityConfirmed}
            />
          )}

          {entertainmentConfirmed != "0" && (
            <FeeTextInput
              onChangeText={(text) => setEntertainmentConfirmed(text)}
              onPress={() => setEntertainmentConfirmed("")}
              value={entertainmentConfirmed}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // flex: 1,
    padding: 16,
    marginTop: -5,
    margin: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  restaurantName: {
    fontSize: 40,
    color: Colors.goDutchRed,
  },
  restaurantAddress: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 5,
  },
  feeContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginRight: 5,
    fontSize: 20,
    fontFamily: "red-hat-normal",
  },
  textInput: {
    flex: 1,
    height: 60,
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    textAlign: "center",
    color: "black",
    fontFamily: "red-hat-bold",
    fontSize: 25,
  },
  buttonTextContainer: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  suggestedTipText: {
    fontFamily: "red-hat-normal",
    fontSize: 14,
    color: "black",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -5,
  },
  emoji: {
    fontSize: 25,
    marginHorizontal: 5,
  },
  suggestedTipPercentage: {
    fontFamily: "red-hat-bold",
    fontSize: 16,
    marginTop: -5,
    color: "black",
  },
  missingFeesText: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
    letterSpacing: 1,
  },
  tipSuggestionsContainer: {
    flexDirection: "row",
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputLabels: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "red-hat-bold",
  },
  modalTextInput: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    textAlign: "center",
    color: "black",
    fontFamily: "red-hat-normal",
    fontSize: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
});

export default ConfirmFeeTotalsScreen;
