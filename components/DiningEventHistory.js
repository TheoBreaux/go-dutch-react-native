import { View, StyleSheet, FlatList, Text } from "react-native";
import DiningEventHistoryCard from "./DiningEventHistoryCard";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import PrimaryButton from "./ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const DiningEventHistory = () => {
  const [diningEvents, setDiningEvents] = useState([]);
  const navigation = useNavigation();
  const username = useSelector((state) => state.userInfo.user.username);

  //fetch all dining events from the database
  const getData = async () => {
    try {
      const response = await fetch(
        `https://cd04-2603-8000-c0f0-a570-18c1-a9e4-ab0e-834d.ngrok-free.app/diningevents/${username}`
      );
      const data = await response.json();
      setDiningEvents(data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderItem = ({ item }) => (
    <View>
      <DiningEventHistoryCard key={item.event_id} item={item} />
    </View>
  );

  const handleNavigation = () => {
    navigation.navigate("Restaurants");
  };

  //sort by date
  const sortedDiningEvents = diningEvents?.sort(
    (a, b) => new Date(b.dining_date) - new Date(a.dining_date)
  );

  return (
    <>
      <Logo />
      <View style={styles.container}>
        {!diningEvents.length < 0 && (
          <Text style={styles.title}>Tap tile to see details...</Text>
        )}

        {!diningEvents.length > 0 && (
          <View style={styles.noHistoryContainer}>
            <Text style={styles.noHistoryText}>No dining history yet!</Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "red-hat-bold",
                fontSize: 15,
              }}>
              Check out our featured restaurants in your location!
            </Text>
            <PrimaryButton width={150} onPress={handleNavigation}>
              <Ionicons name="restaurant" size={25} color="white" />
            </PrimaryButton>
          </View>
        )}

        <FlatList data={sortedDiningEvents} renderItem={renderItem} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginTop: -10,
  },
  title: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    letterSpacing: 5,
    fontSize: 20,
    marginBottom: 5,
  },
  noHistoryContainer: {
    marginTop: 250,
    alignItems: "center",
  },
  noHistoryText: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    textAlign: "center",
    fontSize: 40,
  },
});

export default DiningEventHistory;
