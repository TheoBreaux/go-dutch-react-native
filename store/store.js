import { configureStore, createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    user: {},
    currentCity: "",
    restaurantList: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setRestaurantList: (state, action) => {
      state.restaurantList = action.payload;
    },
    logOut: (state) => {
      state.user = {};
    },
  },
});

const diningEventSlice = createSlice({
  name: "diningEvent",
  initialState: {
    event: {
      eventId: "",
      eventDate: "",
      selectedRestaurant: "",
      enteredSelectedRestaurant: "",
      eventTitle: "",
      primaryDinerUsername: "",
      tax: "",
      tip: "",
      totalMealCost: "",
    },
    receiptValues: {},
    diners: [],
  },
  reducers: {
    setDiningEvent: (state, action) => {
      state.event = action.payload;
    },
    setEventId: (state, action) => {
      state.event.eventId = action.payload;
    },
    setReceiptValues: (state, action) => {
      state.receiptValues = action.payload;
    },
    addDiner: (state, action) => {
      state.diners.push(action.payload);
    },
    removeDiner: (state, action) => {
      const index = state.diners.findIndex((diner) => {
        return diner.id === action.payload.id;
      });
      if (index !== -1) {
        state.event.diners.splice(index, 1);
      }
    },
  },
});

export const { setUser, setCurrentCity, setRestaurantList, logOut } =
  userInfoSlice.actions;

export const {
  setDiningEvent,
  setEventId,
  setReceiptValues,
  addDiner,
  removeDiner,
} = diningEventSlice.actions;

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    diningEvent: diningEventSlice.reducer,
  },
});

export default store;
