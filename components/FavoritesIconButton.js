import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Colors from "../constants/colors";

const FavoritesIconButton = ({ name, size, color, onPress }) => {
  const [isPressed, setIspressed] = useState(false);
  return (
    <Pressable
      onPress={() => {
        setIspressed(!isPressed);
        onPress();
      }}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons
        name={isPressed ? "heart-circle" : name}
        size={size}
        color={isPressed ? Colors.goDutchRed : color}
      />
    </Pressable>
  );
};

export default FavoritesIconButton;
