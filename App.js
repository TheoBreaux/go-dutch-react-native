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
import { NavigationContainer } from "@react-navigation/native";
// import { SplashScreen } from "expo-splash-screen";
// import { useEffect } from "react";

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    "red-hat-bold": require("./fonts/RedHatDisplay-Bold.ttf"),
    "red-hat-regular": require("./fonts/RedHatDisplay-Regular.ttf"),
  });

  // useEffect(() => {
  //   const prepare = async () => {
  //     await SplashScreen.preventAutoHideAsync();

  //     await Font.loadAsync({
  //       "red-hat-bold": require("./fonts/RedHatDisplay-Bold.ttf"),
  //       "red-hat-regular": require("./fonts/RedHatDisplay-Regular.ttf"),
  //     });
  //     SplashScreen.hideAsync();
  //   };
  //   prepare();
  // }, []);

  if (!fontsLoaded) {
    return null; //can return loading indicator here if wanted
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUpLogIn">
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
          name="UserHomePage"
          component={UserHomePage}
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
        <Stack.Screen
          name="DiningEventHistory"
          component={DiningEventHistory}
        />
        <Stack.Screen name="ImageLogs" component={ImageLogs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
