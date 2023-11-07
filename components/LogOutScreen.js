import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "./ui/PrimaryButton";
import Logo from "./Logo";
import { logOut } from "../store/store";
import { useDispatch } from "react-redux";

const LogOutScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    navigation.navigate("Welcome");
  };

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Text style={styles.text}>Are you sure you want to log out?</Text>
        <PrimaryButton onPress={handleLogOut}>Log Out</PrimaryButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
  },
});

export default LogOutScreen;
