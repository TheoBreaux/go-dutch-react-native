import { View, Text, StyleSheet } from "react-native";

const LogInSignUp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.dummyText}>LOG-IN SIGN-UP</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  dummyText: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "blue",
  },
});

export default LogInSignUp;
