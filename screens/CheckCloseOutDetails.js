import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import Logo from "../components/Logo";

const CheckCloseOutDetails = () => {
  const diningEvent = useSelector((state) => state.diningEvent);
  const eventDate = diningEvent.event.eventDate;
  const eventTitle = diningEvent.event.eventTitle;
  const eventLocation =
    diningEvent.event.selectedRestaurant ||
    diningEvent.event.enteredSelectedRestaurant;
  const primaryDiner = diningEvent.diners[0].additional_diner_username;
  //   const diners = useSelector((state) => state.diningEvent.diners);
  //   const totalMealCost = useSelector((state) => state.diningEvent.diners);

  //   const renderItem = ({ item }) => (
  //     <View style={styles.row}>
  //       <Text>@{item.additional_diner_username}</Text>
  //       <Text>$30.00</Text>
  //     </View>
  //   );

  console.log("CLOSE OUT", diningEvent);
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

          {/* <Image
            source={{ uri: item.receipt_image_path }}
            style={styles.image}
          /> */}

          <View>
            <Text style={styles.text}>{eventDate}</Text>
            <Text style={styles.text}>{eventLocation}</Text>
            <Text style={styles.text}>
              <Text style={styles.primaryDiner}>Primary Diner: </Text>@
              {primaryDiner}
            </Text>
          </View>
          <Text style={styles.additionalDinerText}>Additional Diners</Text>
          {/* <FlatList
            data={diners}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
          /> */}
          {/* totalmealcost */}
          <Text>Total Meal Cost: $</Text>
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
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 400,
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
