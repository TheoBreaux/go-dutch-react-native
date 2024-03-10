import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import ProfileImageMedallion from "./ProfileImageMedallion";

const ProfileIcon = ({
  username,
  userFullName,
  onPress,
  profileImageKey,
  item,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.username)}>
      <View style={styles.suggestionContainer}>
        {profileImageKey ? (
          <ProfileImageMedallion profileImageKey={profileImageKey} />
        ) : (
          <Image
            source={require("../assets/default-profile-icon.jpg")}
            style={styles.profilePic}
          />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.profileInfoText}>{userFullName}</Text>
          <Text style={styles.profileInfoText}>@{username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    justifyContent: "flex-start",
    width: "100%",
    elevation: 5,
    backgroundColor: "white",
    marginBottom: 5,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    resizeMode: "cover",
  },
  textContainer: {
    marginLeft: 5,
  },
  profileInfoText: {
    fontFamily: "red-hat-bold",
  },
});

export default ProfileIcon;
