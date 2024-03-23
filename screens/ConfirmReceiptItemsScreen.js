import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAllReceiptItems } from "../store/store";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import ConfirmableDinnerItem from "../components/ConfirmableDinnerItem";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { nanoid } from "@reduxjs/toolkit";
import AddPropertyToListModal from "../components/AddPropertyToListModal";

//loop through receiptAmounts array to configure data for use
const configureReceiptData = (receiptAmounts) => {
  const configuredData = [];

  const excludedKeyWords = [
    "tax",
    "tip",
    "subtotal",
    "total",
    "gratuity",
    "service",
    "entertainment",
  ];

  for (let i = 0; i < receiptAmounts.length; i++) {
    let lineItem = receiptAmounts[i].text;
    let match = lineItem.match(
      /^(\d*)\s*([^\d]*[a-zA-Z\s-]+)\s*\$?(\d*\.?\d+)?$/
    );

    if (match) {
      let count = match[1] !== "" ? parseInt(match[1], 10) : 1;
      let name = match[2].trim();
      let price = parseFloat(match[3] || 0);

      if (count > 1) {
        price /= count;
      }

      const containsExcludedKeyword = excludedKeyWords.some((keyword) => {
        return lineItem.toLowerCase().includes(keyword);
      });

      if (!containsExcludedKeyword) {
        configuredData.push({ count, name, price });
      }
    }
  }

  return configuredData;
};

const ConfirmReceiptItemsScreen = () => {
  const [separatedDinnerItems, setSeparatedDinnerItems] = useState([]);
  const [profileImageKeys, setProfilePicPaths] = useState([]);
  const [showAddItemsModal, setShowAddItemsModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [subtotal, setSubtotal] = useState(0);

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

    let subtotalValue = 0;

    configuredData.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        items.push({
          ...item,
          id: nanoid(8),
        });
        subtotalValue += item.price; // Add this line
      }
    });
    setSeparatedDinnerItems(items);
    setSubtotal(subtotalValue); // Add this line
    dispatch(setAllReceiptItems(items));
  }, [receiptAmounts]);

  useEffect(() => {
    // Fetch profile pictures when the component mounts
    const fetchProfilePicPaths = async () => {
      try {
        const response = await fetch(
          `https://b6d9-2603-8000-c0f0-a570-90cb-fa0b-e3e2-c897.ngrok-free.app/additionaldiners/profilepics/${eventId}`
        );
        const data = await response.json();
        setProfilePicPaths(data);
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
      }
    };
    fetchProfilePicPaths();
  }, [eventId]);

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
    const updatedItems = [...separatedDinnerItems, newItem];

    // Recalculate the subtotal after adding the new item
    const newSubtotal = updatedItems.reduce(
      (total, item) => total + item.price,
      0
    );

    // Add the new item to the existing array
    setSeparatedDinnerItems((prevItems) => [...prevItems, newItem]);
    setSubtotal(newSubtotal);

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

    // Recalculate the subtotal after removing the item
    const newSubtotal = updatedItems.reduce(
      (total, item) => total + item.price,
      0
    );

    setSeparatedDinnerItems(updatedItems);
    setSubtotal(newSubtotal);
  };

  return (
    <View style={styles.container}>
      <Logo />

      {showAddItemsModal && (
        <AddPropertyToListModal
          visible={showAddItemsModal}
          onClose={() => setShowAddItemsModal(false)}
          onSubmit={addNewItem}
          newItemName={newItemName}
          setNewItemName={setNewItemName}
          newItemPrice={newItemPrice}
          setNewItemPrice={setNewItemPrice}
          type="Item"
        />
      )}

      <View style={styles.miniModalContent}>
        <Text style={styles.miniModalText}>Confirm or add missing items!</Text>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            width={90}
            onPress={() => {
              navigation.navigate("AssignItemsArea");
              dispatch(setAllReceiptItems(separatedDinnerItems));
            }}
          >
            <Ionicons name="checkmark-sharp" size={30} color="white" />
          </PrimaryButton>
          <PrimaryButton width={90} onPress={() => setShowAddItemsModal(true)}>
            <Ionicons name="add" size={30} color="white" />
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
        <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
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
    fontFamily: "red-hat-normal",
    fontSize: 25,
  },
  miniModalContent: {
    backgroundColor: "white",
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    height: 150,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  miniModalText: {
    textAlign: "center",
    fontFamily: "red-hat-normal",
    fontSize: 25,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  foodItemsListContainer: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  subtotal: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    fontSize: 25,
    marginTop: 5,
  },
});

export default ConfirmReceiptItemsScreen;
