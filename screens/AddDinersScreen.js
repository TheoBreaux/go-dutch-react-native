import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/colors";
import Logo from "../components/Logo";
import PrimaryDiner from "../components/PrimaryDiner";
import PrimaryButton from "../components/PrimaryButton";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Diner from "../components/Diner";
import { addDiner, setEventIdForPrimary } from "../store/store";
import ProfileIcon from "../components/ProfileIcon";
import BirthdayDiner from "../components/BirthdayDiner";

const AddDinersScreen = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDiners, setShowDiners] = useState(true);
  const [showAllDinersAddedModal, setShowAllDinersAddedModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showSelectBirthday, setShowSelectBirthday] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const diningEvent = useSelector((state) => state.diningEvent.event);
  const diners = useSelector((state) => state.diningEvent.diners);
  const eventId = useSelector((state) => state.diningEvent.event.eventId);
  const goDutchUsername = useSelector((state) => state.userInfo.user.username);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const showMiniModal = diners.length > 1;

  useEffect(() => {
    dispatch(setEventIdForPrimary(eventId));
  }, [eventId]);

  const checkIfDinerExistsInDatabase = async (username) => {
    let isDinerInDatabase;
    try {
      const response = await fetch(
        `https://abd2-2603-8000-c0f0-a570-e840-db4a-515a-91a5.ngrok-free.app/users/${username}`
      );
      const data = await response.json();
      isDinerInDatabase = data;
      return data;
    } catch (error) {
      console.error("User does not exist in database", error);
      return false;
    }
  };

  useEffect(() => {
    const autoCompleteDiner = async () => {
      try {
        const response = await fetch(
          `https://abd2-2603-8000-c0f0-a570-e840-db4a-515a-91a5.ngrok-free.app/additionaldiners/suggestions?input=${inputValue}`
        );
        const data = await response.json();
        setSuggestions(
          data.sort((a, b) => a.username.localeCompare(b.username))
        );
      } catch (error) {
        throw error;
      }
    };
    autoCompleteDiner();
  }, [inputValue]);

  const addDinerClickHandler = async () => {
    //disable add diner button if no value is entered
    if (inputValue === "") {
      return;
    }

    const isValuePresent =
      diners.some((obj) => Object.values(obj).includes(inputValue)) ||
      inputValue === goDutchUsername;

    // Check if diner is in the database
    const dinerInDatabase = await checkIfDinerExistsInDatabase(inputValue);

    //If diner is already added, show alert and don't allow
    if (isValuePresent || !dinerInDatabase) {
      Alert.alert(
        "🤦🏾‍♂️Not Allowed! ", // Alert title
        "This diner is already included in the split or the username does not exist!", // Alert message
        [
          {
            text: "OK", // Button text
            onPress: () => {
              setInputValue("");
              setShowDiners(true);
              setShowSuggestions(false);
            },
          },
        ]
      );
    } else {
      const foundSuggestion = suggestions.find(
        (suggestion) => suggestion.username === inputValue
      );

      const profileImageKey = foundSuggestion.profileImageKey;

      dispatch(
        addDiner({
          eventId: eventId,
          id: Date.now(),
          additionalDinerUsername: inputValue,
          primaryDiner: false,
          dinerMealCost: 0,
          items: [],
          celebratingBirthday: false,
          firstName: foundSuggestion.firstName,
          lastName: foundSuggestion.lastName,
          bio: foundSuggestion.bio,
          location: foundSuggestion.location,
          favoriteCuisine: foundSuggestion.favoriteCuisine,
          birthday: foundSuggestion.birthday,
          dateJoined: foundSuggestion.dateJoined,
          profileImageKey: profileImageKey,
        })
      );

      // Remove added diner from suggestions
      // const updatedSuggestions = suggestions.filter(
      //   (suggestion) => suggestion.username !== inputValue
      // );

      // setSuggestions(updatedSuggestions);

      setInputValue("");
      setShowDiners(true);
      setShowAllDinersAddedModal(true);
    }
  };

  const handleInputChange = (text) => {
    setInputValue(text);
    setShowSuggestions(true);
    setShowDiners(false);
  };

  const handleSelectUsername = (selectedUsername) => {
    setInputValue(selectedUsername);
    setShowSuggestions(false);

    const selectedUser = suggestions.find(
      (user) => user.username === selectedUsername
    );

    // Update the profile image path if the user is found
    if (selectedUser) {
      setSelectedUser(selectedUser);
    }
  };

  const allDinersAddedHandler = () => {
    setShowBirthdayModal(true);
    setShowAllDinersAddedModal(false);
  };

  const birthdayHandler = () => {
    setShowSelectBirthday(true);
  };

  const postData = async () => {
    setShowSelectBirthday(false);
    setShowBirthdayModal(false);
    //navigate to draggable screen
    navigation.navigate("ConfirmReceiptItemsScreen");
    // create data object to send to db
    const data = {
      eventId: eventId,
      additionalDiners: diners,
      dinerMealCost: 0,
      celebratingBirthday: false,
    };

    // Extract birthday value
    const birthdayValue = diners.some((diner) => diner.celebratingBirthday); // Check if any diner has birthday true

    try {
      const response = await fetch(
        `https://abd2-2603-8000-c0f0-a570-e840-db4a-515a-91a5.ngrok-free.app/additionaldiners`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, celebratingBirthday: birthdayValue }),
        }
      );
      // const result = await response.json();
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const renderSuggestionsItem = useMemo(() => {
    return ({ item, index }) => (
      <ProfileIcon
        key={index}
        userFullName={`${item.firstName} ${item.lastName}`}
        username={item.username}
        onPress={handleSelectUsername}
        profileImageKey={item.profileImageKey}
        item={item}
      />
    );
  }, [handleSelectUsername]);

  return (
    <View style={styles.container}>
      <Logo />

      {/* birthday modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBirthdayModal}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {!showSelectBirthday && (
                <>
                  <Image
                    style={styles.modalImage}
                    source={require("../assets/birthday-cake.png")}
                  />
                  <Text style={styles.modalText}>
                    Is it someone's birthday?
                  </Text>
                  <View style={styles.buttonsContainer}>
                    <PrimaryButton
                      width={100}
                      height={50}
                      onPress={birthdayHandler}
                    >
                      Yes
                    </PrimaryButton>

                    <PrimaryButton width={100} height={50} onPress={postData}>
                      No
                    </PrimaryButton>
                  </View>
                </>
              )}

              {showSelectBirthday && (
                <>
                  <Image
                    style={[styles.modalImage, styles.birthdayCake]}
                    source={require("../assets/birthday-cake.png")}
                  />
                  <View style={styles.birthdaySelects}>
                    <Text style={styles.modalText}>
                      Select the birthday(s)!
                    </Text>
                    <FlatList
                      contentContainerStyle={styles.birthdaySelects}
                      data={diners}
                      renderItem={({ item }) => (
                        <BirthdayDiner
                          key={item.id}
                          additionalDinerUsername={item.additionalDinerUsername}
                          diner={item}
                        />
                      )}
                    />
                    <View style={styles.birthdayButtonContainer}>
                      {/* SEND ALL INFO TO DATABASE */}
                      <View style={{ flexDirection: "row" }}>
                        <PrimaryButton
                          width={100}
                          onPress={() => setShowSelectBirthday(false)}
                        >
                          Return
                        </PrimaryButton>
                        <PrimaryButton width={100} onPress={postData}>
                          Continue
                        </PrimaryButton>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <View>
        <Text style={styles.eventTitle}>
          {diningEvent.eventTitle.toUpperCase()}
        </Text>
        <Text style={styles.eventLocation}>
          {diningEvent.selectedRestaurant ||
            diningEvent.enteredSelectedRestaurant}
        </Text>
      </View>
      <PrimaryDiner />
      <View style={styles.addDinersContainer}>
        <Image
          style={styles.iconImage}
          source={require("../assets/go-dutch-split-button.png")}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Input name, username..."
          value={inputValue}
          onChangeText={handleInputChange}
        />

        <PrimaryButton width={130} height={50} onPress={addDinerClickHandler}>
          Add Diner
        </PrimaryButton>
      </View>

      {showDiners && (
        <React.Fragment>
          {/* rendering all diners to the screen */}
          <FlatList
            data={diners}
            renderItem={({ item }) => (
              <Diner
                key={item.id}
                additionalDinerUsername={item.additionalDinerUsername}
                diner={item}
                profileImageKey={item.profileImageKey}
              />
            )}
          />

          {/* modal to confirm all diners added */}
          {showMiniModal && (
            <View style={styles.miniModalContent}>
              <View>
                <Text
                  style={[
                    styles.miniModalText,
                    { textAlign: "center", marginTop: 5 },
                  ]}
                >
                  All diners added?
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <PrimaryButton
                  width={150}
                  height={50}
                  onPress={allDinersAddedHandler}
                >
                  Confirm
                </PrimaryButton>
              </View>
            </View>
          )}
        </React.Fragment>
      )}

      {showSuggestions && (
        <FlatList
          style={styles.showSuggestionsContainer}
          data={suggestions}
          renderItem={renderSuggestionsItem}
        />
      )}
    </View>
  );
};

//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 600,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: "center",
  },
  modalText: {
    fontFamily: "red-hat-normal",
    fontSize: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  birthdayCake: {
    marginTop: 250,
  },
  birthdaySelects: {
    justifyContent: "center",
    alignItems: "center",
  },

  birthdayButtonContainer: {
    marginBottom: 245,
  },
  eventTitle: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 25,
    marginTop: -10,
    marginBottom: 5,
  },
  eventLocation: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    fontSize: 25,
    marginTop: -10,
  },
  addDinersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  iconImage: {
    width: 30,
    height: 30,
    resizeMode: "center",
    position: "absolute",
    zIndex: 1,
    marginLeft: 5,
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 14,
    paddingLeft: 50,
    width: "60%",
  },
  miniModalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 150,
    marginBottom: 10,
    elevation: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  miniModalText: {
    fontFamily: "red-hat-normal",
    fontSize: 25,
    textAlign: "center",
  },
  showSuggestionsContainer: { padding: 5 },
});

export default AddDinersScreen;
