import { View, StyleSheet, FlatList } from "react-native";
import DiningEventHistoryCard from "./DiningEventHistoryCard";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const DiningEventHistory = () => {
  const [diningEvents, setDiningEvents] = useState([]);
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
  )
    

  //sort by date
  const sortedDiningEvents = diningEvents?.sort(
    (a, b) => new Date(b.dining_date) - new Date(a.dining_date)
  );

  console.log("DATA SORTED:", sortedDiningEvents);

  return (
    <>
      <Logo />
      <View style={styles.container}>
       <FlatList
          contentContainerStyle={styles.container}
          data={sortedDiningEvents}
          renderItem={renderItem}
        />
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
