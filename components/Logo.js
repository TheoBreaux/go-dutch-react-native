import React from "react";
import { Image, StyleSheet, View } from "react-native";
import GoDutchLogo from "../assets/go-dutch-logo.png";

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={GoDutchLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    aspectRatio: 1,
    display: "flex",
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
  },
  logo: {
    width: "100%",
    aspectRatio: 1,
  },
});

export default Logo;
