import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/colors";

const DinnerItem = ({ item, onLongPress, isActive, backgroundColor }) => {
  return (
    <View
      style={[
        styles.itemContainer,
        { backgroundColor },
        isActive && { borderWidth: 2, borderColor: "yellow" },
      ]}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.goDutchRed,
    margin: 5,
  },
  name: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
    color: "white",
  },
  price: {
    fontSize: 20,
    color: "green",
    fontFamily: "red-hat-bold",
    color: "white",
  },
});

export default DinnerItem;
