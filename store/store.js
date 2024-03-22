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
    updateUserInfo: (state, action) => {
      const {
        firstName,
        lastName,
        email,
        username,
        bio,
        favoriteCuisine,
        birthday,
        location,
        primaryPaymentSource,
        primaryPaymentSourceUsername,
        secondaryPaymentSource,
        secondaryPaymentSourceUsername,
      } = action.payload;

      const updatedUser = {
        ...state.user,
        firstName,
        lastName,
        email,
        username: username.toLowerCase(),
        bio,
        favoriteCuisine,
        birthday,
        location,
        primaryPaymentSource,
        primaryPaymentSourceUsername,
        secondaryPaymentSource,
        secondaryPaymentSourceUsername,
      };
      state.user = updatedUser;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setRestaurantList: (state, action) => {
      state.restaurantList = action.payload;
    },
    updateUserProfileImageKey: (state, action) => {
      const profileImageKey = action.payload;
      state.user.profileImageKey = profileImageKey;
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
      subtotal: "",
      totalMealCost: "",
      receiptImagePath: "",
    },
    currentDinerId: "",
    receiptValues: {},
    allReceiptItems: [],
    allReceiptItemsCopy: [],
    evenlySplitItems: [],
    diners: [],
    birthdayDiners: [],
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
      state.diners[0].eventId = action.payload;
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
    setBirthdayDiners: (state, action) => {
      state.birthdayDiners.push(action.payload);
    },
    setCurrentDinerId: (state, action) => {
      state.currentDinerId = action.payload;
    },
    setReceiptImagePath: (state, action) => {
      state.event.receiptImageKey = action.payload;
    },
    updateSubtotal: (state, action) => {
      const subtotal = action.payload;
      state.event.subtotal = subtotal;
    },
    returnRemovedDinerItem: (state, action) => {
      state.allReceiptItemsCopy.push(action.payload);
    },
    updateDinerItems: (state, action) => {
      const { currentDinerIndex, updatedReviewedItems } = action.payload;

      state.diners[currentDinerIndex].items = updatedReviewedItems;
    },
    updateFinalDiningEventValues: (state, action) => {
      const { tax, tip, totalMealCost } = action.payload;

      state.event.tax = tax;
      state.event.tip = tip;
      state.event.totalMealCost = totalMealCost.toFixed(2).toString();
    },
    updateDinerProfileImageKey: (state, action) => {
      const profileImageKey = action.payload;
      //LOOG AT THIS IF HTERE ARE ISSUES
      state.diners[0].profileImageKey = profileImageKey;
    },
    updateBirthdayDinerFinalMealCost: (state, action) => {
      const updatedDinerInfo = action.payload.dinerMealCosts;

      const updatedArray = state.diners.map((diner) => {
        const updatedDiner = updatedDinerInfo.find(
          (updatedDiner) =>
            updatedDiner.additionalDinerUsername ===
            diner.additionalDinerUsername
        );

        if (updatedDiner) {
          return {
            ...diner,
            dinerMealCost: updatedDiner.dinerMealCost,
          };
        }
        return diner;
      });

      // Ensure to return the updated state object
      return {
        ...state,
        diners: updatedArray,
      };
    },
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
        (diner) => diner.additionalDinerUsername === action.payload.username
      );

      if (dinerToUpdate) {
        dinerToUpdate.celebratingBirthday = action.payload.celebratingBirthday;
      }
    },

    addToEvenlySplitItems: (state, action) => {
      const { item } = action.payload;
      //get index of item added to array
      const itemIndex = state.evenlySplitItems.findIndex((foodItem) => {
        return foodItem.id === item.id;
      });

      //if the item is not in the array, put it in
      if (itemIndex === -1) {
        state.evenlySplitItems.push(item);
      } else {
        // if it is in the array filter it out from the array
        state.evenlySplitItems = state.evenlySplitItems.filter(
          (splitItem) => splitItem.id !== item.id
        );
      }
    },
  },
});

export const {
  setUser,
  setCurrentCity,
  setRestaurantList,
  updateUserProfileImageKey,
  updateUserInfo,
  logOut,
} = userInfoSlice.actions;

export const {
  setDiningEvent,
  setInitialPrimaryDiner,
  setEventId,
  setEventIdForPrimary,
  setReceiptValues,
  setReceiptImagePath,
  setAllReceiptItems,
  setDiners,
  setBirthdayDiners,
  setCurrentDinerId,
  returnRemovedDinerItem,
  updateDinerItems,
  assignAndRemoveFoodItem,
  addDiner,
  removeDiner,
  updateBirthdayStatus,
  updateSubtotal,
  updateBirthdayDinerBill,
  updateFinalDiningEventValues,
  updateBirthdayDinerFinalMealCost,
  updateDinerProfileImageKey,
  addToEvenlySplitItems,
} = diningEventSlice.actions;

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    diningEvent: diningEventSlice.reducer,
  },
});

export default store;
