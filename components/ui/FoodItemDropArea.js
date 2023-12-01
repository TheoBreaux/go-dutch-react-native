import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import PrimaryButton from "./PrimaryButton";

const FoodItemDropArea = ({ addedToDiner, setAddedToDiner }) => {
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

  console.log("DINERS:", diners);

  const handleAssignedItemsComplete = () => {
    //update current diner status to assignedItemsComplete True and move on to next dinner in array
    console.log("ON TO THE NEXT!");
  };

  return (
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
            <PrimaryButton width={100} onPress={handleAssignedItemsComplete}>
              Review
            </PrimaryButton>
          </>
        )}
      </View>
    </View>
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
});

export default FoodItemDropArea;
