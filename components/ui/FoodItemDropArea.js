import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import Colors from "../../constants/colors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "./PrimaryButton";
import ProfileImageMedallion from "./ProfileImageMedallion";
import { useNavigation } from "@react-navigation/native";
import {
  returnRemovedDinerItem,
  setDinerBillComplete,
  updateDinerItems,
  setCurrentDinerId,
} from "../../store/store";

const FoodItemDropArea = () => {
  const dinersUpdated = useSelector((state) => state.diningEvent.diners);
  const separatedDinnerItems = useSelector(
    (state) => state.diningEvent.allReceiptItemsCopy
  );

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmTaxAndTipModal, setShowConfirmTaxAndTipModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [dinerReviewedItems, setDinerReviewedItems] = useState([]);
  const [currentDinerIndex, setCurrentDinerIndex] = useState(0);

  // const currDinerItems = dinersUpdated[currentDinerIndex].items;
  const currDinerItems = dinersUpdated[currentDinerIndex]?.items || [];

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(setCurrentDinerId(dinersUpdated[0].id));
  }, []);

  const handleAssignedItemsReview = () => {
    setDinerReviewedItems(currDinerItems);
    setShowReviewModal(true);
    setShowConfirmTaxAndTipModal(true);
  };

  const handleRemoveItem = (itemId) => {
    // Find the item to be removed
    const removedItem = dinerReviewedItems.find((item) => item.id === itemId);
    const removedItemIndex = dinerReviewedItems.findIndex(
      (item) => item.id === itemId
    );

    if (removedItemIndex !== -1) {
      const updatedReviewedItems = [...dinerReviewedItems];
      updatedReviewedItems.splice(removedItemIndex, 1);

      dispatch(updateDinerItems({ currentDinerIndex, updatedReviewedItems }));
      setDinerReviewedItems(updatedReviewedItems);

      // Dispatch a function to return items assigned incorrectly to diner back to original array
      dispatch(returnRemovedDinerItem(removedItem));
    } else {
      console.error("Item not found in dinerReviewedItems array");
    }
  };

  const confirmCurrentDiner = () => {
    if (separatedDinnerItems.length === 0) {
      //we will navigate to the tax screens and tip screens here
      navigation.navigate("ConfirmTotals");
    } else {
      //setting currentDiner assigned items to be complete
      dispatch(
        setDinerBillComplete({ currentDinerIndex, dinerBillComplete: true })
      );
      setShowReviewModal(false);
      setShowConfirmationModal(true);
      //update the UI to the next diner in the diners array by increment currentDinerIndex
      setCurrentDinerIndex((prevIndex) => prevIndex + 1);

      //reset dinerReviewedItems for next diner to use
      setDinerReviewedItems([]);
    }
  };

  const handleNextDiner = () => {
    const currentDiner = dinersUpdated[currentDinerIndex];
    const currentDinerId = currentDiner.id;
    //update currentDinerId
    dispatch(setCurrentDinerId(currentDinerId));
    setShowConfirmationModal(false);
  };

  return (
    <>
      {showReviewModal && (
        <Modal
          visible={showReviewModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Review Items</Text>
                <Text style={styles.modalSubtitle}>
                  Press EDIT to return, CONFIRM to move to the next diner, or
                  DELETE to remove an item from this diner's bill.
                </Text>
                {/* need to get the current dinners items array and map over it */}
                {dinerReviewedItems.map((item) => (
                  <View key={item.id} style={styles.itemContainer}>
                    <TouchableOpacity>
                      <Text
                        style={styles.delete}
                        onPress={() => handleRemoveItem(item.id)}
                      >
                        DELETE
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.foodInfo}>{item.name}</Text>
                    <Text style={styles.foodInfo}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
                <View style={{ flexDirection: "row" }}>
                  <PrimaryButton
                    width={90}
                    onPress={() => {
                      setShowReviewModal(false);
                      setShowConfirmationModal(false);
                    }}
                  >
                    Edit
                  </PrimaryButton>
                  <PrimaryButton width={90} onPress={confirmCurrentDiner}>
                    Confirm
                  </PrimaryButton>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showConfirmationModal && (
        <Modal
          visible={showConfirmationModal}
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
      )}

      

      
      {showConfirmTaxAndTipModal && (
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
      )}










      <View style={styles.mainContainer}>
        <View style={styles.assignmentContainer}>
          <View style={styles.iconContainer} />
          <Text style={styles.title}>What did this diner have?</Text>
          <Text style={styles.subtitle}>
            Drag user items to profile pic & review!
          </Text>

          <ProfileImageMedallion
            profileImagePath={
              dinersUpdated[currentDinerIndex].profile_pic_image_path
            }
            width={150}
            height={150}
            borderRadius={75}
          />

          <View style={{ zIndex: 100 }}>
            <Text style={styles.dinerInfo}>
              @{dinersUpdated[currentDinerIndex].additional_diner_username}
            </Text>
            {
              <PrimaryButton width={140} onPress={handleAssignedItemsReview}>
                Review
              </PrimaryButton>
            }
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginBottom: 20,
    // padding: 15,
  },
  profilePic: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: Colors.goDutchRed,
    borderWidth: 2,
    resizeMode: "cover",
  },
  assignmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginTop: 60,
  },
  iconContainer: { marginTop: 20 },
  title: {
    fontFamily: "red-hat-regular",
    letterSpacing: 2,
    fontSize: 25,
    color: Colors.goDutchBlue,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: "red-hat-bold",
    letterSpacing: 2,
    fontSize: 16,
    marginBottom: 15,
  },
  dinerInfo: {
    fontFamily: "red-hat-bold",
    letterSpacing: 2,
    textAlign: "center",
    fontSize: 25,
    color: Colors.goDutchBlue,
    marginTop: 5,
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
  modalTitle: {
    fontSize: 25,
    textAlign: "center",
    fontFamily: "red-hat-bold",
  },
  modalSubtitle: {
    fontSize: 15,
    width: 350,
    fontFamily: "red-hat-regular",
    marginBottom: 10,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.goDutchRed,
    marginBottom: 5,
    width: 350,
    height: 40,
    elevation: 5,
  },
  delete: {
    fontFamily: "red-hat-bold",
    color: "white",
  },
  foodInfo: {
    fontFamily: "red-hat-regular",
    fontSize: 20,
    color: "white",
    maxWidth: 200,
  },
});

export default FoodItemDropArea;
