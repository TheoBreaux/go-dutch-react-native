import SignUpForm from "./components/SignUpForm";
import PaymentSources from "./components/PaymentSources";
import LogInForm from "./components/LogInForm";
import UserHomePage from "./components/UserHomePage";
import NewSplitForm from "./components/NewSplitForm";
import DiningEventHistory from "./components/DiningEventHistory";
import ImageLogs from "./components/ImageLogs";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Colors from "./constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import CustomIcon from "./components/CustomIcon";
import WelcomeScreen from "./components/WelcomeScreen";
import { Provider } from "react-redux";
import store from "./store/store";
import LogOutScreen from "./components/LogOutScreen";
import AddDiners from "./components/AddDiners";

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
      }}>
      <BottomTab.Screen
        name="Home"
        component={UserHomePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color="white" size={35} />
          ),
        }}
      />
      <BottomTab.Screen
        name="New Split"
        component={NewSplitForm}
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
        name="Image Logs"
        component={ImageLogs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images-outline" size={35} color="white" />
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
          initialRouteName="AddDiners" //change this back to welcome after developing
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpForm} />
          <Stack.Screen name="LogIn" component={LogInForm} />
          <Stack.Screen name="PaymentSources" component={PaymentSources} />
          <Stack.Screen name="AddDiners" component={AddDiners} />
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
