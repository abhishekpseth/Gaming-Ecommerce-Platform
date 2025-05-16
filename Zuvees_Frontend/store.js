import { configureStore } from "@reduxjs/toolkit";

import searchSlice from "./slices/searchSlice";
import notificationSlice from "./slices/notificationSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";

const reducer = {
  searchSlice,
  notificationSlice,
  cartSlice,
  userSlice
};

const store = configureStore({
  reducer,
  //   devTools: process.env.NODE_ENV !== "production",
});

export default store;
