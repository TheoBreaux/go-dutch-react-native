import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Colors from "../../constants/colors";

const ConfirmableDinnerItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>X</Text>
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
  },
  foodInfo: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
    color: "white",
  },
  button: {
    width: 30,
    height: 50,
    borderWidth: 2,
    backgroundColor: Colors.goDutchRed,
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    fontFamily: "red-hat-bold",
  },
});

export default ConfirmableDinnerItem;
