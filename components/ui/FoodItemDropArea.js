import {
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  Image,
  Easing,
} from "react-native";
import Colors from "../../constants/colors";
import { useState } from "react";
import { useSelector } from "react-redux";
import PrimaryButton from "./PrimaryButton";
import ProfileImageMedallion from "./ProfileImageMedallion";

const FoodItemDropArea = ({ updatedDiners }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [profilePicError, setProfilePicError] = useState(false);

  const handleAssignedItemsReview = () => {
    setShowReviewModal(true);
  };

  const dinersupdated = useSelector((state) => state.diningEvent.diners);

  const hasDiner = updatedDiners.length > 0 && updatedDiners[0];

  // console.log(hasDiner)
  console.log("UPDATED DINERS IN FOOD ITEM DROP:", updatedDiners);
  console.log("UPDATED DINERS IN FOOD ITEM DROP:", updatedDiners);
  console.log("UPDATED DINERS IN FOOD ITEM DROP:", updatedDiners);
  console.log("UPDATED DINERS IN FOOD ITEM DROP:", updatedDiners);
  console.log("DINERS UPDATED:", dinersupdated);

  return (
    <>
      {setShowReviewModal && (
        <Modal
          visible={showReviewModal}
          animationType="slide"
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Review Items</Text>
              {/* need to get the current dinners items array and map over it */}
              {/* {updatedDiners[0].items.map((item) => (
                <Text key={item.id}>{item.name}</Text>
              ))} */}
              <PrimaryButton onPress={() => setShowReviewModal(false)}>
                Close
              </PrimaryButton>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.mainContainer}>
        <View style={styles.assignmentContainer}>
          <View style={styles.iconContainer} />
          <Text style={styles.title}>What did this diner have?</Text>
          <Text style={styles.subtitle}>
            Drag user items to their profile pic & review!
          </Text>

          <ProfileImageMedallion
            profileImagePath={
              profilePicError ? null : updatedDiners[0].profile_pic_image_path
            }
            picPath={null}
            iconSize={200}
            style={styles.profilePic}
          />

          <Text style={styles.dinerInfo}>
            @{updatedDiners[0].additional_diner_username}
          </Text>
          <PrimaryButton width={100} onPress={handleAssignedItemsReview}>
            Review
          </PrimaryButton>
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
    marginTop: 80,
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
    marginBottom: 5,
  },
  dinerInfo: {
    fontFamily: "red-hat-bold",
    letterSpacing: 2,
    fontSize: 25,
    color: Colors.goDutchBlue,
    marginTop: 5,
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
