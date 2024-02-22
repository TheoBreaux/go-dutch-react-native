import { StyleSheet, Text, View, TextInput, Modal } from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import Logo from "./Logo";
import PrimaryButton from "./ui/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const ConfirmTotals = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmTaxAndTipModal, setShowConfirmTaxAndTipModal] =
    useState(true);

  const dinersUpdated = useSelector((state) => state.diningEvent.diners);
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);

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

  const tax = findAdditionalCharge(lineItemAmounts, "tax");
  const tip = findAdditionalCharge(lineItemAmounts, "tip");
  const gratuity = findAdditionalCharge(lineItemAmounts, "gratuity");
  const service = findAdditionalCharge(lineItemAmounts, "service");
  const entertainment = findAdditionalCharge(lineItemAmounts, "entertainment");

  console.log("RECEIPT VALUES", receiptValues);
  console.log("DINERS UPDATED", dinersUpdated);
  console.log("TAX", parseFloat(tax));
  console.log("TIP", parseFloat(tip));
  console.log("GRATUITY", parseFloat(gratuity));
  console.log("SERVICE", parseFloat(service));
  console.log("ENTERTAINMENT", parseFloat(entertainment));

  console.log("BIRTHDAY DINERS - IN CONFIRMTOTALS COMPONENT", useSelector((state) => state.diningEvent.birthdayDiners));

  return (
    <>
      <Logo />

      {/* {showConfirmTaxAndTipModal && (
        <Modal
          visible={showConfirmTaxAndTipModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.subtitle}>Are you sure?</Text>
                <View style={{ flexDirection: "row" }}>
                  <PrimaryButton width={80} onPress={handleNextDiner}>
                    Yes
                  </PrimaryButton>
                  <PrimaryButton
                    onPress={() => setShowReviewModal(true)}
                    width={80}
                  >
                    No
                  </PrimaryButton>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )} */}

      <View style={styles.cardContainer}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <Text style={styles.restaurantAddress}>{restaurantAddress}</Text>
        </View>
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
  restaurantName: {
    fontSize: 50,
  },
  restaurantAddress: {
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "80%",
    alignItems: "center",
  },
  // contentContainer: {
  //   alignItems: "center",
  //   textAlign: "center",
  // },
  // button: {
  //   backgroundColor: Colors.goDutchRed,
  //   borderRadius: 5,
  //   padding: 0,
  //   margin: 0,
  //   marginRight: "2%",
  //   width: "10%",
  //   borderColor: "black",
  //   borderWidth: 5,
  //   borderStyle: "solid",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // image: {
  //   width: 300,
  //   height: 400,
  //   resizeMode: "cover",
  // },
  // additionalDinerText: {
  //   fontSize: 20,
  //   fontFamily: "red-hat-bold",
  //   letterSpacing: 3,
  //   textAlign: "center",
  //   color: Colors.goDutchRed,
  //   borderWidth: 1,
  //   padding: 5,
  //   borderRadius: 10,
  //   marginVertical: 5,
  // },
  // title: {
  //   fontSize: 30,
  //   fontFamily: "red-hat-bold",
  //   letterSpacing: 3,
  //   textAlign: "center",
  //   color: Colors.goDutchRed,
  //   marginBottom: -5,
  // },
  // text: {
  //   fontSize: 20,
  //   textAlign: "center",
  //   letterSpacing: 3,
  //   fontFamily: "red-hat-regular",
  // },
  // button: {
  //   backgroundColor: Colors.goDutchRed,
  //   width: 30,
  // },
  // primaryDiner: {
  //   fontFamily: "red-hat-bold",
  // },
  // flatListContainer: {
  //   flexGrow: 1,
  //   // justifyContent: 'space-between',
  // },
  // row: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   width: 360, // Make sure each item takes up 100% of the width
  //   padding: 10, // Add padding for spacing
  //   marginBottom: 2,
  //   backgroundColor: "#fff", // Set a background color if needed
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 3,
  //   elevation: 5,
  // },
});

export default ConfirmTotals;
