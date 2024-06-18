import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    { id: 1, name: "Semua Deviasi", value: "All" },
    { id: 2, name: "Person", value: "Person" },
    { id: 3, name: "LV", value: "LV" },
    { id: 4, name: "HD", value: "HD" },
  ],
  countingCrossingList: [
    { id: 1, name: "Semua Objek", value: "All" },
    { id: 2, name: "Person", value: "person" },
    { id: 3, name: "Car", value: "car" },
    { id: 4, name: "Motorcycle", value: "motorcycle" },
    { id: 5, name: "Bus", value: "bus" },
    { id: 6, name: "Truck", value: "truck" },
  ],
  current: "All",
  currentCountingCrossing: "All",
};

const objectSlice = createSlice({
  name: "object",
  initialState,
  reducers: {
    setAddPerimeterObject: (state, action) => {
      state.list.push(action.payload);
    },
    setCurrentObject: (state, action) => {
      state.current = action.payload;
    },
    setCurrentCountingCrossingObject: (state, action) => {
      state.currentCountingCrossing = action.payload;
    },
  },
});

export const { setAddPerimeterObject, setCurrentObject, setCurrentCountingCrossingObject } =
  objectSlice.actions;

export default objectSlice.reducer;
