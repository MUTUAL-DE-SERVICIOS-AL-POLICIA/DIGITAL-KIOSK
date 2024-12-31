import { createSlice } from "@reduxjs/toolkit";

export const personSlice = createSlice({
  name: "person",
  initialState: {
    person: <any>null,
  },
  reducers: {
    setPerson: (state, action) => {
      state.person = action.payload.person;
    },
  },
});

export const { setPerson } = personSlice.actions;
