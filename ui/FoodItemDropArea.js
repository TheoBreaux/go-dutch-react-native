import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import Colors from "../constants/colors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import ProfileImageMedallion from "../components/ProfileImageMedallion";
import {
  returnRemovedDinerItem,
  updateDinerItems,
  setCurrentDinerId,
  setBirthdayDiners,
  addDiner,
  updateSubtotal,
} from "../store/store";
import CustomModal from "../components/CustomModal";
import { useNavigation } from "@react-navigation/native";

const FoodItemDropArea = () => {
  const dinersUpdated = useSelector((state) => state.diningEvent.diners);
  const separatedDinnerItems = useSelector(
    (state) => state.diningEvent.allReceiptItemsCopy
  );

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [dinerReviewedItems, setDinerReviewedItems] = useState([]);
  const [currentDinerIndex, setCurrentDinerIndex] = useState(0);
  const [notSure, setNotSure] = useState(false);

  const currDinerItems = dinersUpdated[currentDinerIndex]?.items || [];
  const eventId = useSelector((state) => state.diningEvent.event.eventId);
  const currentDiner = dinersUpdated[currentDinerIndex].additionalDinerUsername;
  const evenlySplitItems = useSelector(
    (state) => state.diningEvent.evenlySplitItems
  );

  let totalDinerMealCost = 0;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(setCurrentDinerId(dinersUpdated[0].id));
  }, []);

  useEffect(() => {
    // Force re-render when profileImageKey changes
  }, [dinersUpdated[currentDinerIndex].profileImageKey]);

  useEffect(() => {
    //check if items are in the evenlySplitDiners array to creat a shared diner
    if (
      evenlySplitItems.length >= 1 &&
      dinersUpdated.every(
        (diner) => diner.additionalDinerUsername !== "shareditems"
      )
    ) {
      dispatch(
        addDiner({
          eventId: eventId,
          id: Date.now(),
          additionalDinerUsername: "shareditems",
          celebratingBirthday: false,
          primaryDiner: false,
          dinerMealCost: 0,
          items: [],
          profileImageKey: "default-profile-icon.jpg",
        })
      );
    }
  }, [dispatch, dinersUpdated, evenlySplitItems]);

  const handleAssignedItemsReview = () => {
    setDinerReviewedItems(currDinerItems);
    setShowReviewModal(true);
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
    const subtotal = dinersUpdated.reduce((total, currentDiner) => {
      currentDiner.items.forEach((item) => {
        total += item.price;
      });
      return total;
    }, 0);

    if (separatedDinnerItems.length === 0) {
      //find out if it is a birthday for a diner, map over diners arrray and look for birthday property === true, this was.map
      dinersUpdated.forEach((diner) => {
        if (diner.celebratingBirthday) {
          // assign birthday diners to array
          dispatch(setBirthdayDiners(diner));
        }
      });

      //update subtotal in redux store
      dispatch(updateSubtotal(subtotal));

      //we will navigate to the tax screens and tip screens here
      navigation.navigate("ConfirmFeeTotalsScreen");
    } else {
      setShowReviewModal(false);
      setShowConfirmationModal(true);

      //update the UI to the next diner in the diners array by increment currentDinerIndex
      setCurrentDinerIndex((prevIndex) => prevIndex + 1);

      //reset dinerReviewedItems for next diner to use
      setDinerReviewedItems([]);
    }

    //calculate the total bill for the diner
    currDinerItems.forEach((item) => {
      totalDinerMealCost += item.price;
    });
  };

  const handleNextDiner = () => {
    setNotSure(false);
    const currentDiner = dinersUpdated[currentDinerIndex];
    const currentDinerId = currentDiner.id;
    //update currentDinerId
    dispatch(setCurrentDinerId(currentDinerId));
    setShowConfirmationModal(false);
  };

  const handleNoConfirmation = () => {
    setNotSure(true);
    setShowConfirmationModal(false);
    setCurrentDinerIndex((prevIndex) => prevIndex - 1); // Move back to the previous diner
    setDinerReviewedItems([]); // Reset reviewed items
  };

  // console.log("DINERS UPDATED:", dinersUpdated);
  // console.log("CURRENT DINER:", currentDiner);
  // console.log("CURRENT DINER INDEX:", currentDinerIndex);
  // console.log(
  //   "CURRENT DINER PROFILE IMAGE KEY:",
  //   dinersUpdated[currentDinerIndex].profileImageKey
  // );
  // console.log("DINER REVIEWED ITEMS:", dinerReviewedItems);

  return (
    <>
      {showReviewModal && (
        <Modal
          visible={showReviewModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.overlay}>
            <View>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Review items for</Text>
                {dinersUpdated[currentDinerIndex].profileImageKey === null ? (
                  <Image
                    source={require("../assets/default-profile-icon.jpg")}
                    style={styles.profilePic}
                  />
                ) : (
                  <ProfileImageMedallion
                    profileImageKey={
                      dinersUpdated[currentDinerIndex].profileImageKey
                    }
                    width={100}
                    height={100}
                    borderRadius={50}
                  />
                )}
                <Text style={styles.currentDinerText}>@{currentDiner}</Text>
                <Text style={styles.modalSubtitle}>
                  Press RETURN to return to items, DELETE to remove an item from
                  current diner's bill or CONFIRM to confirm items below and
                  move to next diner.
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
                    width={100}
                    onPress={() => {
                      setShowReviewModal(false);
                      setShowConfirmationModal(false);
                    }}
                  >
                    Return
                  </PrimaryButton>
                  <PrimaryButton width={100} onPress={confirmCurrentDiner}>
                    Confirm
                  </PrimaryButton>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showConfirmationModal && (
        <CustomModal
          visible={showConfirmationModal}
          animationType="slide"
          transparent={true}
          modalText="Are you sure?"
          buttonText1="Yes"
          onPress1={handleNextDiner}
          buttonText2="No"
          onPress2={handleNoConfirmation}
          modalHeight={200}
          buttonWidth={100}
        />
      )}

      <View style={styles.mainContainer}>
        <View style={styles.assignmentContainer}>
          <View style={styles.iconContainer} />
          <Text style={styles.title}>What did this diner have?</Text>
          <Text style={styles.subtitle}>
            Drag user items to profile pic & review!
          </Text>

          {dinersUpdated[currentDinerIndex].profileImageKey === null ? (
            <Image
              key={dinersUpdated[currentDinerIndex].id}
              source={require("../assets/default-profile-icon.jpg")}
              style={styles.profilePic}
            />
          ) : (
            <ProfileImageMedallion
              key={dinersUpdated[currentDinerIndex].id}
              profileImageKey={dinersUpdated[currentDinerIndex].profileImageKey}
              width={150}
              height={150}
              borderRadius={75}
            />
          )}

          <View style={{ zIndex: 100, alignItems: "center" }}>
            <Text style={styles.dinerUsername}>@{currentDiner}</Text>

            {notSure && (
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <Image source={require("../assets/down-arrow.png")} />
                <Image source={require("../assets/down-arrow.png")} />
                <Image source={require("../assets/down-arrow.png")} />
              </View>
            )}

            {
              <PrimaryButton
                width={140}
                height={50}
                onPress={handleAssignedItemsReview}
              >
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
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "black",
    borderWidth: 2,
    resizeMode: "cover",
  },
  assignmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginTop: 65,
    marginBottom: 50,
  },
  iconContainer: { marginTop: 40 },
  title: {
    fontFamily: "red-hat-bold",
    letterSpacing: 2,
    fontSize: 25,
    color: Colors.goDutchBlue,
  },
  subtitle: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 15,
  },
  dinerUsername: {
    fontFamily: "red-hat-bold",
    letterSpacing: 2,
    textAlign: "center",
    fontSize: 25,
    color: Colors.goDutchBlue,
    marginTop: 5,
    marginBottom: 15,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
  currentDinerText: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
  },
  modalSubtitle: {
    fontSize: 15,
    width: 350,
    fontFamily: "red-hat-normal",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontFamily: "red-hat-normal",
    fontSize: 20,
    color: "white",
    maxWidth: 200,
  },
});

export default FoodItemDropArea;
