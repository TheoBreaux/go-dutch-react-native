import {
  StyleSheet,
  Text,
  PanResponder,
  Animated,
  Image,
  View,
  Switch,
} from "react-native";
import Colors from "../constants/colors";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToEvenlySplitItems, assignAndRemoveFoodItem } from "../store/store";
import { Easing } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const DinnerItem = ({ item }) => {
  const [showDinnerItem, setShowDinnerItem] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const dinerId = useSelector((state) => state.diningEvent.currentDinerId);

  const dispatch = useDispatch();

  const evenlySplitItemsToggle = () => {
    dispatch(addToEvenlySplitItems({ item }));
    setIsChecked((previousState) => !previousState);
  };

  let val = { x: 0, y: 0 };
  pan.addListener((value) => (val = value));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gesture) => {
      pan.setOffset({
        x: val.x,
        y: val.y,
      });
      pan.setValue({ x: 0, y: 0 });
      setIsDragging(true); // Set dragging state to true when dragging starts
    },
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: pan.x,
          dy: pan.y,
        },
      ],
      {
        useNativeDriver: false,
      }
    ),
    onPanResponderRelease: (e, gesture) => {
      setIsDragging(false); // Set dragging state to false when dragging ends

      if (isDropArea(gesture)) {
        Animated.sequence([
          // 360-degree spin animation
          Animated.timing(rotation, {
            toValue: 2, // Number of spins
            duration: 400, // Duration for one spin
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          // Shrink the item
          Animated.timing(scaleValue, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: false,
          }),
          // Then run parallel animations for translation and further scaling
          Animated.parallel([
            Animated.timing(pan.x, {
              toValue: 500,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(scaleValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]),
        ]).start(() => {
          setShowDinnerItem(false);
          dispatch(assignAndRemoveFoodItem({ item, dinerId }));
        });
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 3,
          useNativeDriver: false,
        }).start();
      }
    },
    isDropArea(gesture) {
      return gesture.moveY < 400;
    },
  });

  const isDropArea = (gesture) => gesture.moveY < 400;

  const panStyle = {
    transform: pan.getTranslateTransform(),
  };

  const interpolatedRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const itemBackgroundColor = isDragging ? "white" : Colors.goDutchRed;
  const itemTextColor = isDragging ? Colors.goDutchRed : "white";
  const strikeThroughText = {
    textDecorationLine: isChecked ? "line-through" : "none",
  };

  return (
    <>
      {showDinnerItem && (
        <Animated.View
          style={[
            panStyle,
            styles.itemContainer,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: scaleValue },
                { rotate: interpolatedRotation },
              ],
              backgroundColor: itemBackgroundColor,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.splitEvenlyText, { color: itemTextColor }]}>
              Share
            </Text>

            <View style={styles.switch}>
              <Text>
                {isChecked ? (
                  <Ionicons name="checkmark-sharp" size={25} color="white" />
                ) : (
                  ""
                )}
              </Text>

              <Switch
                trackColor={{ false: "#767577", true: Colors.goDutchBlue }}
                thumbColor={isChecked ? "#b9afb0" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={evenlySplitItemsToggle}
                value={isChecked}
              />
            </View>
          </View>

          <Text
            style={[
              styles.foodInfo,
              strikeThroughText,
              { color: itemTextColor },
            ]}
          >
            {item.name}
          </Text>

          <Text
            style={[
              styles.foodInfo,
              strikeThroughText,
              { color: itemTextColor, textAlign: "right" },
            ]}
          >
            ${item.price.toFixed(2)}
          </Text>

          {/* Hand image overlay */}
          {isDragging && (
            <View style={styles.handImageContainer}>
              <Image
                source={require("../assets/draggable-hand-overlay.png")}
                style={styles.handImage}
              />
            </View>
          )}
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    margin: 1,
    borderRadius: 10,
    backgroundColor: Colors.goDutchRed,
    elevation: 2,
    width: "100%",
    height: 45,
  },
  handImageContainer: {
    position: "absolute",
    top: 50,
    left: -150,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  handImage: {
    width: 50,
    height: 100,
    resizeMode: "cover",
    transform: [{ rotate: "45deg" }],
  },
  splitEvenlyText: {
    fontFamily: "red-hat-bold",
    marginRight: 5,
  },
  switch: { flexDirection: "row", alignItems: "center" },
  foodInfo: {
    fontFamily: "red-hat-bold",
    fontSize: 18,
  },
});

export default DinnerItem;
{
  /* <Ionicons name="checkmark-sharp" size={30} color="white" /> */
}
