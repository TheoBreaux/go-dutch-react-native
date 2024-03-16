import { StyleSheet, Text, View, Modal, Image } from "react-native";
import React from "react";
import PrimaryButton from "./PrimaryButton";

const CustomModal = ({
  animationType,
  transparent,
  visible,
  source,
  modalText,
  buttonWidth,
  onPress1,
  onPress2,
  buttonText1,
  buttonText2,
  modalHeight,
}) => {
  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { height: modalHeight }]}>
            {source && <Image style={styles.modalImage} source={source} />}

            <Text style={styles.modalText}>{modalText}</Text>

            <View style={styles.buttonsContainer}>
              <PrimaryButton width={buttonWidth} onPress={onPress1}>
                {buttonText1}
              </PrimaryButton>

              <PrimaryButton width={buttonWidth} onPress={onPress2}>
                {buttonText2}
              </PrimaryButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    height: 500,
    elevation: 5,
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
});

export default CustomModal;
