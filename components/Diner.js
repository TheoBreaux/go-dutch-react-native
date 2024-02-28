import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import Colors from "../constants/colors";
import { useDispatch } from "react-redux";
import { removeDiner } from "../store/store";
import ProfileImageMedallion from "./ProfileImageMedallion";


const Diner = ({ additionalDinerUsername, diner, selectedUser }) => {

  const [profilePicPath, setProfilePicPath] = useState("");

  useEffect(() => {
  setProfilePicPath(selectedUser.profilePicPath)
})
 
  const dispatch = useDispatch();

  console.log(selectedUser)

  return (
    <View style={styles.container}>
      <ProfileImageMedallion
        profileImagePath={profilePicPath}
        width={50}
        height={50}
        borderRadius={25}
      />
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
  text: {
    color: Colors.goDutchBlue,
    fontSize: 18,
    fontFamily: "red-hat-regular",
    padding: 5,
  },
});
export default Diner;
