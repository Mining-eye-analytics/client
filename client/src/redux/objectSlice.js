import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    { id: 1, name: "Semua Deviasi", value: "All" },
    { id: 2, name: "Person", value: "Person" },
    { id: 3, name: "LV", value: "LV" },
    { id: 4, name: "HD", value: "HD" },
    // { id: 5, name: "Perimeter_HD", value: "Perimeter_HD" },
  ],
  countingCrossingList: [
    { id: 1, name: "Semua Objek", value: "All" },
    { id: 2, name: "Car", value: "car" },
    { id: 3, name: "Motorcycle", value: "motorcycle" },
    { id: 4, name: "Bus", value: "bus" },
    { id: 5, name: "Truck", value: "truck" },
  ],
  current: "All",
  currentCountingCrossing: "All",
};

const objectSlice = createSlice({
  name: "object",
  initialState,
  reducers: {
    setCurrentObject: (state, action) => {
      state.current = action.payload;
    },
    setCurrentCountingCrossingObject: (state, action) => {
      state.currentCountingCrossing = action.payload;
    },
  },
});

export const { setCurrentObject, setCurrentCountingCrossingObject } =
  objectSlice.actions;

export default objectSlice.reducer;
