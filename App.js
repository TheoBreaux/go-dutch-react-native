import SignUpForm from "./components/SignUpForm";
import PaymentSources from "./components/PaymentSources";
import LogInForm from "./components/LogInForm";
import UserHomePage from "./components/UserHomePage";
import NewSplitForm from "./components/NewSplitForm";
import AddDiners from "./components/AddDiners";
import DiningEventHistory from "./components/DiningEventHistory";
import ImageLogs from "./components/ImageLogs";
import SignUpLogIn from "./components/SignUpLogIn";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Colors from "./constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import CustomIcon from "./components/CustomIcon";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="UserHomePage"
      component={UserHomePage}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SignUpLogIn"
      component={SignUpLogIn}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpForm}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PaymentSources"
      component={PaymentSources}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="LogIn"
      component={LogInForm}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NewSplitForm"
      component={NewSplitForm}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddDiners"
      component={AddDiners}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="DiningEventHistory" component={DiningEventHistory} />
    <Stack.Screen name="ImageLogs" component={ImageLogs} />
  </Stack.Navigator>
);

const App = () => {
  const [fontsLoaded] = useFonts({
    "red-hat-bold": require("./fonts/RedHatDisplay-Bold.ttf"),
    "red-hat-regular": require("./fonts/RedHatDisplay-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Can return a loading indicator here if needed
  }

  return (
    <NavigationContainer>
      <BottomTab.Navigator
        screenOptions={{
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
          component={StackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color="white" size={30} />
            ),
            headerShown: false,
          }}
        />
        <BottomTab.Screen
          name="New Split"
          component={NewSplitForm}
          options={{
            tabBarIcon: ({ color, size }) => (
              <CustomIcon color="white" size={35} />
            ),
            headerShown: false,
          }}
        />
        <BottomTab.Screen
          name="History"
          component={DiningEventHistory}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="history" size={30} color="white" />
            ),
            headerShown: false,
          }}
        />
        <BottomTab.Screen
          name="Image Logs"
          component={ImageLogs}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images-outline" size={30} color="white" />
            ),
            headerShown: false,
          }}
        />
        <BottomTab.Screen
          name="Log Out"
          component={ImageLogs}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Entypo name="log-out" size={30} color="white" />
            ),
            headerShown: false,
          }}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
};

export default App;
