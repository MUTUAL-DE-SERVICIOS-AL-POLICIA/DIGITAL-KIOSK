import { createSlice } from "@reduxjs/toolkit";

export const chooserSlice = createSlice({
  name: "chooser",
  initialState: {
    selection: null,
  },
  reducers: {
    setSelection: (state, { payload }) => {
      state.selection = payload.selection;
    },
  },
});

export const { setSelection } = chooserSlice.actions;
