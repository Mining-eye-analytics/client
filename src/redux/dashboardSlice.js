import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../utils/customAxios";
import dayjs from "dayjs";

const initialState = {
  currentCctv: { id: 0 },
  currentDate: [new Date(dayjs().subtract(6, "day")), new Date(dayjs())],
};

// export const getDeviationList = createAsyncThunk(
//   "deviation/getDeviationList",
//   async (arg, { getState }) => {
//     const state = getState();

//     return customAxios({
//       method: "GET",
//       url:
//         "/deviations/" +
//         (state.deviation.currentCctv.type_analytics !==
//         "AnalyticsCountingCrossing"
//           ? "v1"
//           : "crossing-counting") +
//         "?" +
//         (state.deviation.currentCctv.id !== 0
//           ? "cctv_id=" + state.deviation.currentCctv.id + "&"
//           : "") +
//         (state.deviation.currentObject !== "All"
//           ? "type_object=" + state.deviation.currentObject + "&"
//           : "") +
//         (state.deviation.currentValidationStatus !== "All" &&
//         state.deviation.currentCctv.type_analytics !==
//           "AnalyticsCountingCrossing"
//           ? "filter_notification=" +
//             state.deviation.currentValidationStatus +
//             "&"
//           : "") +
//         "startDate=" +
//         (state.deviation.currentDate[0].getFullYear() +
//           "-" +
//           (state.deviation.currentDate[0].getMonth() + 1 < 10 ? "0" : "") +
//           (state.deviation.currentDate[0].getMonth() + 1) +
//           "-" +
//           (state.deviation.currentDate[0].getDate() < 10 ? "0" : "") +
//           state.deviation.currentDate[0].getDate()) +
//         " " +
//         (state.deviation.currentTime[0] !== null
//           ? state.deviation.currentTime[0]
//           : "00:01") +
//         "&" +
//         "endDate=" +
//         (state.deviation.currentDate[1].getFullYear() +
//           "-" +
//           (state.deviation.currentDate[1].getMonth() + 1 < 10 ? "0" : "") +
//           (state.deviation.currentDate[1].getMonth() + 1) +
//           "-" +
//           (state.deviation.currentDate[1].getDate() < 10 ? "0" : "") +
//           state.deviation.currentDate[1].getDate()) +
//         " " +
//         (state.deviation.currentTime[1] !== null
//           ? state.deviation.currentTime[1]
//           : "23:59"),
//     }).then((res) => res.data.data);
//   }
// );

const dashboardSlice = createSlice({
  name: "deviation",
  initialState,
  reducers: {
    setDashboardCurrentCctv: (state, action) => {
      state.currentCctv = action.payload;
    },
    setDashboardCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(getDeviationList.pending, (state) => {
    //   state.list = [];
    //   state.loading = true;
    // });
    // builder.addCase(getDeviationList.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.list = action.payload === null ? [] : action.payload;
    // });
    // builder.addCase(getDeviationList.rejected, (state, action) => {
    //   state.loading = false;
    //   state.list = [];
    //   console.log(action.error.message);
    // });
  },
});

export const { setDashboardCurrentCctv, setDashboardCurrentDate } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
