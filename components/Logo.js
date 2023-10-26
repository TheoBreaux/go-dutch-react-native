import { Image, StyleSheet, View, Text } from "react-native";

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../images/go-dutch-logo.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 4 / 1,
    backgroundColor: "transparent",
    marginTop: 40,
  },
  logo: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: "center",
    marginHorizontal: 20,
  },
});

export default Logo;
