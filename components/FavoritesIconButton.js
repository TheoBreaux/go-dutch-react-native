import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Colors from "../constants/colors";

const FavoritesIconButton = ({ name, size, color, onPress, isFavorited }) => {
  const handlePress = () => {
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
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
