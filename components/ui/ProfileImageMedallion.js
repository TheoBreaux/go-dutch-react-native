import { StyleSheet, View, Image } from "react-native";

const ProfileImageMedallion = ({ profileImagePath, picPath }) => {
  return (
    <View>
      <Image
        source={{ uri: profileImagePath || picPath }}
        style={styles.profilePic}
        onError={(error) => console.error("Image load error:", error)}
      />
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
