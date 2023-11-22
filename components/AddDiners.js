import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/colors";
import Logo from "./Logo";
import PrimaryDiner from "./PrimaryDiner";
import PrimaryButton from "./ui/PrimaryButton";
import { useEffect, useState, useRef } from "react";
import Diner from "./Diner";
import { addDiner } from "../store/store";
import Profile from "./Profile";

const AddDiners = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDiners, setShowDiners] = useState(false);
  const [allDinersAddedModal, setShowAllDinersAddedModal] = useState(false);
  const [dinersComplete, setDinersComplete] = useState(false);
  // const [showBirthdayModal, setShowBirthdayModal] = useState(false);

  const diningEvent = useSelector((state) => state.diningEvent.event);
  const diners = useSelector((state) => state.diningEvent.diners);
  const eventId = useSelector((state) => state.diningEvent.event.eventId);

  // const addDinerUsernameRef = useRef(null);
  const dispatch = useDispatch();

  // const [showSelectBirthdayModal, setShowSelectBirthdayModal] = useState(false);
  // const [birthdayPeople, setBirthdayPeople] = useState([]);
  // const eventTitle = useSelector((state) => state.diningEvent.eventTitle);

  // const navigate = useNavigate();

  // const postData = async () => {
  //   // create data object to send to db
  //   const data = {
  //     event_id: eventId,
  //     additionalDiners: diners,
  //     diner_meal_cost: null,
  //   };
  //   try {
  //     const response = await fetch(`http://localhost:8000/additionaldiners/`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });
  //   } catch (error) {
  //     console.error("Network error:", error);
  //   }
  // };

  useEffect(() => {
    const autoCompleteDiner = async () => {
      try {
        const response = await fetch(
          `https://0e24-2603-8000-c0f0-a570-6cee-6c44-f20e-afc7.ngrok-free.app/additionaldiners/suggestions?input=${inputValue}`
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
    // setShowBirthdayModal(true);
    // const username = addDinerUsernameRef.current.value;
    console.log("INPUT VALUE:", inputValue);

    const isValuePresent = diners.some((obj) =>
      Object.values(obj).includes(inputValue)
    );
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
          diner_meal_cost: null,
          items: [],
          birthday: null,
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

  const handleSelectUsername = () => {
    const user = suggestions[0].firstName + " " + suggestions[0].lastName;
    setInputValue(user);
    setShowSuggestions(false);
  };

  const closeModal = () => {
    setShowAllDinersAddedModal(false);
  };

  const birthdayHandler = () => {
    console.log("yes");
    //do some stuff
  };

  const noBirthdayHandler = () => {
    console.log("no");
  };

  // const handleAutocomplete = (e) => {
  //   setInputValue(e.target.value);
  //   setShowSuggestions(true);
  // };

  // const handleSelectChange = (e) => {
  //   const selectedValue = e.target.value;
  //   setInputValue(selectedValue);
  // };

  // const noBirthdayClickHandler = () => {
  //   postData();
  //   setShowBirthdayModal(false);
  //   navigate("/dining-history");
  // };

  // const handleBirthdayClickHandler = () => {
  //   setShowBirthdayModal(false);
  //   setShowSelectBirthdayModal(true);
  // };

  // const setBirthdayClickHandler = () => {
  //   setShowSelectBirthdayModal(false);
  //   setDinersComplete(true);
  //   postData();
  // };

  // const addBirthdayStatusClickHandler = (e) => {
  //   setBirthdayPeople([...birthdayPeople, e.target.name]);
  // };

  // const handleReceiptCapture = () => {
  //   setShowBirthdayModal(true);
  // };

  // Reset state when the component unmounts or when navigating away
  // useEffect(() => {
  //   return () => {
  //     // Reset the state to initial values
  //     dispatch(clearDiners());
  //     setDinersComplete(false);
  //     setInputValue("");
  //     setSuggestions([]);
  //     setShowSuggestions(false);
  //     setShowBirthdayModal(false);
  //     setShowSelectBirthdayModal(false);
  //     setBirthdayPeople([]);
  //   };
  // }, [dispatch]);

  console.log("CURRENT DINERS:", diners);
  console.log("SUGGESTIONS:", suggestions);

  return (
    <View style={styles.container}>
      <Logo />

      {/* all diners have been added modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={allDinersAddedModal}
        onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                style={styles.dinerModalImage}
                source={require("../images/go-dutch-split-button.png")}
              />
              <Text style={styles.modalText}>All diners added?</Text>

              <View style={styles.buttonsContainer}>
                <PrimaryButton onPress={birthdayHandler} width={100}>
                  Yes
                </PrimaryButton>

                <PrimaryButton onPress={noBirthdayHandler} width={100}>
                  No
                </PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* birthday modal */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={allDinersAddedModal}
        onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                style={styles.modalImage}
                source={require("../images/birthday-cake.png")}
              />
              <Text style={styles.modalText}>Is it someone's birthday?</Text>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={birthdayHandler}
                  style={styles.pressableContainer}>
                  <Text style={styles.birthdayYesBtn}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={noBirthdayHandler}
                  style={styles.pressableContainer}>
                  <Text style={styles.birthdayNoBtn}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal> */}

      <View>
        <Text style={styles.eventTitle}>
          {diningEvent.eventTitle}Kevin's Birthday Dinner
        </Text>
      </View>
      <Text style={styles.title}>DINERS</Text>
      <PrimaryDiner />
      <View style={styles.addDinersContainer}>
        <Image
          style={styles.iconImage}
          source={require("../images/go-dutch-split-button.png")}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Input name, username..."
          // ref={addDinerUsernameRef}
          value={inputValue}
          onChangeText={handleInputChange}
        />

        <PrimaryButton width={130} onPress={addDinerClickHandler}>
          Add diner
        </PrimaryButton>
      </View>

      {showDiners && (
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
      )}

      {showSuggestions && (
        <FlatList
          style={styles.showSuggestionsContainer}
          data={suggestions}
          renderItem={({ item, index }) => (
            <Profile
              key={index}
              userFullName={item.firstName + " " + item.lastName}
              username={item.username}
              onPress={handleSelectUsername}
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
    fontFamily: "red-hat-regular",
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
  showSuggestionsContainer: { padding: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
    // width: "80%",
    height: 400,
    elevation: 5,
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
  modalText: {
    fontFamily: "red-hat-regular",
    fontSize: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  // pressableContainer: {
  //   width: 100,
  //   alignItems: "center",
  //   padding: 10,
  //   borderWidth: 1,
  //   marginVertical: 10,
  //   marginHorizontal: 10,
  // },
  // birthdayYesBtn: {
  //   fontFamily: "red-hat-bold",
  //   fontSize: 20,
  //   color: "green",
  // },
  // birthdayNoBtn: {
  //   fontFamily: "red-hat-bold",
  //   fontSize: 20,
  //   color: "red",
  // },
  closeButton: {
    color: "blue",
    marginTop: 10,
  },
});

export default AddDiners;
