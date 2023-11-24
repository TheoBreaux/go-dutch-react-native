import { StyleSheet, Text, View } from "react-native";

const DinnerItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.count}>Count: {item.count}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 5,
  },
  name: {
    fontFamily: 'red-hat-bold',
    fontSize: 20,
    color: 'white'
  },
  price: {
    fontSize: 20,
    color: "green",
    fontFamily: 'red-hat-bold',
    color: 'white'
  },
  count: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'red-hat-bold',
  },
});

export default DinnerItem;
