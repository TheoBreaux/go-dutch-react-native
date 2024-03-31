import Constants from "expo-constants";
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
import DiningEventDetailsScreen from "./screens/DiningEventDetailsScreen";
import FeaturedRestaurants from "./screens/FeaturedRestaurantsScreen";
import ConfirmFeeTotalsScreen from "./screens/ConfirmFeeTotalsScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ConfirmReceiptItemsScreen from "./screens/ConfirmReceiptItemsScreen";
import CheckCloseOutDetailsScreen from "./screens/CheckCloseOutDetailsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ViewUserProfileScreen from "./screens/ViewUserProfileScreen";
import RestaurantDetailsScreen from "./screens/RestaurantDetailsScreen";
import { useDisableBackButton } from "./utils";
import { StatusBar } from "react-native";
import FavoritesScreen from "./screens/FavoritesScreen";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const apiKey = Constants.expoConfig.extra.PG_API_KEY;

const MainTabNavigator = () => {
  //KEEP THIS HERE FOR NOW - SEEMS TO BE PREVENTING BACK BUTTON HARDWARE USE
  useDisableBackButton();
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.goDutchBlue,
          height: 60,
        },
        tabBarLabelStyle: {
          color: "white",
          fontFamily: "red-hat-normal",
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
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color="white" size={35} />
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
  //disable back button for android devices
  useDisableBackButton(); // Use the custom hook at the root level of your app

  const [fontsLoaded] = useFonts({
    "red-hat-bold": require("./fonts/RedHatDisplay-Bold.ttf"),
    "red-hat-normal": require("./fonts/RedHatDisplay-Regular.ttf"),
    stamper: require("./fonts/Stamper.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Can return a loading indicator here if needed
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content" // Set the status bar text color to light
          backgroundColor={Colors.goDutchBlue} // Set the status bar background color
        />
        <Stack.Navigator
          initialRouteName="Welcome" //change this back to "Welcome" after developing
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />

          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            initialParams={{ apiKey: apiKey }}
          />
          <Stack.Screen
            name="LogIn"
            component={LogInScreen}
            initialParams={{ apiKey: apiKey }}
          />

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
            name="DiningEventDetailsScreen"
            component={DiningEventDetailsScreen}
          />
          <Stack.Screen
            name="ConfirmFeeTotalsScreen"
            component={ConfirmFeeTotalsScreen}
          />
          <Stack.Screen
            name="CheckCloseOutDetailsScreen"
            component={CheckCloseOutDetailsScreen}
          />
          <Stack.Screen
            name="RestaurantDetailsScreen"
            component={RestaurantDetailsScreen}
          />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
          <Stack.Screen
            name="ViewUserProfileScreen"
            component={ViewUserProfileScreen}
          />
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            // options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
