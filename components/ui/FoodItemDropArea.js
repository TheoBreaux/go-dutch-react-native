import {
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  Image,
  Easing,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PrimaryButton from "./PrimaryButton";

const FoodItemDropArea = ({ addedToDiner, setAddedToDiner, updatedDiners }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const username = useSelector((state) => state.userInfo.user.username);
  const diners = useSelector((state) => state.diningEvent.diners);
  const scaleValue = new Animated.Value(1.5);

  

  // const startAnimation = () => {
  //   Animated.sequence([
  //     Animated.timing(scaleValue, {
  //       toValue: 1.0,
  //       duration: 500,
  //       easing: Easing.ease,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(scaleValue, {
  //       toValue: 1.5,
  //       duration: 500,
  //       easing: Easing.ease,
  //       useNativeDriver: true,
  //     }),
  //   ]).start(() => {
  //     setAddedToDiner(false);
  //   });
  // };

  // useEffect(() => {
  //   if (addedToDiner) {
  //     startAnimation();
  //   }
  // }, [addedToDiner]);

  // console.log("-----FOOD-ITEM-DROP-AREA DINERS:", diners);
  console.log("-----FOOD-ITEM-DROP-AREA:", updatedDiners);
  console.log("-----FOOD-ITEM-DROP-AREA:", updatedDiners);

  const handleAssignedItemsReview = () => {
    setShowReviewModal(true);
  };

  return (
    <>
      {/* {setShowReviewModal && (
        <Modal
          visible={showReviewModal}
          animationType="slide"
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Review Items</Text> */}
              {/* need to get the current dinners items array and map over it */}
              {/* {separatedDinnerItems.map((item) => (
                <Text key={item.id}>{item.name}</Text>
              ))} */}
              {/* <PrimaryButton>Close</PrimaryButton>
            </View>
          </View>
        </Modal>
      )} */}

      <View style={styles.mainContainer}>
        <View style={styles.assignmentContainer}>
          {addedToDiner ? (
            <View style={{ transform: [{ scale: scaleValue }] }}>
              <MaterialCommunityIcons
                name="face-man-shimmer"
                size={150}
                color={Colors.goDutchRed}
              />
            </View>
          ) : (
            <>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="face-man-profile"
                  size={150}
                  color={Colors.goDutchBlue}
                />
              </View>
              <Text style={styles.dinerInfo}>{username}</Text>
              <PrimaryButton width={100} onPress={handleAssignedItemsReview}>
                Review
              </PrimaryButton>
            </>
          )}
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
  assignmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  iconContainer: { marginTop: 50 },
  dinerInfo: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
    color: Colors.goDutchBlue,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 50,
    borderRadius: 10,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default FoodItemDropArea;
