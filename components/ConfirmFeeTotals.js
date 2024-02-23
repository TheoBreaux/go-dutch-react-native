import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import Logo from "./Logo";
import PrimaryButton from "./ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const ConfirmFeeTotals = () => {
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

  console.log(
    "BIRTHDAY DINERS - IN CONFIRMTOTALS COMPONENT",
    useSelector((state) => state.diningEvent.birthdayDiners)
  );

  return (
    <>
      <Logo />

      <ScrollView contentContainerStyle={styles.cardContainer}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <Text style={styles.restaurantAddress}>{restaurantAddress}</Text>

          <View style={styles.feeContainer}>
            <Text style={styles.text}>Tax</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="$0.00"
              placeholderTextColor="gray"
              render={({ value }) => (
                <Text style={styles.textInput}>${value}</Text>
              )}
            />
            <PrimaryButton width={50}>
              <Ionicons name="checkmark-sharp" size={20} color="white" />
            </PrimaryButton>
            <PrimaryButton width={50}>
              <Ionicons name="ios-add-sharp" size={20} color="white" />
            </PrimaryButton>
          </View>

          <View style={styles.feeContainer}>
            <Text style={styles.text}>Tip</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="$0.00"
              placeholderTextColor="gray"
              render={({ value }) => (
                <Text style={styles.textInput}>${value}</Text>
              )}
            />
            <PrimaryButton width={50}>
              <Ionicons name="checkmark-sharp" size={20} color="white" />
            </PrimaryButton>
            <PrimaryButton width={50}>
              <Ionicons name="ios-add-sharp" size={20} color="white" />
            </PrimaryButton>
          </View>

          <View style={styles.feeContainer}>
            <Text style={styles.text}>Service</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="$0.00"
              placeholderTextColor="gray"
              render={({ value }) => (
                <Text style={styles.textInput}>${value}</Text>
              )}
            />
            <PrimaryButton width={50}>
              <Ionicons name="checkmark-sharp" size={20} color="white" />
            </PrimaryButton>
            <PrimaryButton width={50}>
              <Ionicons name="ios-add-sharp" size={20} color="white" />
            </PrimaryButton>
          </View>

          <View style={styles.feeContainer}>
            <Text style={styles.text}>Gratuity</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="$0.00"
              placeholderTextColor="gray"
              render={({ value }) => (
                <Text style={styles.textInput}>${value}</Text>
              )}
            />
            <PrimaryButton width={50}>
              <Ionicons name="checkmark-sharp" size={20} color="white" />
            </PrimaryButton>
            <PrimaryButton width={50}>
              <Ionicons name="ios-add-sharp" size={20} color="white" />
            </PrimaryButton>
          </View>

          <View style={styles.feeContainer}>
            <Text style={styles.text}>Entertainment</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="$0.00"
              placeholderTextColor="gray"
              render={({ value }) => (
                <Text style={styles.textInput}>${value}</Text>
              )}
            />
            <PrimaryButton width={50}>
              <Ionicons name="checkmark-sharp" size={20} color="white" />
            </PrimaryButton>
            <PrimaryButton width={50}>
              <Ionicons name="ios-add-sharp" size={20} color="white" />
            </PrimaryButton>
          </View>
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
    // alignItems: "center",
  },
  restaurantName: {
    fontSize: 40,
    color: Colors.goDutchRed,
  },
  restaurantAddress: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    marginRight: 5,
    fontSize: 20,
    fontFamily: "red-hat-regular",
  },
  feeContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    height: 55,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    textAlign: "center",
    color: "black",
    fontFamily: "red-hat-regular",
    fontSize: 20,
  },
});

// // {showConfirmationModal && (
//         <Modal
//           visible={showConfirmationModal}
//           animationType="slide"
//           transparent={true}
//         >
//           <View style={styles.overlay}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.subtitle}>Are you sure?</Text>
//                 <View style={{ flexDirection: "row" }}>
//                   <PrimaryButton width={80} onPress={handleNextDiner}>
//                     Yes
//                   </PrimaryButton>
//                   <PrimaryButton
//                     onPress={() => setShowReviewModal(true)}
//                     width={80}
//                   >
//                     No
//                   </PrimaryButton>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       )}

export default ConfirmFeeTotals;
