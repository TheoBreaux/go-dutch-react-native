import { StyleSheet, Text, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useState, useEffect, useRef } from "react";
import PrimaryButton from "./ui/PrimaryButton";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ReceiptCapture = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  const navigation = useNavigation();

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
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const saveReceiptImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("Receipt Saved! 🎉");
        setImage(null);
        //should navigate to another page, possibly history
        navigation.navigate("AddDiners");
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}>
          <View style={styles.cameraButtons}>
            <PrimaryButton padding={5} width={40}>
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
                  flash === Camera.Constants.FlashMode.off ? "gray" : "white"
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
            <PrimaryButton padding={3} onPress={saveReceiptImage}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
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
});

export default ReceiptCapture;
