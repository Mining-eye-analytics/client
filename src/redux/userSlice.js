import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../utils/customAxios";

const initialState = {
  list: [],
  loading: false,
};

export const getUserList = createAsyncThunk("user/getUserList", () => {
  return customAxios({ method: "GET", url: "/users" }).then(
    (res) => res.data.data
  );
});

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getUserList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(getUserList.rejected, (state, action) => {
      state.loading = false;
      if (action.error.message.includes("401")) {
        localStorage.clear();
        window.location.reload();
      }
      console.log(action.error.message);
    });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
