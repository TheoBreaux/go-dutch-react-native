import { View, Image, StyleSheet, Text, TextInput, Button } from "react-native";
import Logo from "./Logo";

const NewSplitForm = () => {
  return (
    <View style={styles.container}>
      <Logo />
      <Image
        style={styles.friendsImage}
        applysource={require("../images/friends.png")}
      />
      <Text>SELECT A DINING EXPERIENCE</Text>
      <TextInput />

      <Text>Select a dining experience</Text>


      <Text>Restaurant/Bar</Text>
      <View>
        <Button></Button>
      </View>

      <Text>Input unlisted restaurant:</Text>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  friendsImage: {},
});

export default NewSplitForm;
