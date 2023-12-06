import { StyleSheet, Text, PanResponder, Animated } from "react-native";
import Colors from "../../constants/colors";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignAndRemoveFoodItem } from "../../store/store";
import { Easing } from "react-native-reanimated";

const DinnerItem = ({ item, handleDrop, updatedDiners, setAddedToDiner }) => {
  const [showDinnerItem, setShowDinnerItem] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const opacity = useRef(new Animated.Value(1)).current;

  const allReceiptItemsCopy = useSelector(
    (state) => state.diningEvent.allReceiptItemsCopy
  );

  const allReceiptItems = useSelector(
    (state) => state.diningEvent.allReceiptItems
  );

  const diners = useSelector((state) => state.diningEvent.diners);
  const dinerId = updatedDiners[0].id;
  const dispatch = useDispatch();

  console.log("DINERS BEFORE:", diners);
  console.log("ALL RECEIPT ITEMS COPY BEFORE DROP:", allReceiptItemsCopy);

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
          dispatch(assignAndRemoveFoodItem({ item, dinerId }));
          setShowDinnerItem(false);
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
      return gesture.moveY < 300;
    },
  });

  const isDropArea = (gesture) => gesture.moveY < 300;

  const panStyle = {
    transform: pan.getTranslateTransform(),
  };

  const interpolatedRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  console.log("DINERS AFTER:", diners);
  console.log("UPDATED DINERS IN DINNER ITEM:", updatedDiners);
  console.log("ALL RECEIPT ITEMS COPY AFTER DROP:", allReceiptItemsCopy);

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
            },
          ]}
          {...panResponder.panHandlers}>
          <Text style={styles.foodInfo}>{item.name}</Text>
          <Text style={styles.foodInfo}>${item.price.toFixed(2)}</Text>
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
    height: 50,
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.goDutchRed,
    margin: 1,
  },
  foodInfo: {
    fontFamily: "red-hat-bold",
    fontSize: 20,
    color: "white",
  },
});

export default DinnerItem;
