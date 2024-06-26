import { Image, StyleSheet, View } from "react-native";

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/go-dutch-logo.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 4 / 1,
    backgroundColor: "transparent",
    alignContent: "center",
  },
  logo: {
    flex: 1,
    width: "auto",
    height: "auto",
    resizeMode: "center",
    marginHorizontal: 20,
    marginBottom: -20,
  },
});

export default Logo;
