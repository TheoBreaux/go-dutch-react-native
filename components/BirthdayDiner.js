import { StyleSheet, Text, View, Switch } from "react-native";
import Colors from "../constants/colors";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBirthdayStatus } from "../store/store";

const BirthdayDiner = ({ additionalDinerUsername }) => {
  const [isChecked, setChecked] = useState(false);

  const dispatch = useDispatch();

  const toggleSwitch = () => {
    setChecked((previousState) => !previousState);

    const username = additionalDinerUsername;
    const celebratingBirthday = !isChecked;

    dispatch(updateBirthdayStatus({ username, celebratingBirthday }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>@{additionalDinerUsername}</Text>

      <View style={styles.switch}>
        <Text>{isChecked ? "Yes" : "No"}</Text>
        <Switch
          trackColor={{ false: "#767577", true: Colors.goDutchBlue }}
          thumbColor={isChecked ? Colors.goDutchRed : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isChecked}
        />
      </View>
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
    width: "90%",
  },
  text: {
    color: Colors.goDutchBlue,
    fontSize: 18,
    fontFamily: "red-hat-normal",
    padding: 5,
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default BirthdayDiner;
