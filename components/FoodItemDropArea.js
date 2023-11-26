import { StyleSheet, Text, View, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { useEffect } from "react";

const FoodItemDropArea = ({ addedToDiner, setAddedToDiner }) => {
  const scaleValue = new Animated.Value(1.5);

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1.0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAddedToDiner(false);
    });
  };

  useEffect(() => {
    if (addedToDiner) {
      startAnimation();
    }
  }, [addedToDiner]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.assignmentContainer}>
        {addedToDiner ? (
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <MaterialCommunityIcons
              name="face-man-shimmer"
              size={150}
              color={Colors.goDutchRed}
            />
          </Animated.View>
        ) : (
          <MaterialCommunityIcons
            name="face-man-profile"
            size={150}
            color={Colors.goDutchBlue}
          />
        )}

        <Text style={styles.dinerInfo}>Theo Breaux</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // marginTop: -30,
    marginBottom: 20,
  },
  assignmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  dinerInfo: {
    marginTop: 20,
    fontFamily: "red-hat-bold",
    fontSize: 25,
    color: Colors.goDutchBlue,
  },
});

export default FoodItemDropArea;
