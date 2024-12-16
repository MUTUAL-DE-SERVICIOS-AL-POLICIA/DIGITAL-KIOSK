import { createSlice } from "@reduxjs/toolkit";

export const ecoComSlice = createSlice({
  name: "ecoCom",
  initialState: {
    ecoCom: <any>undefined,
  },
  reducers: {
    setEcoCom: (state, action) => {
      state.ecoCom = action.payload.ecoCom;
    },
  },
});

export const { setEcoCom } = ecoComSlice.actions;
