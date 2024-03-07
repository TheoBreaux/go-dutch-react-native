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
import React, { useEffect, useState } from "react";
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
        `https://a294-2603-8000-c0f0-a570-5caf-c431-e0b4-dcd8.ngrok-free.app/users/${username}`
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
          `https://a294-2603-8000-c0f0-a570-5caf-c431-e0b4-dcd8.ngrok-free.app/additionaldiners/suggestions?input=${inputValue}`
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
    const isDinerInDatabase = await checkIfDinerExistsInDatabase(inputValue);

    //If diner is already added, show alert and don't allow
    if (isValuePresent || !isDinerInDatabase) {
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
      const profilePic = foundSuggestion.profilePicPath;

      dispatch(
        addDiner({
          event_id: eventId,
          id: Date.now(),
          additional_diner_username: inputValue,
          primary_diner: false,
          diner_meal_cost: 0,
          items: [],
          birthday: false,
          profile_pic_image_path: profilePic,
        })
      );
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
      event_id: eventId,
      additionalDiners: diners,
      diner_meal_cost: 0,
      birthday: null,
    };

    // Extract birthday value
    const birthdayValue = diners.some((diner) => diner.birthday); // Check if any diner has birthday true

    try {
      const response = await fetch(
        `https://a294-2603-8000-c0f0-a570-5caf-c431-e0b4-dcd8.ngrok-free.app/additionaldiners`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, birthday: birthdayValue }),
        }
      );
      // const result = await response.json();
    } catch (error) {
      console.error("Network error:", error);
    }
  };

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
                    <PrimaryButton width={100} onPress={birthdayHandler}>
                      Yes
                    </PrimaryButton>

                    <PrimaryButton width={100} onPress={postData}>
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
                          additionalDinerUsername={
                            item.additional_diner_username
                          }
                          diner={item}
                        />
                      )}
                    />
                    <View
                      style={[
                        styles.buttonContainer,
                        styles.birthdayButtonContainer,
                      ]}
                    >
                      {/* SEND ALL INFO TO DATABASE */}
                      <PrimaryButton onPress={postData}>Continue</PrimaryButton>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <View>
        <Text style={styles.eventTitle}>{diningEvent.eventTitle}</Text>
      </View>
      <PrimaryDiner />
      {/* <Text style={styles.title}>↓ Add diners ↓</Text> */}
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

        <PrimaryButton width={130} onPress={addDinerClickHandler}>
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
                additionalDinerUsername={item.additional_diner_username}
                diner={item}
                profilePicPath={item.profile_pic_image_path}
              />
            )}
          />

          {/* modal to confirm all diners added */}
          {showMiniModal && (
            <View style={styles.miniModalContent}>
              <View>
                <Text
                  style={[
                    styles.modalText,
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
                <PrimaryButton width={100} onPress={allDinersAddedHandler}>
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
          renderItem={({ item, index }) => (
            <ProfileIcon
              key={index}
              userFullName={item.firstName + " " + item.lastName}
              username={item.username}
              onPress={handleSelectUsername}
              profileImagePath={item.profilePicPath}
              item={item}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  eventTitle: {
    textAlign: "center",
    fontFamily: "red-hat-regular",
    color: Colors.goDutchRed,
    fontSize: 30,
    marginTop: -10,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "red-hat-bold",
    color: Colors.goDutchBlue,
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
  showSuggestionsContainer: { padding: 5 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
    height: 600,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  miniModalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 150,
    elevation: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dinerModalImage: {
    width: 250,
    height: 200,
    resizeMode: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  birthdayCake: {
    marginTop: 250,
  },
  modalText: {
    fontFamily: "red-hat-regular",
    fontSize: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    marginBottom: 125,
  },
  birthdayButtonContainer: {
    marginBottom: 245,
  },
  birthdaySelects: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    color: "blue",
    marginTop: 10,
  },
});

export default AddDinersScreen;
