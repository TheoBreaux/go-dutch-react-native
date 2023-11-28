import { StyleSheet, View, Image } from "react-native";

const ProfileImageMedallion = ({ profileImagePath }) => {
  return (
    <View>
      <Image source={{ uri: profileImagePath }} style={styles.profilePic} />
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
