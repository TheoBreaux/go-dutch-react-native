import { StyleSheet, Text, View, Button, Image, FlatList } from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import Logo from "../components/Logo";
import { months } from "../data/data";

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

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text>@{item.additional_diner_username}</Text>
      <Text>{item.diner_meal_cost}</Text>
    </View>
  );

  console.log("CLOSE OUT", diningEvent);
  console.log(diners);

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
              <Text style={styles.title}>{eventTitle}</Text>
              <View style={styles.button}>
                <Button
                  title="X"
                  color={Colors.goDutchRed}
                  // onPress={handleReturnToHistory}
                />
              </View>
            </View>
          </View>

          <Image source={{ uri: receiptImagePath }} style={styles.image} />

          <View>
            <Text style={styles.text}>{formattedEventDate}</Text>
            <Text style={styles.text}>{eventLocation}</Text>
            <Text style={styles.text}>
              <Text style={styles.primaryDiner}>Primary Diner: </Text>@
              {primaryDiner}
            </Text>
          </View>
          <Text style={styles.additionalDinerText}>Diners</Text>
          <FlatList
            data={diners}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
          />
          <Text>Total Meal Cost: ${totalMealCost}</Text>
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
    margin: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
  additionalDinerText: {
    fontSize: 20,
    fontFamily: "red-hat-bold",
    letterSpacing: 3,
    textAlign: "center",
    color: Colors.goDutchRed,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    marginVertical: 5,
  },
  title: {
    fontSize: 30,
    fontFamily: "red-hat-bold",
    letterSpacing: 3,
    textAlign: "center",
    color: Colors.goDutchRed,
    marginBottom: -5,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 3,
    fontFamily: "red-hat-regular",
  },
  button: {
    backgroundColor: Colors.goDutchRed,
    width: 30,
  },
  primaryDiner: {
    fontFamily: "red-hat-bold",
  },
  flatListContainer: {
    flexGrow: 1,
    // justifyContent: 'space-between',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 360, // Make sure each item takes up 100% of the width
    padding: 10, // Add padding for spacing
    marginBottom: 2,
    backgroundColor: "#fff", // Set a background color if needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default CheckCloseOutDetails;
