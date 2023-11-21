import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/colors";
import Logo from "./Logo";
import PrimaryDiner from "./PrimaryDiner";
import PrimaryButton from "./ui/PrimaryButton";
import { useEffect, useState, useRef } from "react";
import Diner from "./Diner";
import { addDiner } from "../store/store";

const AddDiners = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const diningEvent = useSelector((state) => state.diningEvent.event);
  const diners = useSelector((state) => state.diningEvent.diners);
  const eventId = useSelector((state) => state.diningEvent.event.eventId);

  const addDinerUsernameRef = useRef(null);
  const dispatch = useDispatch();

  // const [dinersComplete, setDinersComplete] = useState(false);
  // const [showBirthdayModal, setShowBirthdayModal] = useState(false);
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

  // useEffect(() => {
  //   const autoCompleteDiner = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8000/additionaldiners/suggestions?input=${inputValue}`
  //       );
  //       const data = await response.json();
  //       setSuggestions(
  //         data.sort((a, b) => a.username.localeCompare(b.username))
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   };
  //   autoCompleteDiner();
  // }, [inputValue]);

  const addDinerClickHandler = () => {
    // setShowBirthdayModal(true);
    setShowSuggestions(false);
    const inputValue = addDinerUsernameRef.current.value;
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
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  // const handleAutocomplete = (e) => {
  //   setInputValue(e.target.value);
  //   setShowSuggestions(true);
  // };

  // const handleSelectChange = (e) => {
  //   const selectedValue = e.target.value;
  //   setInputValue(selectedValue);
  // };

  // const handleSelectUsername = (e) => {
  //   setInputValue(e.target.innerText.split("@")[1]);
  //   setShowSuggestions(false);
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
  console.log(inputValue);
  console.log(diners);
  console.log(diners);

  return (
    <View style={styles.container}>
      <Logo />

      <View>
        <Text style={styles.eventTitle}>{diningEvent.eventTitle}</Text>
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
          placeholder="Name, @username"
          ref={addDinerUsernameRef}
          value={inputValue}
          onChangeText={handleInputChange}
        />

        <PrimaryButton onPress={addDinerClickHandler}>Add diner</PrimaryButton>
      </View>

      {diners && (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    width: "55%",
  },
});

export default AddDiners;
