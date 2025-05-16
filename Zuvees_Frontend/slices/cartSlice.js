import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartSize: 0,
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    setCartSize: (state, action) => {
      state.cartSize = action.payload;
    },
  },
});

export const { setCartSize } = cartSlice.actions;
export default cartSlice.reducer;
