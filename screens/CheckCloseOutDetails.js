import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import Logo from "../components/Logo";
import { months } from "../data/data";
import { useNavigation } from "@react-navigation/native";

const CheckCloseOutDetails = () => {
  const diningEvent = useSelector((state) => state.diningEvent);
  const eventTitle = diningEvent.event.eventTitle;
  const diners = diningEvent.diners;
  const eventLocation =
    diningEvent.event.selectedRestaurant ||
    diningEvent.event.enteredSelectedRestaurant;
  const primaryDiner = diningEvent.diners[0].additional_diner_username;
  const totalMealCost = diningEvent.event.totalMealCost;
  const eventDate = diningEvent.event.eventDate;
  const receiptImagePath = diningEvent.event.receipt_image_path;
  //convert string date to month, day, year format
  const parts = eventDate.split("-");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  const formattedEventDate = `${months[month - 1]} ${day}, ${year}`;

  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row}>
      <Text>@{item.additional_diner_username}</Text>
      <Text>${item.diner_meal_cost}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Logo />
      <View style={styles.cardContainer}>
        <View style={styles.contentContainer}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 360,
                marginBottom: 10,
              }}
            >
              <Text style={styles.eventTitle}>{eventTitle}</Text>
              <View style={styles.button}>
                <Button
                  title="X"
                  color={Colors.goDutchRed}
                  onPress={() =>
                    navigation.navigate("Main", { screen: "Home" })
                  }
                />
              </View>
            </View>
          </View>

          <View
            style={{
              borderWidth: 5,
              borderColor: Colors.goDutchBlue,
              padding: 5,
            }}
          >
            <Image source={{ uri: receiptImagePath }} style={styles.image} />
          </View>

          <View>
            <Text style={styles.text}>{formattedEventDate}</Text>
            <Text style={[styles.text, styles.bold]}>{eventLocation}</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Primary Diner: </Text>@{primaryDiner}
            </Text>
          </View>

          
          <View style={styles.additionalDinerContainer}>
            <Text style={styles.additionalDinerText}>Diners</Text>
          </View>

          <FlatList
            data={diners}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
          />
          <Text style={styles.totalMealCostText}>
            Total Meal Cost: ${totalMealCost}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 16,
    marginTop: -5,
    margin: 5,
    borderRadius: 8,
    shadowColor: Colors.goDutchBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  eventTitle: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 30,
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    width: 30,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "red-hat-regular",
  },
  bold: {
    fontFamily: "red-hat-bold",
  },
  additionalDinerContainer: {
    width: 360,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginBottom: 5,
  },
  additionalDinerText: {
    fontSize: 20,
    fontFamily: "red-hat-bold",
    textAlign: "center",
    color: Colors.goDutchRed,
  },
  flatListContainer: {
    flexGrow: 1,
    // justifyContent: 'space-between',
  },
  totalMealCostText: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 360,
    padding: 8,
    marginBottom: 3,
    backgroundColor: "#fff",
    shadowColor: Colors.goDutchBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default CheckCloseOutDetails;
