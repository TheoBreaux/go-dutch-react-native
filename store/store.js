import { configureStore, createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    user: {},
    currentCity: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    logOut: (state) => {
      state.user = {};
    },
  },
});

export const { setUser, setCurrentCity, logOut } = userInfoSlice.actions;

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
  },
});

export default store;
