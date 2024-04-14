import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from "react-native";
import Colors from "../constants/colors";

const Spinner = ({ children, indicatorSize, fontSize }) => {
  const size = indicatorSize || 200;
  const textSize = fontSize || 30;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={[styles.container, { maxWidth: screenWidth - 40 }]}>
      <ActivityIndicator size={size} color={Colors.goDutchRed} />
      <Text style={[styles.loadingText, { fontSize: textSize }]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: "red-hat-normal",
    letterSpacing: 1,
    color: Colors.goDutchBlue,
    textAlign: "center",
    flexWrap: "nowrap",
  },
});

export default Spinner;
