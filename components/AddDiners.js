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
import Logo from "./Logo";
import PrimaryDiner from "./PrimaryDiner";
import PrimaryButton from "./ui/PrimaryButton";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Diner from "./Diner";
import { addDiner, setInitialPrimaryDiner, updateDiners } from "../store/store";
import ProfileIcon from "../components/ui/ProfileIcon";
import BirthdayDiner from "./BirthdayDiner";

const AddDiners = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDiners, setShowDiners] = useState(false);
  const [allDinersAddedModal, setShowAllDinersAddedModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showSelectBirthday, setShowSelectBirthday] = useState(false);

  const diningEvent = useSelector((state) => state.diningEvent.event);
  const diners = useSelector((state) => state.diningEvent.diners);
  const eventId = useSelector((state) => state.diningEvent.event.eventId);
  const goDutchUsername = useSelector((state) => state.userInfo.user.username);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  console.log("FIRST DINERS VALUE IN ADD DINERS:", diners);

  useEffect(() => {
    dispatch(
      setInitialPrimaryDiner({
        event_id: eventId,
        id: Date.now(),
        additional_diner_username: goDutchUsername,
        primary_diner: true,
        diner_meal_cost: null,
        assignedItemsComplete: false,
        items: [],
        birthday: false,
      })
    );
  }, []);

  useEffect(() => {
    const autoCompleteDiner = async () => {
      try {
        const response = await fetch(
          `https://cd04-2603-8000-c0f0-a570-18c1-a9e4-ab0e-834d.ngrok-free.app/additionaldiners/suggestions?input=${inputValue}`
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

  const addDinerClickHandler = () => {
    //disable add diner button if no value is entered
    if (inputValue === "") {
      return;
    }

    const isValuePresent =
      diners.some((obj) => Object.values(obj).includes(inputValue)) ||
      inputValue === goDutchUsername;

    //If diner is already added, show alert and on't allow
    if (isValuePresent) {
      Alert.alert(
        "🤦🏾‍♂️Not Allowed! ", // Alert title
        "This diner is already included in the split!", // Alert message
        [
          {
            text: "OK", // Button text
            onPress: () => {
              setInputValue("");
              setShowDiners(true);
            },
          },
        ]
      );
    } else {
      dispatch(
        addDiner({
          event_id: eventId,
          id: Date.now(),
          additional_diner_username: inputValue,
          primary_diner: false,
          diner_meal_cost: null,
          assignedItemsComplete: false,
          items: [],
          birthday: false,
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
  };

  const addMoreDinersHandler = () => {
    setShowAllDinersAddedModal(false);
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
    navigation.navigate("AssignItems");
    // create data object to send to db
    const data = {
      event_id: eventId,
      additionalDiners: diners,
      diner_meal_cost: null,
    };
    try {
      const response = await fetch(
        `https://cd04-2603-8000-c0f0-a570-18c1-a9e4-ab0e-834d.ngrok-free.app/additionaldiners/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />

      {/* all diners have been added modal */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={allDinersAddedModal}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                style={styles.dinerModalImage}
                source={require("../images/go-dutch-split-button.png")}
              />
              <Text style={styles.modalText}>All diners added?</Text>

              <View style={styles.buttonsContainer}>
                <PrimaryButton onPress={allDinersAddedHandler} width={100}>
                  Yes
                </PrimaryButton>

                <PrimaryButton onPress={addMoreDinersHandler} width={100}>
                  No
                </PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal> */}

      {/* birthday modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBirthdayModal}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {!showSelectBirthday && (
                <>
                  <Image
                    style={styles.modalImage}
                    source={require("../images/birthday-cake.png")}
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
                    source={require("../images/birthday-cake.png")}
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
                      ]}>
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
      <Text style={styles.title}>↓ Add diners ↓</Text>
      <View style={styles.addDinersContainer}>
        <Image
          style={styles.iconImage}
          source={require("../images/go-dutch-split-button.png")}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Input name, username..."
          value={inputValue}
          onChangeText={handleInputChange}
        />

        <PrimaryButton width={130} onPress={addDinerClickHandler}>
          Add diner
        </PrimaryButton>
      </View>

      {showDiners && (
        <View>
          <FlatList
            data={diners}
            renderItem={({ item }) => (
              <Diner
                key={item.id}
                additionalDinerUsername={item.additional_diner_username}
                diner={item}
              />
            )}
          />

          <View style={styles.miniModalContent}>
            <View>
              <Text
                style={[
                  styles.modalText,
                  { textAlign: "center", marginTop: 5 },
                ]}>
                All diners added?
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}>
              <PrimaryButton width={100} onPress={allDinersAddedHandler}>
                Yes
              </PrimaryButton>
              {/* <PrimaryButton width={100} onPress={addMoreDinersHandler}>
                No
              </PrimaryButton> */}
            </View>
          </View>
        </View>
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
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 30,
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

export default AddDiners;
