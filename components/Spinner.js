import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import Colors from "../constants/colors";

const Spinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={200} color={Colors.goDutchRed} />
      <Text style={styles.loadingText}>Submitting...🧾</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 30,
    fontFamily: "red-hat-bold",
    color: Colors.goDutchBlue,
    textAlign: "center",
  },
});

export default Spinner;
