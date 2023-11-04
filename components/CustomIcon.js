import { StyleSheet, Image, View } from "react-native";

const CustomIcon = ({ color, size }) => (
  <View>
    <Image
      source={require("../images/go-dutch-split-button.png")}
      style={{
        width: size,
        height: 30,
        tintColor: color,
      }}
    />
  </View>
);

export default CustomIcon;
