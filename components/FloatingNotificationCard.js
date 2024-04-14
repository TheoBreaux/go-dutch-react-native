import {
  PanResponder,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useEffect } from "react";
import Colors from "../constants/colors";

const FloatingNotificationCard = ({
  firstName,
  restaurantName,
  dinerMealCost,
  primaryDiner,
  onPress,
}) => {
  const SCREEN_HEIGHT = Dimensions.get("screen").height;
  const pan = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(pan, {
      toValue: 0,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_) => {},
      onPanResponderMove: (_, gestureState) => {
        const newY =
          gestureState.dy < 0 ? -Math.sqrt(-gestureState.dy) : gestureState.dy;

        Animated.event([null, { dy: pan }], {
          useNativeDriver: false,
        })(_, { dy: newY });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Dragging exceeds threshold, animate pane out of screen
          Animated.timing(pan, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else {
          // Dragging is less than threshold, animate pane back to the start position
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
            friction: 5,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.container, { height: SCREEN_HEIGHT }]}>
      <TouchableOpacity onPress={onPress}>
        <Animated.View
          style={[styles.card, { transform: [{ translateY: pan }] }]}
          {...panResponder.panHandlers}
        >
          <Text
            style={styles.title}
          >{`Hey, ${firstName}! Your ${restaurantName} bill is ready to be paid!`}</Text>
          <Text style={styles.body}>
            {`Your total portion of the bill is `}
            <Text
              style={{ fontFamily: "red-hat-bold" }}
            >{`$${dinerMealCost}`}</Text>
            <Text>
              {"\n"}
              {`Please pay primary diner `}
            </Text>

            <Text
              style={{ fontFamily: "red-hat-bold" }}
            >{`@${primaryDiner}.`}</Text>
          </Text>
          <Text style={styles.callToActionText}>👆🏾 Tap to pay & dismiss!</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // top: "50%",
    width: "100%",
    zIndex: 1000,
  },

  card: {
    backgroundColor: "#6f8bbb",
    borderRadius: 10,
    elevation: 5, // Elevation is for Android
    height: "auto",
    width: "auto",
    padding: 10,
    margin: 20,
    borderWidth: 2,
    borderColor: Colors.goDutchBlue,
    // Add shadow properties
    shadowColor: Colors.goDutchBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  title: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: "red-hat-bold",
  },
  body: {
    color: "black",
    fontSize: 18,
    fontFamily: "red-hat-normal",
    textAlign: "center",
  },
  callToActionText: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
    fontFamily: "red-hat-bold",
  },
});

export default FloatingNotificationCard;
