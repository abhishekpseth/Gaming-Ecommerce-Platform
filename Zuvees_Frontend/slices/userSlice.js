import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressObject: null
};

export const userSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    setAddressObject: (state, action) => {
      state.addressObject = action.payload;
    },
  },
});

export const { setAddressObject } = userSlice.actions;
export default userSlice.reducer;
