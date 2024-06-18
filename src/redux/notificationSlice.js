import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../utils/customAxios";

const initialState = {
  list: [],
  loading: false,
  current: undefined,
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

    return customAxios({
      method: "GET",
      url:
        "/deviations/v2?" +
        (state.cctv.current.id !== 0
          ? "cctv_id=" + state.cctv.current.id + "&"
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
    }).then((res) => res.data.data);
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
    showNotificationChild: (state, action) => {
      state.showedChild = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotificationList.pending, (state) => {
      state.loading = true;
      state.list = [];
    });
    builder.addCase(getNotificationList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload === null ? [] : action.payload;
      if (state.current === undefined && state.list.length > 0) {
        state.current = state.list[0];
      }
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
  setNotificationCurrentObject,
  setNotificationCurrentValidationStatus,
  setNotificationLimit,
  submitValidation,
  reloadNotification,
  activateAlarmSound,
  showAlarmPopup,
  addNotificationChild,
  showNotificationChild,
} = notificationSlice.actions;

export default notificationSlice.reducer;
