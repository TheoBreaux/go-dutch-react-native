import { StyleSheet, Text, PanResponder, Animated } from "react-native";
import Colors from "../../constants/colors";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignAndRemoveFoodItem } from "../../store/store";

const DinnerItem = ({ item, handleDrop }) => {
  const [showDinnerItem, setShowDinerItem] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const allReceiptItemsCopy = useSelector(
    (state) => state.diningEvent.allReceiptItemsCopy
  );

  const allReceiptItems = useSelector(
    (state) => state.diningEvent.allReceiptItems
  );

  const diners = useSelector((state) => state.diningEvent.diners);
  const dinerId = diners[0].id;
  const dispatch = useDispatch();

  console.log("DINERS BEFORE:", diners);
  console.log("ALL RECEIPT ITEMS COPY BEFORE DROP:", allReceiptItemsCopy);
  console.log("ALL RECEIPT ITEMS BEFORE DROP:", allReceiptItems);

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
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
        }).start(() => {
          setShowDinerItem(false);
          dispatch(assignAndRemoveFoodItem({ item, dinerId }));

          //i now need to move those removed items to the person that had thems items array
          // dispatch(addItemToDiner({ item, dinerId }));
          // handleDrop();
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

  console.log("DINERS AFTER:", diners);

  console.log("ALL RECEIPT ITEMS COPY AFTER DROP:", allReceiptItemsCopy);

  console.log("ALL RECEIPT ITEMS AFTER DROP", allReceiptItems);

  return (
    <>
      {showDinnerItem && (
        <Animated.View
          style={[
            panStyle,
            styles.itemContainer,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
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
