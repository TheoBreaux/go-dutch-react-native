import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import Logo from "./Logo";
import { StyleSheet, Text, View } from "react-native";
import PrimaryDiner from "./PrimaryDiner";

const AddDiners = () => {
  const diningEvent = useSelector((state) => state.diningEvent.event);

  return (
    <>
      <Logo />
      <View>
        <View>
          <Text style={styles.eventTitle}>{diningEvent.eventTitle}</Text>
        </View>
        <Text style={styles.title}>DINERS</Text>
        <PrimaryDiner />
      </View>
      <Text>THIS IS THE ADD DINERS COMPONENT</Text>
    </>
  );
};

const styles = StyleSheet.create({
  eventTitle: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 40,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "red-hat-regular",
    color: Colors.goDutchBlue,
  },
});

export default AddDiners;
