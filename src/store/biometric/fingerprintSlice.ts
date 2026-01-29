import { createSlice } from "@reduxjs/toolkit";

export const fingerprintSlice = createSlice({
  name: "fingerprints",
  initialState: {
    fingerprints: <any>undefined,
  },
  reducers: {
    setFingerprints: (state, action) => {
      state.fingerprints = action.payload.fingerprints;
    },
  },
});

export const { setFingerprints } = fingerprintSlice.actions;
