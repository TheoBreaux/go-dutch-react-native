import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import PrimaryButton from "./PrimaryButton";
import Colors from "../constants/colors";
import { useDispatch } from "react-redux";
import { removeDiner } from "../store/store";
import ProfileImageMedallion from "./ProfileImageMedallion";

const Diner = ({ additionalDinerUsername, diner, profileImageKey }) => {
  //check to see if users current profile pic path is null
  const usingDefaultProfilePhoto = diner.profileImageKey === null;

  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {usingDefaultProfilePhoto ? (
        <Image
          source={require("../assets/default-profile-icon.jpg")}
          style={styles.profilePic}
        />
      ) : (
        <ProfileImageMedallion
          profileImageKey={profileImageKey}
          width={50}
          height={50}
          borderRadius={25}
        />
      )}

      <Text style={styles.text}>{additionalDinerUsername}</Text>
      <PrimaryButton width={40} onPress={() => dispatch(removeDiner(diner))}>
        X
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    borderColor: Colors.goDutchRed,
    borderWidth: 1,
    marginTop: 5,
    height: 75,
    paddingLeft: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "black",
    resizeMode: "cover",
  },
  text: {
    color: Colors.goDutchBlue,
    fontSize: 18,
    fontFamily: "red-hat-normal",
    padding: 5,
  },
});
export default Diner;
