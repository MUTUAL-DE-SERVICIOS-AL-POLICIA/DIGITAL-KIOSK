import { createSlice } from "@reduxjs/toolkit";

export const ecoComSlice = createSlice({
  name: "ecoCom",
  initialState: {
    checkSemesters: <any>undefined,
  },
  reducers: {
    setCheckSemesters: (state, action) => {
      state.checkSemesters = action.payload.checkSemesters;
    },
  },
});

export const { setCheckSemesters } = ecoComSlice.actions;
