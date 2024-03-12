import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import Colors from "../constants/colors";

const Spinner = ({ children, indicatorSize, fontSize }) => {
  const size = indicatorSize || 200;
  const textSize = fontSize || 30;
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.goDutchRed} />
      <Text style={[styles.loadingText, { fontSize: textSize }]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchBlue,
    textAlign: "center",
  },
});

export default Spinner;
