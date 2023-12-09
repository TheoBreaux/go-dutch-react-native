import { StyleSheet, View, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { useState } from "react";

const ProfileImageMedallion = ({ profileImagePath, picPath, iconSize }) => {

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <View>
      {imageError ? (
        <MaterialCommunityIcons
          name="face-man-profile"
          size={iconSize || 40}
          color={Colors.goDutchBlue}
        />
      ) : (
        <Image
          source={{ uri: profileImagePath || picPath }}
          style={styles.profilePic}
          onError={handleImageError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
});

export default ProfileImageMedallion;
