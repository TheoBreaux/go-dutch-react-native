import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import Colors from "../constants/colors";

const Spinner = ({ children, indicatorSize }) => {
  const size = indicatorSize || 200;
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.goDutchRed} />
      <Text style={styles.loadingText}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 30,
    fontFamily: "red-hat-bold",
    color: Colors.goDutchBlue,
    textAlign: "center",
  },
});

export default Spinner;
