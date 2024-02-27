import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";

const ConfirmableDinnerItem = ({ item, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>DELETE</Text>
      </TouchableOpacity>
      <Text style={styles.foodInfo}>{item.name}</Text>
      <Text style={styles.foodInfo}>${item.price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.goDutchRed,
    marginBottom: 5,
    width: "100%",
    height: 60,
    elevation: 5,
  },
  delete: {
    fontFamily: "red-hat-bold",
    color: "white",
  },
  foodInfo: {
    fontFamily: "red-hat-bold",
    fontSize: 18,
    color: "white",
    maxWidth: "auto",
  },
});

export default ConfirmableDinnerItem;
