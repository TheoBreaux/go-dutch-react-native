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
    allReceiptItemsCopy: [],
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
    setEventIdForPrimary: (state, action) => {
      state.diners[0].event_id = action.payload;
    },
    setReceiptValues: (state, action) => {
      state.receiptValues = action.payload;
    },
    setAllReceiptItems: (state, action) => {
      state.allReceiptItems = action.payload;
      state.allReceiptItemsCopy = action.payload;
    },
    setDiners: (state, action) => {
      state.diners = action.payload;
    },
    returnRemovedDinerItem: (state, action) => {
      state.allReceiptItemsCopy.push(action.payload);
    },
    updateDinerItems: (state, action) => {
      state.diners[0].items = action.payload;
    },
    setDinerBillComplete: (state, action) => {
      state.diners[0].assignedItemsComplete = action.payload;
    },
    setNextDiner: (state, action) => {},
    // editReceiptItemInformation: (state, action) => {
    //   const { itemId, updateName, updatePrice } = action.payload;
    //   state.allReceiptItemsCopy = state.allReceiptItemsCopy.map((item) =>
    //     item.id === itemId
    //       ? { ...item, name: updateName, price: updatePrice }
    //       : item
    //   );
    // },
    assignAndRemoveFoodItem: (state, action) => {
      const { item, dinerId } = action.payload;

      // find the index of the item that has been dragged and dropped
      const index = state.allReceiptItems.findIndex((foodItem) => {
        return foodItem.id === item.id;
      });
      const diner = state.diners.find((diner) => diner.id === dinerId);

      // when found, remove it by filtering from the copy of the original all items array
      if (index !== -1 && diner) {
        diner.items.push(item);
        state.allReceiptItemsCopy = state.allReceiptItemsCopy.filter(
          (receiptItem) => receiptItem.id !== item.id
        );
      }
    },
    addDiner: (state, action) => {
      state.diners.push(action.payload);
    },
    clearDiners: (state, action) => {
      state.diners = [];
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
  setEventIdForPrimary,
  setReceiptValues,
  setAllReceiptItems,
  setDiners,
  returnRemovedDinerItem,
  updateDinerItems,
  setDinerBillComplete,
  setNextDiner,
  assignAndRemoveFoodItem,
  // editReceiptItemInformation,
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
