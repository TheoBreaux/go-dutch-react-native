import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";

const ProfileIcon = ({ username, userFullName, onPress }) => {
  const profilePicPath = useSelector((state) => state.userInfo.user.profilePicPath);

  return (
    <TouchableOpacity style={styles.profileInfoContainer} onPress={onPress}>
      <View style={styles.suggestionContainer}>
        <Image source={{ uri: profilePicPath }} style={styles.profilePic} />
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
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
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
