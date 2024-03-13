import { StyleSheet, Text, View } from "react-native";
import Logo from "../components/Logo";

const FeaturedRestaurantsScreen = () => {
  return (
    <>
      <Logo />
      <View style={styles.container}>
        <Text>FeaturedRestaurantsScreen</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default FeaturedRestaurantsScreen;

// POSSIBLY CARDS WITH INFO FOR ALL PAYING ADVERTISERS WITH LINKS IN A FLATLIST
