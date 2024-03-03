import { StyleSheet, Text, TextInput, View, Modal } from "react-native";
import React from "react";
import PrimaryButton from "./PrimaryButton";

const AddPropertyToListModal = ({
  visible,
  onClose,
  onSubmit,
  newItemName,
  setNewItemName,
  newItemPrice,
  setNewItemPrice,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Please enter missing info</Text>
            <View style={styles.inputsContainer}>
              <Text style={styles.inputLabels}>Name:</Text>
              <TextInput
                style={styles.textInput}
                value={newItemName}
                onChangeText={(text) => setNewItemName(text)}
              />
              <Text style={styles.inputLabels}>Price:</Text>
              <TextInput
                style={styles.textInput}
                value={newItemPrice}
                onChangeText={(text) => setNewItemPrice(text)}
                keyboardType="numeric"
              />

              <View style={{ flexDirection: "row" }}>
                <PrimaryButton width={100} onPress={onClose}>
                  Close
                </PrimaryButton>
                <PrimaryButton width={100} onPress={onSubmit}>
                  Submit
                </PrimaryButton>
              </View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "red-hat-bold",
    marginBottom: 20,
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputLabels: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "red-hat-bold",
  },
  textInput: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    textAlign: "center",
    color: "black",
    fontFamily: "red-hat-regular",
    fontSize: 25,
  },
});

export default AddPropertyToListModal;
