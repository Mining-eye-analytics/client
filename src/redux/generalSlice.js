import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: localStorage.getItem("mode")
    ? localStorage.getItem("mode")
    : new Date().getHours() > 7 && new Date().getHours() < 18
    ? "light"
    : "dark",
  isPerimeterAreaConfigEnabled: true,
  isHdDistanceAdjustable: true,
  page: window.location.href.includes("database-deviasi")
    ? "database-deviasi"
    : window.location.href.includes("live-monitoring")
    ? "live-monitoring"
    : "validasi-notifikasi",
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("mode", action.payload);
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setMode, setPage } = generalSlice.actions;

export default generalSlice.reducer;
