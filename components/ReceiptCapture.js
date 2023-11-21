import { StyleSheet, Text, View, Image, Modal } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useState, useEffect, useRef } from "react";
import PrimaryButton from "./ui/PrimaryButton";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setDiningEvent, setEventId, setReceiptValues } from "../store/store";
import axios from "axios";
import Spinner from "./Spinner";
import { getCurrentDate } from "../utils";
import Logo from "./Logo";
import Colors from "../constants/colors";
import PrimaryDiner from "./PrimaryDiner";

const ReceiptCapture = ({ setIsCapturingReceipt, isCapturingReceipt }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const diningEvent = useSelector((state) => state.diningEvent.event);
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);

  //   const restaurantBar =
  //     diningEvent.selectedRestaurant === ""
  //       ? diningEvent.enteredSelectedRestaurant
  //       : diningEvent.selectedRestaurant;

  //   const primaryDinerUsername = useSelector(
  //     (state) => state.userInfo.user.username
  //   );

  console.log("ReceiptCapture 1 - CURRENTLY IN REDUX STORE:", diningEvent);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const captureReceipt = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const cancelCaptureReceipt = () => {
    setIsCapturingReceipt(!isCapturingReceipt);
  };

  //   const postData = async () => {
  //     const diningEventInfo = {
  //       event_id: diningEvent.eventId,
  //       dining_date: getCurrentDate(),
  //       restaurant_bar: restaurantBar,
  //       title: diningEvent.eventTitle,
  //       primary_diner_username: primaryDinerUsername,
  //       tax: null,
  //       tip: null,
  //       total_meal_cost: null,
  //       receipt_image: null,
  //     };

  //     try {
  //       const response = await fetch(
  //         "https://0e24-2603-8000-c0f0-a570-6cee-6c44-f20e-afc7.ngrok-free.app/diningevents",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(diningEventInfo),
  //         }
  //       );
  //       const result = await response.json();
  //       dispatch(setEventId(result.event_id));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  const saveAndSubmitReceiptImage = async () => {
    setLoading(true);
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
      } catch (error) {
        console.error(error);
      }

      //SENDING RECEIPT TO GET PARSED
      const url = "https://api.taggun.io/api/receipt/v1/verbose/file";
      const fileUri = image;
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: "image/jpeg",
        name: "image.jpg",
      });

      try {
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            apikey: "b7dfb6e071e711eea8f313266e4aecd5",
          },
        });
        const responseData = response.data;
        console.log("RETURNED RECEIPT DATA:", responseData);
        dispatch(setReceiptValues(responseData));
        setLoading(false);
        //AddDinerModal - data is posted onpress postData() is run

        // postData();
        // alert("Receipt submitted and saved! 💸🎉");
        setIsCapturingReceipt(!isCapturingReceipt);
        setImage(null);
      } catch (error) {
        console.error(error);
      }
      //should navigate to another page, possibly history
      navigation.navigate("AddDiners");
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  console.log("AFTER save and submit happens theses are the values");
  console.log("ReceiptCapture 2 - CURRENTLY IN REDUX STORE:", diningEvent);
  console.log("Receipt Values - CURRENTLY IN REDUX STORE:", receiptValues);
  //   console.log(receiptValues.taxAmount);
  //   console.log(receiptValues.taxAmount.data);

  return (
    <>
      {<Modal>
        <Logo />
        <View>
          <Text style={styles.eventTitle}>{diningEvent.eventTitle}</Text>
        </View>
        <Text style={styles.title}>DINERS</Text>
        <PrimaryDiner/>
      </Modal>}

      <View style={styles.container}>
        {loading && (
          <View style={styles.spinnerContainer}>
            <Spinner />
          </View>
        )}

        {!loading && (
          <View style={styles.contentContainer}>
            {!image ? (
              <Camera
                style={styles.camera}
                type={type}
                flashMode={flash}
                ref={cameraRef}>
                <View style={styles.cameraButtons}>
                  <PrimaryButton
                    padding={5}
                    width={40}
                    onPress={cancelCaptureReceipt}>
                    <Feather name="x-circle" size={24} color="white" />
                    <Text style={styles.cameraText}></Text>
                  </PrimaryButton>
                  <PrimaryButton
                    padding={5}
                    width={40}
                    onPress={() => {
                      setFlash(
                        flash === Camera.Constants.FlashMode.off
                          ? Camera.Constants.FlashMode.on
                          : Camera.Constants.FlashMode.off
                      );
                    }}>
                    <Entypo
                      name="flash"
                      size={24}
                      color={
                        flash === Camera.Constants.FlashMode.off
                          ? "gray"
                          : "white"
                      }
                    />
                    <Text style={styles.cameraText}></Text>
                  </PrimaryButton>
                </View>
              </Camera>
            ) : (
              <Image source={{ uri: image }} style={styles.camera} />
            )}

            <View style={styles.buttonContainer}>
              {image ? (
                <View style={styles.buttonsContainer}>
                  <PrimaryButton padding={3} onPress={() => setImage(null)}>
                    <View style={styles.iconButton}>
                      <Entypo name="retweet" size={24} color="white" />
                      <Text style={styles.cameraText}>Recapture</Text>
                    </View>
                  </PrimaryButton>
                  <PrimaryButton
                    padding={3}
                    onPress={saveAndSubmitReceiptImage}>
                    <View style={styles.iconButton}>
                      <Entypo name="check" size={24} color="white" />
                      <Text style={styles.cameraText}>Save</Text>
                    </View>
                  </PrimaryButton>
                </View>
              ) : (
                <PrimaryButton onPress={captureReceipt} padding={3}>
                  <View style={styles.iconButton}>
                    <Entypo name="camera" size={24} color="white" />
                    <Text style={styles.cameraText}>Capture</Text>
                  </View>
                </PrimaryButton>
              )}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  eventTitle: {
    textAlign: "center",
    fontFamily: "red-hat-bold",
    color: Colors.goDutchRed,
    fontSize: 40,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "red-hat-regular",
    color: Colors.goDutchBlue,
  },

  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  camera: {
    flex: 1,
  },
  cameraButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraText: {
    color: "white",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -50,
    width: "100%",
    height: "100%",
  },
});

export default ReceiptCapture;