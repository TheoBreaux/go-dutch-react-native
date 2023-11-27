import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import ProfileImageMedallion from "./ProfileImageMedallion";

const ProfileIcon = ({ username, userFullName, onPress }) => {
  return (
    <TouchableOpacity style={styles.profileInfoContainer} onPress={onPress}>
      <View style={styles.suggestionContainer}>
        <ProfileImageMedallion />
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
    marginBottom: 5,
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
  },
  textContainer: {
    marginLeft: 5,
  },
  profileInfoText: {
    fontFamily: "red-hat-bold",
  },
});

export default ProfileIcon;
