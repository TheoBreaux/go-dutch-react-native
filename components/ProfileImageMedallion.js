import { StyleSheet, View, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { useState } from "react";

const ProfileImageMedallion = ({
  profileImagePath,
  iconSize,
  width,
  height,
  borderRadius,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <View>
      <Image
        source={{ uri: profileImagePath }}
        style={[
          styles.profilePic,
          {
            width: width || 40,
            height: height || 40,
            borderRadius: borderRadius || 20,
          },
        ]}

        // onError={handleImageError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    resizeMode: "cover",
  },
});

export default ProfileImageMedallion;
