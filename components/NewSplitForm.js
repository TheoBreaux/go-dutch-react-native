import { View, Image, StyleSheet, Text, TextInput, Button } from "react-native";
import Logo from "./Logo";
import { Picker } from "@react-native-picker/picker";
import Footer from "./Footer";
import Colors from "../constants/colors";
import SecondaryButton from "./ui/SecondaryButton";

const NewSplitForm = () => {
  const changeRestaurantHandler = () => {
    console.log("close");
  };

  const continueHandler = () => {
    console.log("coontinue");
  };

  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Image
          style={styles.friendsImage}
          source={require("../images/friends.png")}
        />

        <Text style={styles.title}>SELECT A DINING EXPERIENCE</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date:</Text>
          <TextInput style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select a dining experience:</Text>
          <View>
            <Picker style={styles.input} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Restaurant/Bar:</Text>
          <View style={styles.exitRestaurant}>
            <View style={styles.button}>
              <Button
                color={Colors.goDutchRed}
                title="X"
                onPress={changeRestaurantHandler}
              />
            </View>

            <TextInput style={styles.restaurantInput} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Input unlisted restaurant:</Text>
          <TextInput style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title:</Text>
          <TextInput style={styles.input} />
        </View>

        <View>
          <SecondaryButton onPress={continueHandler}>Continue</SecondaryButton>
        </View>
      </View>
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
  },
  friendsImage: {
    marginTop: -30,
    width: 400,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchBlue,
    fontSize: 25,
    marginTop: -15,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontFamily: "red-hat-regular",
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "100%",
  },
  exitRestaurant: {
    flexDirection: "row",
    width: "100%",
  },
  restaurantInput: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "88%",
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    borderRadius: 5,
    padding: 0,
    margin: 0,
    marginRight: "2%",
    width: "10%",
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NewSplitForm;
