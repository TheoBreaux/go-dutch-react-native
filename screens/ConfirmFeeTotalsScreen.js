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
import { useEffect, useState } from "react";
import FeeTextInput from "../components/FeeTextInput";
import AddPropertyToListModal from "../components/AddPropertyToListModal";
import {
  updateBirthdayDinerFinalMealCost,
  updateFinalDiningEventValues,
} from "../store/store";
import CustomModal from "../components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

//push notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

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
  const [finalDinerNumbers, setFinalDinerNumbers] = useState([]);
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

  const diningEvent = useSelector((state) => state.diningEvent);
  const eventId = useSelector((state) => state.diningEvent.event.eventId);

  const lineItemAmounts = receiptValues.amounts;

  const restaurantName =
    diningEvent.event.selectedRestaurant.trim() ||
    diningEvent.event.enteredSelectedRestaurant.trim();

  const restaurantAddress = receiptValues.merchantAddress.data;

  const primaryDiner = useSelector((state) => state.userInfo.user.username);

  const dispatch = useDispatch();
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

  //handle receipt and tapping of notification
  useEffect(() => {
    // const subscription = Notifications.addNotificationReceivedListener(
    //   (notification) => {
    //     console.log("NOTIFICATION RECEIVED");
    //     console.log(notification);
    //   }
    // );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        //this is the activity i want to happen, i want the modal to show
        // console.log("NOTIFICATION RESPONSE RECEIVED");
        // console.log(response);
        // console.log("HELLO");
      }
    );

    return () => {
      // subscription.remove();
      subscription2.remove();
    };
  }, []);

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

  // Function to handle the press on suggested tip percentages
  const handleTipSuggestion = (percentage) => {
    const suggestedTip = (parseFloat(mealSubtotal) * percentage)
      .toFixed(2)
      .toString();
    setTipConfirmed(suggestedTip);
  };

  //send push notifications to diners about their bill
  const sendPushNotificationHandler = (result) => {
    const individualDinerMealCosts = result.dinerMealCosts;

    dinersUpdated.forEach((diner) => {
      const isPrimaryDiner = diner.additionalDinerUsername === primaryDiner;

      if (isPrimaryDiner) {
        let bodyMessage = `You are the primary diner. Please collect payments from the following diners.\n\n`;

        individualDinerMealCosts.forEach((costObj) => {
          if (costObj.additionalDinerUsername === primaryDiner) {
            bodyMessage += `@${costObj.additionalDinerUsername}: PAID IN FULL\n`;
          } else if (costObj.additionalDinerUsername === "shareditems") {
            bodyMessage += `@${costObj.additionalDinerUsername}: $0.00\n`;
          } else {
            bodyMessage += `@${costObj.additionalDinerUsername}: $${costObj.dinerMealCost}\n`;
          }
        });

        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: diner.pushNotificationToken,
            sound: "default",
            title: `Hey, ${diner.firstName}! You have paid $${totalMealCost} for the bill at ${restaurantName}!`,
            body: bodyMessage,
          }),
        });
      } else {
        const matchingDinerObject = individualDinerMealCosts.find(
          (costObj) =>
            costObj.additionalDinerUsername === diner.additionalDinerUsername
        );

        if (matchingDinerObject) {
          const dinerMealCost = matchingDinerObject.dinerMealCost;

          fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: diner.pushNotificationToken,
              title: `Hey, ${diner.firstName}! Your ${restaurantName} bill is ready to be paid!`,
              body: `Your portion of the bill is $${dinerMealCost}. Please pay primary diner @${primaryDiner}.`,
              data: {
                primaryDinerUsername: primaryDiner,
                primaryPaymentSource: diner.primaryPaymentSource,
                primaryPaymentSourceUsername:
                  diner.primaryPaymentSourceUsername,
                secondaryPaymentSource: diner.secondaryPaymentSource,
                secondaryPaymentSourceUsername:
                  diner.secondaryPaymentSourceUsername,
              },
            }),
          });
        }
      }
    });
  };

  const handleNoBirthdaysPresent = () => {
    //calculate fees not taking care of or no birthday diners
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
      postDataFinalAdditionalDinerValues(
        sharedExpenses,
        false,
        evenlySplitItems
      );
      //navigate to close out check
      navigation.navigate("CheckCloseOutDetailsScreen");
    }
  };

  const calculateWithBirthdayDiners = () => {
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
        (dinersUpdated.length - birthdayDiners.length - 1);
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
    navigation.navigate("CheckCloseOutDetailsScreen");
  };

  const calculateWithoutBirthdayDiners = () => {
    //calculate fees not taking care of birthday diners
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
        `https://5574-76-32-124-165.ngrok-free.app/diningevent/values`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const postDataFinalAdditionalDinerValues = async (
    sharedExpenses,
    coveringBirthdayDiners,
    evenlySplitItems
  ) => {
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
        `https://5574-76-32-124-165.ngrok-free.app/additionaldiners/values`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      setFinalDinerNumbers(result);
      dispatch(updateBirthdayDinerFinalMealCost(result));

      //send result values for use in push notifications
      sendPushNotificationHandler(result);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <>
      <Logo />

      <ScrollView contentContainerStyle={styles.cardContainer}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          {/* <Text style={styles.restaurantAddress}>{restaurantAddress}</Text> */}

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
              <TouchableOpacity onPress={() => handleTipSuggestion(0.18)}>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.emoji}>🙂</Text>
                  <Text style={styles.suggestedTipText}>Good</Text>
                  <Text style={styles.suggestedTipPercentage}>18%</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleTipSuggestion(0.2)}>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.emoji}>😃</Text>
                  <Text style={styles.suggestedTipText}>Great</Text>
                  <Text style={styles.suggestedTipPercentage}>20%</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleTipSuggestion(0.25)}>
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
    flex: 1,
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  restaurantName: {
    fontSize: 30,
    textAlign: "center",
    color: Colors.goDutchRed,
    fontFamily: "red-hat-bold",
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
