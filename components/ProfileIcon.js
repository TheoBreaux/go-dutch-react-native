import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import ProfileImageMedallion from "./ProfileImageMedallion";

const ProfileIcon = ({
  username,
  userFullName,
  onPress,
  profileImagePath,
  item,
}) => {
  return (
    <TouchableOpacity
      style={styles.profileInfoContainer}
      onPress={() => onPress(item.username)}
    >
      <View style={styles.suggestionContainer}>
        <ProfileImageMedallion profileImagePath={profileImagePath} />
        <View style={styles.textContainer}>
          <Text style={styles.profileInfoText}>{userFullName}</Text>
          <Text style={styles.profileInfoText}>@{username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileInfoContainer: {
    // marginBottom: 5,
  },
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
  textContainer: {
    marginLeft: 5,
  },
  profileInfoText: {
    fontFamily: "red-hat-bold",
  },
});

export default ProfileIcon;
