import { StyleSheet, View, Image } from "react-native";
import { useSelector } from "react-redux";

const ProfileImageMedallion = () => {
  const profilePicPath = useSelector(
    (state) => state.userInfo.user.profilePicPath
  );
  return (
    <View>
      <Image source={{ uri: profilePicPath }} style={styles.profilePic} />
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
