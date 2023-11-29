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
    allReceiptItems: [],
    diners: [],
  },
  reducers: {
    setInitialPrimaryDiner: (state, action) => {
      state.diners.push(action.payload);
    },
    setDiningEvent: (state, action) => {
      state.event = action.payload;
    },
    setEventId: (state, action) => {
      state.event.eventId = action.payload;
    },
    setReceiptValues: (state, action) => {
      state.receiptValues = action.payload;
    },
    setAllReceiptItems: (state, action) => {
      state.allReceiptItems = action.payload;
    },
    assignAndRemoveFoodItem: (state, action) => {
      const index = state.allReceiptItems.findIndex((foodItem) => {
        return foodItem.id === action.payload.id;
      });
      if (index !== -1) {
        state.allReceiptItems.splice(index, 1);
      }
    },
    addDiner: (state, action) => {
      state.diners.push(action.payload);
    },
    clearDiners: (state, action) => {
      state.diners = [];
    },
    updateDiners: (state, action) => {
      state.diners = action.payload;
    },
    removeDiner: (state, action) => {
      const index = state.diners.findIndex((diner) => {
        return diner.id === action.payload.id;
      });
      if (index !== -1) {
        state.diners.splice(index, 1);
      }
    },
    updateBirthdayStatus: (state, action) => {
      const dinerToUpdate = state.diners.find(
        (diner) => diner.additional_diner_username === action.payload.username
      );

      if (dinerToUpdate) {
        dinerToUpdate.birthday = action.payload.birthday;
      }
    },
  },
});

export const { setUser, setCurrentCity, setRestaurantList, logOut } =
  userInfoSlice.actions;

export const {
  setDiningEvent,
  setInitialPrimaryDiner,
  setEventId,
  setReceiptValues,
  setAllReceiptItems,
  assignAndRemoveFoodItem,
  updateDiners,
  addDiner,
  removeDiner,
  updateBirthdayStatus,
} = diningEventSlice.actions;

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    diningEvent: diningEventSlice.reducer,
  },
});

export default store;
