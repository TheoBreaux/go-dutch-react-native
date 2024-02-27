import { Image, View } from "react-native";

const CustomIcon = ({ color, size }) => (
  <View>
    <Image
      source={require("../assets/go-dutch-split-button.png")}
      style={{
        width: size,
        height: size,
        tintColor: color,
        resizeMode: "contain",
      }}
    />
  </View>
);

export default CustomIcon;
