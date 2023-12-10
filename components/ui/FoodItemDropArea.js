import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import Colors from "../../constants/colors";
import { useState } from "react";
import { useSelector } from "react-redux";
import PrimaryButton from "./PrimaryButton";
import ProfileImageMedallion from "./ProfileImageMedallion";

const FoodItemDropArea = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [profilePicError, setProfilePicError] = useState(false);

  const dinersUpdated = useSelector((state) => state.diningEvent.diners);

  const handleAssignedItemsReview = () => {
    setShowReviewModal(true);
  };

  console.log("FOOD ITEM DROP AREA:", dinersUpdated);

  return (
    <>
      {setShowReviewModal && (
        <Modal
          visible={showReviewModal}
          animationType="slide"
          transparent={true}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Review Items</Text>
                {/* need to get the current dinners items array and map over it */}
                {dinersUpdated[0].items.map((item) => (
                  <View key={item.id} style={styles.itemContainer}>
                    <TouchableOpacity>
                      <Text style={styles.delete}>DELETE</Text>
                    </TouchableOpacity>
                    <Text style={styles.foodInfo}>{item.name}</Text>
                    <Text style={styles.foodInfo}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View style={styles.buttonContainer}>
                  <PrimaryButton width={100}>OK</PrimaryButton>
                  <PrimaryButton width={100}>DELETE</PrimaryButton>
                </View>
                <PrimaryButton onPress={() => setShowReviewModal(false)}>
                  Close
                </PrimaryButton>
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
            profileImagePath={dinersUpdated[0].profile_pic_image_path}
            width={200}
            height={200}
            borderRadius={100}
          />

          <Text style={styles.dinerInfo}>
            @{dinersUpdated[0].additional_diner_username}
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
    padding: 15,
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
  },
  confirmedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "red-hat-bold",
  },
  buttonContainer: { flexDirection: "row" },
});

export default FoodItemDropArea;
