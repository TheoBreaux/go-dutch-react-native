import PaymentSourcesInputScreen from "./screens/PaymentSourcesInputScreen";
import LogInScreen from "./screens/LogInScreen";
import HomePageScreen from "./screens/HomePageScreen";
import CreateNewSplitScreen from "./screens/CreateNewSplitScreen";
import DiningEventHistory from "./screens/DiningEventHistoryScreen";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Colors from "./constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import CustomIcon from "./components/CustomIcon";
import { Provider } from "react-redux";
import store from "./store/store";
import LogOutScreen from "./screens/LogOutScreen";
import AddDinersScreen from "./screens/AddDinersScreen";
import AssignItemsArea from "./ui/AssignItemsArea";
import DiningEventDetails from "./components/DiningEventDetails";
import FeaturedRestaurants from "./screens/FeaturedRestaurantsScreen";
import ReceiptCapture from "./ui/ReceiptCapture";
import ConfirmFeeTotalsScreen from "./screens/ConfirmFeeTotalsScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ConfirmReceiptItemsScreen from "./screens/ConfirmReceiptItemsScreen";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "black",
          height: 60,
        },
        tabBarLabelStyle: {
          color: "white",
          fontFamily: "red-hat-regular",
          fontSize: 13,
        },
        tabBarActiveBackgroundColor: Colors.goDutchRed,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomePageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color="white" size={35} />
          ),
        }}
      />
      <BottomTab.Screen
        name="New Split"
        component={CreateNewSplitScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CustomIcon color="white" size={35} />
          ),
        }}
      />
      <BottomTab.Screen
        name="History"
        component={DiningEventHistory}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="history" size={35} color="white" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Restaurants"
        component={FeaturedRestaurants}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={35} color="white" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Log Out"
        component={LogOutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="log-out" size={35} color="white" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const App = () => {
  const [fontsLoaded] = useFonts({
    "red-hat-bold": require("./fonts/RedHatDisplay-Bold.ttf"),
    "red-hat-regular": require("./fonts/RedHatDisplay-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Can return a loading indicator here if needed
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome" //change this back to "Welcome" after developing
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="LogIn" component={LogInScreen} />
          <Stack.Screen
            name="PaymentSourcesInputScreen"
            component={PaymentSourcesInputScreen}
          />
          <Stack.Screen name="AddDinersScreen" component={AddDinersScreen} />
          <Stack.Screen name="AssignItemsArea" component={AssignItemsArea} />
          <Stack.Screen
            name="ConfirmReceiptItemsScreen"
            component={ConfirmReceiptItemsScreen}
          />
          <Stack.Screen name="History" component={DiningEventHistory} />
          <Stack.Screen
            name="DiningEventDetails"
            component={DiningEventDetails}
          />
          <Stack.Screen
            name="ConfirmFeeTotalsScreen"
            component={ConfirmFeeTotalsScreen}
          />
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
