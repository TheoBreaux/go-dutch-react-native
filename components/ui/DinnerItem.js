import { StyleSheet, Text, View, PanResponder, Animated } from "react-native";
import Colors from "../../constants/colors";
import { useRef } from "react";
import { useState } from "react";

const DinnerItem = ({
  item,
  handleDrop,
  separatedDinnerItems,
  setFoodItems,
  foodItems,
}) => {
  const [showDinnerItem, setShowDinerItem] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  let val = { x: 0, y: 0 };
  pan.addListener((value) => (val = value));

  // const assignedAndRemoved = (item) => {
  //     const index = foodItems.indexOf(item);
  //   if (index !== -1) {
  //     const updatedSeparatedDinnerItems = [...separatedDinnerItems];
  //     updatedSeparatedDinnerItems.splice(index, 1);
  //     setFoodItems(updatedSeparatedDinnerItems);
  //   }
  // };

  console.log("FOOD ITEMS:", foodItems.length);

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
        }).start(() => setShowDinerItem(false));
        //cause icon to move or something
        handleDrop();
        //item needs to be removed from array and assigned to the diner
        // assignedAndRemoved();
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
