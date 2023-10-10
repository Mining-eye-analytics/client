import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    { id: 1, name: "Semua Status", value: "All" },
    { id: 2, name: "Belum Divalidasi", value: "Perlu Validasi" },
    { id: 3, name: "Sudah Divalidasi", value: "Tervalidasi" },
    { id: 4, name: "Valid", value: "true" },
    { id: 5, name: "Tidak Valid", value: "false" },
  ],
  current: "All",
};

const validationStatusSlice = createSlice({
  name: "validationStatus",
  initialState,
  reducers: {
    setCurrentValidationStatus: (state, action) => {
      state.current = action.payload;
    },
  },
});

export const { setCurrentValidationStatus } = validationStatusSlice.actions;

export default validationStatusSlice.reducer;
