import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/colors";

const Profile = ({ username, userFullName }) => {
  const onPress = () => {
    console.log("IM GETTIN PRESSED OVER HERE!");
  };

  return (
    <TouchableOpacity style={styles.profileInfoContainer} onPress={onPress}>
      <View>
        <MaterialCommunityIcons
          name="face-man-profile"
          size={40}
          color={Colors.goDutchBlue}
        />
      </View>
      <View style={styles.suggestionContainer}>
        <View>
          <Text style={styles.profileInfoText}>{userFullName}</Text>
          <Text style={styles.profileInfoText}>@{username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  suggestionContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "88%",
    elevation: 20,
    backgroundColor: "white",
    // shadowColor: '#000', // Shadow properties for iOS
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.2,
    // shadowRadius: 1,
  },

  profileInfoText: {
    fontFamily: "red-hat-bold",
  },
});

export default Profile;
