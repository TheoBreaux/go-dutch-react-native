import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
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

const ConfirmFeeTotalsScreen = () => {
  const [showAddFeesModal, setShowAddFeesModal] = useState(false);
  const [newFeeName, setNewFeeName] = useState("");
  const [newFeePrice, setNewFeePrice] = useState("");
  const [taxConfirmed, setTaxConfirmed] = useState("");
  const [tipConfirmed, setTipConfirmed] = useState("");
  const [gratuityConfirmed, setGratuityConfirmed] = useState("");
  const [serviceConfirmed, setServiceConfirmed] = useState("");
  const [entertainmentConfirmed, setEntertainmentConfirmed] = useState("");
  const [showTreatBirthdayDinersModal, setShowTreatBirthdayDinersModal] =
    useState(false);
  const [additionalCustomFeesAdded, setAdditionalCustomFeesAdded] = useState(
    []
  );
  const [feeValue, setFeeValue] = useState("");

  const dinersUpdated = useSelector((state) => state.diningEvent.diners);
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
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

  const handleNoBirthdaysPresent = () => {
    //calculate fees not taking care of or no birthday diners
    const sharedExpenses =
      (parseFloat(taxConfirmed) +
        parseFloat(tipConfirmed) +
        parseFloat(sumAdditionalFees())) /
      dinersUpdated.length;
    if (birthdayDinersPresent) {
      setShowTreatBirthdayDinersModal(true);
    } else {
      //post final dining event values data to database
      postDataFinalDiningEventValues();
      //post final additional diner values data to database
      postDataFinalAdditionalDinerValues(sharedExpenses);
      //navigate to close out check
      navigation.navigate("CheckCloseOutDetails");
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
  }, []);

  const postDataFinalDiningEventValues = async () => {
    const totalMealCost =
      parseFloat(mealSubtotal) +
      parseFloat(taxConfirmed) +
      parseFloat(tipConfirmed) +
      parseFloat(sumAdditionalFees());

    const data = {
      eventId: eventId,
      tax: taxConfirmed,
      tip: tipConfirmed,
      totalMealCost: parseFloat(totalMealCost),
    };

    try {
      const response = await fetch(
        `https://68a9-2603-8000-c0f0-a570-6935-af29-f20-ded2.ngrok-free.app/diningevent/values`,
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

  const postDataFinalAdditionalDinerValues = async (sharedExpenses) => {
    const data = {
      eventId: eventId,
      sharedExpenses: sharedExpenses,
      dinersUpdated: dinersUpdated,
      birthdayDiners: birthdayDiners,
    };

    try {
      const response = await fetch(
        `https://68a9-2603-8000-c0f0-a570-6935-af29-f20-ded2.ngrok-free.app/additionaldiners/values`,
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

  const calculateWithBirthdayDiners = () => {
    //calculate fees taking care of birthday diners
    const sharedExpenses =
      (parseFloat(taxConfirmed) +
        parseFloat(tipConfirmed) +
        parseFloat(sumAdditionalFees())) /
      (dinersUpdated.length - birthdayDiners.length);

    //post final dining event values data to database
    postDataFinalDiningEventValues();
    //post final additional diner values data to database
    postDataFinalAdditionalDinerValues(sharedExpenses);
    //navigate to close out check
    navigation.navigate("CheckCloseOutDetails");
  };

  const calculateWithoutBirthdayDiners = () => {
    //calculate fees not taking care of or no birthday diners
    const sharedExpenses =
      (parseFloat(taxConfirmed) +
        parseFloat(tipConfirmed) +
        parseFloat(sumAdditionalFees())) /
      dinersUpdated.length;

    //post final dining event values data to database
    postDataFinalDiningEventValues();
    //post final additional diner values data to database
    postDataFinalAdditionalDinerValues(sharedExpenses);
    //navigate to close out check
    navigation.navigate("CheckCloseOutDetails");
  };

  const sumAdditionalFees = () => {
    let totalAdditionalFees = 0;

    additionalCustomFeesAdded.forEach((fee) => {
      totalAdditionalFees += fee.feePrice;
    });
    return totalAdditionalFees.toFixed(2);
  };

  console.log("RECEIPT VALUES", receiptValues);
  console.log("DINERS UPDATED", dinersUpdated);
  console.log(
    "ADDITIONAL CUSTOMER FEES ADDED ARRAY",
    additionalCustomFeesAdded
  );
  console.log("TAX", taxConfirmed);
  console.log("TIP", tipConfirmed);
  console.log("SUBTOTAL", mealSubtotal);
  console.log("ADDITIONAL CUSTOM FEES ADDED", sumAdditionalFees());
  console.log("DINERS UPDATED", dinersUpdated);

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

            <PrimaryButton width={50}>
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
            <PrimaryButton width={50}>
              <Ionicons
                name="close"
                size={20}
                color="white"
                onPress={() => setTaxConfirmed("")}
              />
            </PrimaryButton>
          </View>

          {/* render additional custom fees */}
          {!showAddFeesModal &&
            additionalCustomFeesAdded.map((fee, index) => (
              <FeeTextInput
                key={index}
                feeName={fee.feeName}
                value={fee.feePrice.toFixed(2).toString()}
                onChangeText={handleFeeChange}
                onClearPress={() => setFeeValue("")}
              />
            ))}

          <Text style={styles.missingFeesText}>Missing Fees?</Text>

          <View style={{ marginBottom: 10, flexDirection: "row" }}>
            <PrimaryButton
              onPress={() => setShowAddFeesModal(!showAddFeesModal)}
            >
              Yes, add them!
            </PrimaryButton>

            {/* will navigate to breakdown page to close out check, send all info to DB, then back to Home */}
            <PrimaryButton onPress={handleNoBirthdaysPresent}>
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
            <Modal
              animationType="slide"
              transparent={true}
              visible={showTreatBirthdayDinersModal}
            >
              <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <>
                      <Text style={styles.birthdayEmoji}>🥳</Text>

                      <Text style={styles.modalText}>
                        Taking care of birthday diner(s)?
                      </Text>
                      <View style={styles.buttonsContainer}>
                        <PrimaryButton
                          width={100}
                          onPress={calculateWithBirthdayDiners}
                        >
                          Yes
                        </PrimaryButton>

                        <PrimaryButton
                          width={100}
                          onPress={calculateWithoutBirthdayDiners}
                        >
                          No
                        </PrimaryButton>
                      </View>
                    </>
                  </View>
                </View>
              </View>
            </Modal>
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
    fontFamily: "red-hat-regular",
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
    fontFamily: "red-hat-regular",
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "red-hat-bold",
    marginBottom: 20,
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  modalText: {
    fontFamily: "red-hat-regular",
    fontSize: 25,
  },
  birthdayEmoji: {
    fontSize: 150,
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
    fontFamily: "red-hat-regular",
    fontSize: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
});

export default ConfirmFeeTotalsScreen;
