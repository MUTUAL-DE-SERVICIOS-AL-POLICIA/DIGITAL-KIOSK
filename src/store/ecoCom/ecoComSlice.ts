import { createSlice } from "@reduxjs/toolkit";

export const ecoComSlice = createSlice({
  name: "ecoCom",
  initialState: {
    ecoCom: <any>undefined,
    procedures: <any>undefined,
  },
  reducers: {
    setEcoCom: (state, action) => {
      state.ecoCom = action.payload.ecoCom;
    },
    setProcedures: (state, action) => {
      state.procedures = action.payload.procedures;
    },
  },
});

export const { setEcoCom, setProcedures } = ecoComSlice.actions;
