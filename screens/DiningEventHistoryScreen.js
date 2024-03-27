import { View, StyleSheet, FlatList, Text } from "react-native";
import DiningEventHistoryCard from "../components/DiningEventHistoryCard";
import Logo from "../components/Logo";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import PrimaryButton from "../components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const DiningEventHistoryScreen = () => {
  const [diningEvents, setDiningEvents] = useState([]);
  const navigation = useNavigation();
  const username = useSelector((state) => state.userInfo.user.username);

  //fetch all dining events from the database
  const getData = async () => {
    try {
      const response = await fetch(
        `https://24b9-2603-8000-c0f0-a570-7971-f873-39b3-59e7.ngrok-free.app/diningevents/${username}`
      );
      const data = await response.json();
      setDiningEvents(data.eventData);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderItem = ({ item }) => (
    <DiningEventHistoryCard key={item.eventId} item={item} />
  );

  const handleNavigation = () => {
    navigation.navigate("Restaurants");
  };

  // sort by date
  const sortedDiningEvents = diningEvents?.sort(
    (a, b) => new Date(b.diningDate) - new Date(a.diningDate)
  );

  return (
    <>
      <Logo />
      <View style={styles.container}>
        {diningEvents.length > 0 && (
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
              }}
            >
              Check out our featured restaurants near you!
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
    fontSize: 20,
    marginBottom: 5,
  },
  noHistoryContainer: {
    width: "100%",
    marginTop: 250,
    alignItems: "center",
  },
  noHistoryText: {
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    textAlign: "center",
    fontSize: 35,
    width: "auto",
  },
});

export default DiningEventHistoryScreen;
