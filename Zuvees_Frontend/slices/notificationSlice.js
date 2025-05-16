import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    Notification: (state, action) => {
      if (typeof action.payload === "object") {
        state.notifications.push({
          id: nanoid(),
          type: action.payload.type,
          label: action.payload.label,
        });
      }
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (prev) => prev.id !== action.payload
      );
    },
  },
});

export const { Notification, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
