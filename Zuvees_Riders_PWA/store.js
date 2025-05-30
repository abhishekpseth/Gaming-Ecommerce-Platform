import { configureStore } from "@reduxjs/toolkit";

import notificationSlice from "./slices/notificationSlice";

const reducer = {
  notificationSlice,
};

const store = configureStore({
  reducer,
  //   devTools: process.env.NODE_ENV !== "production",
});

export default store;
