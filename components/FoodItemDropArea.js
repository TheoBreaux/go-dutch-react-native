import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/colors";

const FoodItemDropArea = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.assignmentContainer}>
        <MaterialCommunityIcons
          name="face-man-profile"
          size={150}
          color={Colors.goDutchBlue}
        />
        <Text style={styles.dinerInfo}>Theo Breaux</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: -30,
    marginBottom: 20,
  },
  assignmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  dinerInfo: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
    color: Colors.goDutchBlue,
  },
});

export default FoodItemDropArea;
