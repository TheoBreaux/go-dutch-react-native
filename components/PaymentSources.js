import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import Logo from "./Logo";
import { Picker } from "@react-native-picker/picker";
import Footer from "./Footer";
import { paymentOptions } from "../data/data";
import { useState } from "react";

const PaymentSources = () => {
  const [selectedPrimaryPayment, setSelectedPrimaryPayment] =
    useState("default");
  const [selectedSecondaryPayment, setSelectedSecondaryPayment] =
    useState("default");
  const [primaryPaymentUsername, setPrimaryPaymentUsername] = useState("");
  const [secondaryPaymentUsername, setSecondaryPaymentUsername] = useState("");

  const handlePrimaryPaymentChange = (itemValue) => {
    setSelectedPrimaryPayment(itemValue);
  };

  const handleSecondaryPaymentChange = (itemValue) => {
    setSelectedSecondaryPayment(itemValue);
  };

  return (
    <>
      <Logo />

      <View style={styles.container}>
        <Text style={styles.title}>Welcome, firstName!</Text>

        <Text style={styles.subtitle}>Please select your payment sources!</Text>

        <View style={styles.inputContainer}>
          <Text>Select Primary Payment Source</Text>
          <View>
            <Picker
              style={styles.input}
              selectedValue={selectedPrimaryPayment}
              onValueChange={handlePrimaryPaymentChange}>
              {paymentOptions.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.source}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text>Please Enter Payment Source Username</Text>
          <TextInput
            style={styles.input}
            placeholder="@john-smith"
            value={primaryPaymentUsername}
            onChangeText={(text) => setPrimaryPaymentUsername(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text>Select Secondary Payment Source</Text>
          <View>
            <Picker
              style={styles.input}
              selectedValue={selectedSecondaryPayment}
              onValueChange={handleSecondaryPaymentChange}>
              {paymentOptions.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.source}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text>Please Enter Payment Source Username</Text>
          <TextInput
            style={styles.input}
            placeholder="@john-smith"
            value={secondaryPaymentUsername}
            onChangeText={(text) => setSecondaryPaymentUsername(text)}
          />
        </View>

        <View style={styles.submitButton}>
          <Button title="Submit" color={"#A40E24"} />
        </View>
        <View style={styles.adSpace}>
          <Text style={styles.ad}>This will be ad space</Text>
        </View>
      </View>

      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 18,
    color: "#a40e24",
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#e8ebf0",
    borderBottomColor: "#1a202c",
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#A40E24",
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
    width: "100%",
    borderColor: "black",
    borderWidth: 5,
    borderStyle: "solid",
    marginLeft: 0,
  },
  adSpace: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#A40E24",
    borderStyle: 'dashed',
    padding: 5,
    width: '100%',
    height: 200,
  },
  ad: {
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
});

export default PaymentSources;
