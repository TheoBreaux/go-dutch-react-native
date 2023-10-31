import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import Logo from "./Logo";
import { Picker } from "@react-native-picker/picker";
import Footer from "./Footer";
import { paymentOptions } from "../data/data";
import { useState } from "react";
import Colors from "../constants/colors";

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
          <Text style={styles.label}>Select Primary Payment Source</Text>
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
          <Text style={styles.label}>Please Enter Payment Source Username</Text>
          <TextInput
            style={styles.input}
            placeholder="@john-smith"
            value={primaryPaymentUsername}
            onChangeText={(text) => setPrimaryPaymentUsername(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Secondary Payment Source</Text>
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
          <Text style={styles.label}>Please Enter Payment Source Username</Text>
          <TextInput
            style={styles.input}
            placeholder="@john-smith"
            value={secondaryPaymentUsername}
            onChangeText={(text) => setSecondaryPaymentUsername(text)}
          />
        </View>

        <View style={styles.submitButton}>
          <Button title="Submit" color={Colors.goDutchRed} />
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
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 32,
  },
  subtitle: {
    fontFamily: "red-hat-bold",
    textAlign: "center",
    fontSize: 18,
    color: Colors.goDutchRed,
  },
  label: {
    fontFamily: "red-hat-regular",
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderBottomColor: Colors.inputBorder,
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: "100%",
  },
  submitButton: {
    backgroundColor: Colors.goDutchRed,
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
    borderColor: Colors.goDutchRed,
    borderStyle: "dashed",
    padding: 5,
    width: "100%",
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
