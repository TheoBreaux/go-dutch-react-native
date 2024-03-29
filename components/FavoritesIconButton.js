import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";

const FavoritesIconButton = ({ size, onPress, isFavorited }) => {
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons
        name={isFavorited ? "heart-circle" : "heart-outline"}
        size={size}
        color={isFavorited ? Colors.goDutchRed : Colors.goDutchBlue}
      />
    </Pressable>
  );
};

export default FavoritesIconButton;
