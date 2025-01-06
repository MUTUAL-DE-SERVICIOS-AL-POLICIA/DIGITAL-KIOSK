import { createSlice } from "@reduxjs/toolkit";

export const ecoComSlice = createSlice({
  name: "economicComplement",
  initialState: {
    checkSemesters: <any>undefined,
    proceduresAlreadyCreated: <any>undefined,
  },
  reducers: {
    setCheckSemesters: (state, action) => {
      state.checkSemesters = action.payload.checkSemesters;
    },
    setProceduresAlreadyCreated: (state, action) => {
      state.proceduresAlreadyCreated = action.payload.proceduresAlreadyCreated;
    },
  },
});

export const { setCheckSemesters, setProceduresAlreadyCreated } =
  ecoComSlice.actions;
