import { configureStore, createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    user: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = {};
    },
  },
});

export const { setUser, logOut } = userInfoSlice.actions;

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
  },
});

export default store;
