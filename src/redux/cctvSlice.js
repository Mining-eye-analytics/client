import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../utils/customAxios";

const initialState = {
  list: [],
  loading: false,
  current: { id: 0 },
  deviationIndicatedCctv: [],
};

export const getCctvList = createAsyncThunk("cctv/getCctvList", () => {
  return customAxios({ method: "GET", url: "/cctvs" }).then(
    (res) => res.data.data
  );
});

const cctvSlice = createSlice({
  name: "cctv",
  initialState,
  reducers: {
    setCurrentCctv: (state, action) => {
      state.current = action.payload;
    },
    addDeviationIndicatedCctv: (state, action) => {
      state.deviationIndicatedCctv = [
        action.payload,
        ...state.deviationIndicatedCctv,
      ];
    },
    deleteDeviationIndicatedCctv: (state, action) => {
      state.deviationIndicatedCctv = state.deviationIndicatedCctv.filter(
        (data) => data !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCctvList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCctvList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(getCctvList.rejected, (state, action) => {
      state.loading = false;
      console.log(action.error.message);
    });
  },
});

export const {
  setCurrentCctv,
  addDeviationIndicatedCctv,
  deleteDeviationIndicatedCctv,
} = cctvSlice.actions;

export default cctvSlice.reducer;
