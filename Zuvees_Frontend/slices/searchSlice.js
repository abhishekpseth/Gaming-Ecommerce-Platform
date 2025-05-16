import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchInput: "",
  searchToggle: false,
};

export const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    setSearchInput: (state, action) => {
      state.searchInput = action.payload;
    },
    setSearchToggle: (state, action) => {
      state.searchToggle = action.payload;
    },
  },
});

export const { setSearchInput, setSearchToggle } = searchSlice.actions;
export default searchSlice.reducer;
