import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";
import { useState } from "react";

const DiningEventHistoryCard = ({ item }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [diners, setDiners] = useState([]);
  const historyCardMessage = seeMore ? "Hide ↑" : "↓ See More";

  const dateObj = new Date(item.dining_date);

  const eventId = item.event_id;

  // Extract the year, month, and day from the Date object
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const day = dateObj.getDate();

  // fetch additional diners from a specific dining eventId
  const getAdditionalDiners = async () => {
    try {
      const response = await fetch(
        `https://cd04-2603-8000-c0f0-a570-18c1-a9e4-ab0e-834d.ngrok-free.app/additionaldiners/${eventId}`
      );
      const data = await response.json();
      setDiners(data);
    } catch (error) {
      throw error;
    }
  };

  const showEventDetails = () => {
    setSeeMore(!seeMore);
    getAdditionalDiners();
  };

  return (
    <TouchableOpacity style={styles.cardContainer}>
      <View>
        <Text>{item.title}</Text>
        <Image
          source={require("../images/profile-icon.jpg")}
          style={styles.image}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.date}</Text>
        <Text style={styles.text}>{item.restaurant_bar}</Text>
        <Text style={styles.text}>{item.primary_diner_username}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderColor: Colors.goDutchRed,
    borderWidth: 1,
    padding: 10,
    // margin: 8,
    borderRadius: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 3,
    elevation: 5,
    // alignItems: "flex-start", // Adjusted line
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#000000",
  },
});

export default DiningEventHistoryCard;
