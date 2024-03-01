import {
  StyleSheet,
  Text,
  PanResponder,
  Animated,
  Image,
  View,
} from "react-native";
import Colors from "../constants/colors";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignAndRemoveFoodItem } from "../store/store";
import { Easing } from "react-native-reanimated";

const DinnerItem = ({ item, updatedDiners }) => {
  const [showDinnerItem, setShowDinnerItem] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const dinerId = useSelector((state) => state.diningEvent.currentDinerId);

  const dispatch = useDispatch();

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
          <Text style={[styles.foodInfo, { color: itemTextColor }]}>{item.name}</Text>
          <Text style={[styles.foodInfo, { color: itemTextColor }]}>${item.price.toFixed(2)}</Text>

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
    height: 40,
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.goDutchRed,
    margin: 1,
  },
  handImageContainer: {
    position: "absolute",
    top: 40,
    left: "40%",
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
  foodInfo: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
  },
});

export default DinnerItem;
