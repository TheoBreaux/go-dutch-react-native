import { View, Image, StyleSheet, Text, TextInput, Button } from "react-native";
import Logo from "./Logo";
import { Picker } from "@react-native-picker/picker";

const NewSplitForm = () => {
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
          <Text>Date:</Text>
          <TextInput style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text>Select a dining experience:</Text>
          <View>
            <Picker style={styles.input} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text>Restaurant/Bar</Text>
          <View style={styles.exitRestaurant}>
            <View style={styles.button}>
              <Button color={"#A40E24"} title="X" />
            </View>

            <TextInput style={styles.restaurantInput} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text>Input unlisted restaurant:</Text>
          <TextInput style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text>Title:</Text>
          <TextInput style={styles.input} />
        </View>

        <View style={styles.continueButton}>
          <Button title="Continue" color={"#A40E24"}></Button>
        </View>
      </View>
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
    fontWeight: "bold",
    color: "#273f81",
    fontSize: 25,
    marginTop: -15,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#e8ebf0",
    borderBottomColor: "#1a202c",
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
    backgroundColor: "#e8ebf0",
    borderBottomColor: "#1a202c",
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "88%",
  },
  button: {
    backgroundColor: "#A40E24",
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
  continueButton: {
    backgroundColor: "#A40E24",
    borderRadius: 5,
    padding: 5,
    margin: 10,
    width: "100%",
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
  },
});

export default NewSplitForm;
