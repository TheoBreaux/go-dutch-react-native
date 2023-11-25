import { StyleSheet, Text, View } from "react-native";
import Logo from "./Logo";
import DinnerItem from "./ui/DinnerItem";
import { useSelector } from "react-redux";
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Colors from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const dinnerItems = [
  { count: 1, name: "Chocolate Cake", price: 25.95 },
  { count: 2, name: "Chicken Tacos", price: 5.95 },
  { count: 2, name: "Casamigos Blanco", price: 32.0 },
  { count: 1, name: "Mule", price: 20.0 },
];

//initialize array for seperate quantities of more than 1 into individual dinner items
const updatedDinnerItems = [];

dinnerItems.forEach((item) => {
  for (let i = 0; i < item.count; i++) {
    updatedDinnerItems.push({
      ...item,
      id: (Date.now() + Math.random() + item.name).toString(),
    });
  }
});

const AssignItems = () => {
  //grab values from redux store for use here, useSelector
  const receiptValues = useSelector((state) => state.diningEvent.receiptValues);
  console.log("IN ASSIGNITEMS - RECEIPT VALUES:", receiptValues);

  const pressed = useSharedValue(false);
  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      offset.value = event.translationY;
    })
    .onFinalize(() => {
      offset.value = withSpring(0);
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateY: offset.value },
      { scale: withTiming(pressed.value ? .750 : 1) },
    ],
    backgroundColor: pressed.value ? "#FFE04B" : "#b58df1",
  }));

  const renderItem = ({ item, drag, isActive, index }) => {
    const backgroundColor =
      index % 2 === 0 ? Colors.goDutchBlue : Colors.goDutchRed;

    return (
      <ScaleDecorator>
        <DinnerItem
          item={item}
          onLongPress={drag}
          isActive={isActive}
          backgroundColor={backgroundColor}
        />
      </ScaleDecorator>
    );
  };

  const handleDragEnd = () => {
    console.log("hello");
  };

  return (
    <>
      <Logo />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <NestableScrollContainer nestedScrollEnabled={true}>
            <View style={styles.dinerContainer}>
              <Text style={styles.title}>ORDERED ITEMS</Text>
              <NestableDraggableFlatList
                data={updatedDinnerItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onDragEnd={handleDragEnd}
              />
            </View>

            <View style={styles.center}>
              <GestureDetector gesture={pan}>
                <Animated.View
                  style={[styles.assignmentContainer, animatedStyles]}>
                  <MaterialCommunityIcons
                    name="face-man-profile"
                    size={100}
                    color={Colors.goDutchBlue}
                  />
                  <Text style={styles.diner}>Diners Name</Text>
                </Animated.View>
              </GestureDetector>
            </View>
          </NestableScrollContainer>
        </View>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  dinerContainer: {
    // borderWidth: 1,
    marginVertical: 5,
  },
  title: {
    fontFamily: "red-hat-bold",
    fontSize: 25,
    textAlign: "center",
  },
  center: {
    marginTop: 10,
    alignItems: "center",
    zIndex: 100,
  },
  assignmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  diner: { fontFamily: "red-hat-regular", fontSize: 25 },
});

export default AssignItems;
