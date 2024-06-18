import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../utils/customAxios";

const initialState = {
  list: [],
  loading: false,
  current: undefined,
  currentCctv: { id: 0 },
  currentObject: "All",
  currentCountingCrossingObject: "All",
  currentValidationStatus: "Tervalidasi",
  currentDate: [new Date(), new Date()],
  currentTime: ["00:01", "23:59"],
  timeFilter: false,
  tablePageDataLimit: 10,
  currentTablePage: 1,
};

export const getDeviationList = createAsyncThunk(
  "deviation/getDeviationList",
  async (arg, { getState }) => {
    const state = getState();

    return customAxios({
      method: "GET",
      url:
        "/deviations/" +
        (state.deviation.currentCctv.type_analytics !==
        "AnalyticsCountingCrossing"
          ? "v1"
          : "crossing-counting") +
        "?" +
        (state.deviation.currentCctv.id !== 0
          ? "cctv_id=" + state.deviation.currentCctv.id + "&"
          : "") +
        (state.deviation.currentObject !== "All"
          ? "type_object=" + state.deviation.currentObject + "&"
          : "") +
        (state.deviation.currentValidationStatus !== "All" &&
        state.deviation.currentCctv.type_analytics !==
          "AnalyticsCountingCrossing"
          ? "filter_notification=" +
            state.deviation.currentValidationStatus +
            "&"
          : "") +
        "startDate=" +
        (state.deviation.currentDate[0].getFullYear() +
          "-" +
          (state.deviation.currentDate[0].getMonth() + 1 < 10 ? "0" : "") +
          (state.deviation.currentDate[0].getMonth() + 1) +
          "-" +
          (state.deviation.currentDate[0].getDate() < 10 ? "0" : "") +
          state.deviation.currentDate[0].getDate()) +
        " " +
        (state.deviation.currentTime[0] !== null
          ? state.deviation.currentTime[0]
          : "00:01") +
        "&" +
        "endDate=" +
        (state.deviation.currentDate[1].getFullYear() +
          "-" +
          (state.deviation.currentDate[1].getMonth() + 1 < 10 ? "0" : "") +
          (state.deviation.currentDate[1].getMonth() + 1) +
          "-" +
          (state.deviation.currentDate[1].getDate() < 10 ? "0" : "") +
          state.deviation.currentDate[1].getDate()) +
        " " +
        (state.deviation.currentTime[1] !== null
          ? state.deviation.currentTime[1]
          : "23:59"),
    }).then((res) => res.data.data);
  }
);

const deviationSlice = createSlice({
  name: "deviation",
  initialState,
  reducers: {
    setCurrentDeviation: (state, action) => {
      state.current = action.payload;
    },
    setDeviationCurrentCctv: (state, action) => {
      state.currentCctv = action.payload;
    },
    setDeviationCurrentObject: (state, action) => {
      state.currentObject = action.payload;
    },
    setDeviationCurrentCountingCrossingObject: (state, action) => {
      state.currentCountingCrossingObject = action.payload;
    },
    setDeviationCurrentValidationStatus: (state, action) => {
      state.currentValidationStatus = action.payload;
    },
    setDeviationCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    setDeviationCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    enableTimeFilter: (state, action) => {
      state.timeFilter = action.payload;
    },
    setTablePageDataLimit: (state, action) => {
      state.tablePageDataLimit = action.payload;
    },
    setCurrentTablePage: (state, action) => {
      state.currentTablePage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDeviationList.pending, (state) => {
      state.list = [];
      state.loading = true;
    });
    builder.addCase(getDeviationList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload === null ? [] : action.payload;
    });
    builder.addCase(getDeviationList.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      console.log(action.error.message);
    });
  },
});

export const {
  setCurrentDeviation,
  setDeviationCurrentCctv,
  setDeviationCurrentObject,
  setDeviationCurrentCountingCrossingObject,
  setDeviationCurrentValidationStatus,
  setDeviationCurrentDate,
  setDeviationCurrentTime,
  enableTimeFilter,
  setTablePageDataLimit,
  setCurrentTablePage,
} = deviationSlice.actions;

export default deviationSlice.reducer;
