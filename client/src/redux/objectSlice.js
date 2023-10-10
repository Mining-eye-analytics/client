import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    { id: 1, name: "Semua Deviasi", value: "All" },
    { id: 2, name: "Person", value: "Person" },
    { id: 3, name: "LV", value: "LV" },
    { id: 4, name: "HD", value: "HD" },
    // { id: 5, name: "Perimeter_HD", value: "Perimeter_HD" },
  ],
  current: "All",
};

const objectSlice = createSlice({
  name: "object",
  initialState,
  reducers: {
    setCurrentObject: (state, action) => {
      state.current = action.payload;
    },
  },
});

export const { setCurrentObject } = objectSlice.actions;

export default objectSlice.reducer;
