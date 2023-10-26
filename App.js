import { NativeRouter, Route, Routes } from "react-router-native";
import SignUpForm from "./components/SignUpForm";
import PaymentSources from "./components/PaymentSources";
import LogInForm from "./components/LogInForm";
import UserHomePage from "./components/UserHomePage";
import NewSplitForm from "./components/NewSplitForm";
import AddDiners from "./components/AddDiners";
import DiningEventHistory from "./components/DiningEventHistory";
import ImageLogs from "./components/ImageLogs";
import SignUpLogIn from "./components/SignUpLogIn";

const App = () => {
  return (
    <>
      {/* <SignUpLogIn /> */}
      {/* <LogInForm /> */}
      <SignUpForm/>
    </>
    // <NativeRouter>
    //   <Routes>
    //     <Route exact path="/" component={LogInSignUp} />
    //     <Route path="/signup" component={SignUpForm} />
    //     <Route path="/payment-sources" component={PaymentSources} />
    //     <Route path="/login" component={LogInForm} />
    //     <Route path="/user-home" component={UserHomePage} />
    //     <Route path="/new-split" component={NewSplitForm} />
    //     <Route path="/add-diners" component={AddDiners} />
    //     <Route path="/dining-history" component={DiningEventHistory} />
    //     <Route path="/image-logs" component={ImageLogs} />
    //   </Routes>
    // </NativeRouter>
  );
};

export default App;
