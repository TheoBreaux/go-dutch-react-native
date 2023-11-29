import { View, StyleSheet } from "react-native";
import DiningEventHistoryCard from "./DiningEventHistoryCard";
import Logo from "./Logo";

const DiningEventHistory = () => {
  return (
    <>
      <Logo />
      <View style={styles.container}>
        <DiningEventHistoryCard />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default DiningEventHistory;
