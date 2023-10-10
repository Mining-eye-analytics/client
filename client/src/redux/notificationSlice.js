import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  list: [],
  loading: false,
  current: undefined,
  currentCctv: 0,
  currentObject: "All",
  currentValidationStatus: "All",
  limit: 10,
  submit: false,
  reload: false,
  alarmSound: false,
  alarmPopup: true,
  childList: [],
  showedChild: undefined,
};

export const getNotificationList = createAsyncThunk(
  "notification/getNotificationList",
  async (arg, { getState }) => {
    const state = getState();

    return axios
      .get(
        window.location.protocol +
          "//" +
          (window.location.hostname === "localhost"
            ? "10.10.10.66"
            : window.location.hostname) +
          ":" +
          process.env.REACT_APP_API_PORT +
          "/api/deviation?" +
          (state.notification.currentCctv !== 0
            ? "cctv_id=" + state.notification.currentCctv + "&"
            : "") +
          (state.notification.currentObject !== "All"
            ? "type_object=" + state.notification.currentObject + "&"
            : "") +
          (state.notification.currentValidationStatus !== "All"
            ? "filter_notification=" +
              state.notification.currentValidationStatus +
              "&"
            : "") +
          "limit=" +
          (state.notification.limit + 1),
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => res.data.data);
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addSocketNotification: (state, action) => {
      state.list = [action.payload, ...state.list];
    },
    setCurrentNotification: (state, action) => {
      state.current = action.payload;
    },
    setNotificationCurrentCctv: (state, action) => {
      state.currentCctv = action.payload;
    },
    setNotificationCurrentObject: (state, action) => {
      state.currentObject = action.payload;
    },
    setNotificationCurrentValidationStatus: (state, action) => {
      state.currentValidationStatus = action.payload;
    },
    setNotificationLimit: (state, action) => {
      state.limit = action.payload;
    },
    submitValidation: (state, action) => {
      state.submit = action.payload;
    },
    reloadNotification: (state, action) => {
      state.reload = action.payload;
    },
    activateAlarmSound: (state, action) => {
      state.alarmSound = action.payload;
    },
    showAlarmPopup: (state, action) => {
      state.alarmPopup = action.payload;
    },
    addNotificationChild: (state, action) => {
      state.childList = [...state.childList, action.payload];
    },
    addNotificationChildUnique: (state, action) => {
      state.childList = [action.payload, ...state.childList];
    },
    showNotificationChild: (state, action) => {
      state.showedChild = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotificationList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNotificationList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
      state.current = action.payload[0];
    });
    builder.addCase(getNotificationList.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      console.log(action.error.message);
    });
  },
});

export const {
  addSocketNotification,
  setCurrentNotification,
  setNotificationCurrentCctv,
  setNotificationCurrentObject,
  setNotificationCurrentValidationStatus,
  setNotificationLimit,
  submitValidation,
  reloadNotification,
  activateAlarmSound,
  showAlarmPopup,
  addNotificationChild,
  addNotificationChildUnique,
  showNotificationChild,
} = notificationSlice.actions;

export default notificationSlice.reducer;
