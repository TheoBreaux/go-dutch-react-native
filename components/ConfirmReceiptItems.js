import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAllReceiptItems } from "../store/store";
import Logo from "./Logo";
import PrimaryButton from "./ui/PrimaryButton";
import ConfirmableDinnerItem from "./ui/ConfirmableDinnerItem";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { nanoid } from "@reduxjs/toolkit";

//loop through receiptAmounts array to configure data for use
const configureReceiptData = (receiptAmounts) => {
  const configuredData = [];

  for (let i = 0; i < receiptAmounts.length; i++) {
    let lineItem = receiptAmounts[i].text;
    let match = lineItem.match(
      /^(\d+)\s*([^\d]+(?:\(\d+\))?[a-zA-Z\s-]+)\s*(\d*\.?\d+)$/
    );

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

const ConfirmReceiptItems = () => {
  const [separatedDinnerItems, setSeparatedDinnerItems] = useState([]);
  const [profilePicPaths, setProfilePicPaths] = useState([]);
  const [showAddItemsModal, setShowAddItemsModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
  const eventId = useSelector((state) => state.diningEvent.event.eventId);
  const receiptAmounts = receiptValues.amounts;
  const diners = useSelector((state) => state.diningEvent.diners);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const configuredData = configureReceiptData(receiptAmounts);

    // Initialize array for separate quantities of more than 1 into individual dinner items
    const items = [];
    configuredData.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        items.push({
          ...item,
          id: nanoid(8),
        });
      }
    });
    setSeparatedDinnerItems(items);
    dispatch(setAllReceiptItems(items));
  }, [receiptAmounts]);

  useEffect(() => {
    // Fetch profile pictures when the component mounts
    const fetchProfilePicPaths = async () => {
      try {
        const response = await fetch(
          `https://e546-2603-8000-c0f0-a570-a890-42c9-3fd9-d31c.ngrok-free.app/additionaldiners/profilepics/${eventId}`
        );
        const data = await response.json();
        setProfilePicPaths(data);
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
      }
    };
    fetchProfilePicPaths();
  }, [eventId]);

  const updatedDiners = profilePicPaths.map((diner, i) => ({
    ...diners[i],
    profile_pic_image_path:
      diner.profile_pic_image_path || diners[i]?.profile_pic_image_path,
  }));

  const addNewItem = () => {
    if (newItemName === "" || newItemPrice === "") {
      return setShowAddItemsModal(false);
    }

    const newItem = {
      count: 1,
      name: newItemName,
      price: parseFloat(newItemPrice),
      id: nanoid(8),
    };

    // Add the new item to the existing array
    setSeparatedDinnerItems((prevItems) => [...prevItems, newItem]);

    // Optionally, you can reset the input fields
    setNewItemName("");
    setNewItemPrice("");

    // Close the modal
    setShowAddItemsModal(false);
  };

  const deleteItem = (itemId) => {
    const updatedItems = separatedDinnerItems.filter(
      (item) => item.id !== itemId
    );
    setSeparatedDinnerItems(updatedItems);
  };

  return (
    <View style={styles.container}>
      <Logo />

      {showAddItemsModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddItemsModal}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Please enter missing item info
                </Text>
                <View style={styles.inputsContainer}>
                  <Text style={styles.inputLabels}>Name:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newItemName}
                    onChangeText={(text) => setNewItemName(text)}
                  />
                  <Text style={styles.inputLabels}>Price:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newItemPrice}
                    onChangeText={(text) => setNewItemPrice(text)}
                  />

                  <View style={{ flexDirection: "row" }}>
                    <PrimaryButton
                      width={100}
                      onPress={() => setShowAddItemsModal(false)}>
                      Close
                    </PrimaryButton>
                    <PrimaryButton width={100} onPress={addNewItem}>
                      Submit
                    </PrimaryButton>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.confirmContainer}>
        <Text style={styles.title}>Confirm or add missing items!</Text>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            width={90}
            onPress={() => {
              navigation.navigate("AssignItems", {
                updatedDiners: updatedDiners,
              });
              dispatch(setAllReceiptItems(separatedDinnerItems));
            }}>
            <Ionicons name="checkmark-sharp" size={30} color="white" />
          </PrimaryButton>
          <PrimaryButton width={90} onPress={() => setShowAddItemsModal(true)}>
            <Ionicons name="ios-add-sharp" size={30} color="white" />
          </PrimaryButton>
        </View>
      </View>

      <ScrollView style={styles.foodItemsListContainer}>
        {separatedDinnerItems.map((item) => {
          return (
            <ConfirmableDinnerItem
              key={item.id}
              item={item}
              onDelete={() => deleteItem(item.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    width: "80%",
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
  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputLabels: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "red-hat-bold",
  },
  textInput: {
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
  confirmContainer: {
    backgroundColor: "white",
    marginHorizontal: 15,
    borderRadius: 10,
    height: 125,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: "red-hat-regular",
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  foodItemsListContainer: {
    padding: 10,
    marginBottom: 5,
  },
});

export default ConfirmReceiptItems;
