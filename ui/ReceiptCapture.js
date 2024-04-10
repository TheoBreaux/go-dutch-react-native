import Constants from "expo-constants";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useState, useEffect, useRef } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setEventId,
  setReceiptImagePath,
  setReceiptValues,
} from "../store/store";
import axios from "axios";
import Spinner from "../components/Spinner";
import { getCurrentDate } from "../utils";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/colors";

const ReceiptCapture = ({ setIsCapturingReceipt, isCapturingReceipt }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const diningEvent = useSelector((state) => state.diningEvent.event);

  const restaurantBar =
    diningEvent.selectedRestaurant === ""
      ? diningEvent.enteredSelectedRestaurant
      : diningEvent.selectedRestaurant;

  const primaryDinerUsername = useSelector(
    (state) => state.userInfo.user.username
  );

  // Function to handle selecting an image from the gallery TEMPORARY FOR TESTING
  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === "granted");
      } catch (error) {
        console.error("Error requesting camera permissions: ", error);
      }
    })();
  }, []);

  const captureReceipt = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
        //should do some error handling here for the UI, maybe an Image
      } catch (error) {
        console.error(error);
      }
    }
  };

  const cancelCaptureReceipt = () => {
    setIsCapturingReceipt(!isCapturingReceipt);
  };

  const postData = async () => {
    let imageKey;
    //send to receipt image to AWS S3 bucket
    if (image) {
      try {
        const formData = new FormData();

        formData.append("image", {
          uri: image,
          type: "image/png",
          name: "receipt-image",
        });

        const response = await fetch(
          "https://e20f-2607-fb90-bd35-50ac-5d34-b0d0-fc5a-1c6d.ngrok-free.app/diningevents/receiptimages",
          {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            body: formData,
          }
        );
        const responseData = await response.json();
        imageKey = responseData.imageKey;
      } catch (error) {
        console.error("Error uploading image to AWS S3:", error);
      }
    }

    //send receipt image path to store
    dispatch(setReceiptImagePath(imageKey));

    const diningEventInfo = {
      eventId: diningEvent.eventId,
      diningDate: getCurrentDate(),
      restaurantBar: restaurantBar,
      title: diningEvent.eventTitle,
      primaryDinerUsername: primaryDinerUsername,
      tax: null,
      tip: null,
      totalMealCoat: null,
      receiptImageKey: imageKey,
      subtotal: null,
    };

    try {
      const response = await fetch(
        "https://e20f-2607-fb90-bd35-50ac-5d34-b0d0-fc5a-1c6d.ngrok-free.app/diningevents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(diningEventInfo),
        }
      );
      const result = await response.json();
      dispatch(setEventId(result.eventId));
    } catch (error) {
      console.error(error);
    }
  };

  const saveAndSubmitReceiptImage = async () => {
    setLoading(true);

    // //SENDING RECEIPT TO GET PARSED
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
          apikey: Constants.expoConfig.extra.TAGGUN_API,
        },
      });
      const responseData = response.data;
      dispatch(setReceiptValues(responseData));
      setLoading(false);
      setIsCapturingReceipt(!isCapturingReceipt);
      postData();
      setImage(null);
    } catch (error) {
      console.error(error);
    }

    alert("Receipt submitted and saved! 💸🎉");
    //should navigate to another page, possibly history
    navigation.navigate("AddDinersScreen");
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <View style={styles.container}>
        {loading && (
          <View style={styles.spinnerContainer}>
            <Spinner children="Analyzing receipt...🧾" />
          </View>
        )}

        {!loading && (
          <View style={styles.contentContainer}>
            {!image ? (
              <>
                <Text style={styles.captureText}>
                  Capture receipt for new split!
                </Text>
                <Camera
                  style={styles.camera}
                  type={type}
                  flashMode={flash}
                  ref={cameraRef}
                >
                  <View style={styles.cameraButtons}>
                    <PrimaryButton
                      padding={5}
                      width={40}
                      height={50}
                      onPress={cancelCaptureReceipt}
                    >
                      <Feather name="x-circle" size={24} color="white" />
                      <Text style={styles.cameraText}></Text>
                    </PrimaryButton>
                    <PrimaryButton
                      padding={5}
                      width={40}
                      height={50}
                      onPress={() => {
                        setFlash(
                          flash === Camera.Constants.FlashMode.off
                            ? Camera.Constants.FlashMode.on
                            : Camera.Constants.FlashMode.off
                        );
                      }}
                    >
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
              </>
            ) : (
              <Image source={{ uri: image }} style={styles.camera} />
            )}

            <View style={styles.buttonContainer}>
              {image ? (
                <View style={styles.buttonsContainer}>
                  <PrimaryButton
                    width={150}
                    height={60}
                    padding={3}
                    onPress={() => setImage(null)}
                  >
                    <View style={styles.iconButton}>
                      <Entypo name="retweet" size={24} color="white" />
                      <Text style={styles.cameraText}>Recapture</Text>
                    </View>
                  </PrimaryButton>
                  <PrimaryButton
                    width={150}
                    height={60}
                    padding={3}
                    onPress={saveAndSubmitReceiptImage}
                  >
                    <View style={styles.iconButton}>
                      <Entypo name="check" size={24} color="white" />
                      <Text style={styles.cameraText}>Save</Text>
                    </View>
                  </PrimaryButton>
                </View>
              ) : (
                <PrimaryButton
                  width={150}
                  height={60}
                  onPress={captureReceipt}
                  padding={3}
                >
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
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  captureText: {
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
    fontSize: 25,
    fontFamily: "red-hat-bold",
    color: Colors.goDutchBlue,
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
