import { createSlice } from "@reduxjs/toolkit";


export const fingerprintSlice = createSlice({
  name: 'fingerprints',
  initialState: {
    fingerprints: <any>null
  },
  reducers: {
    setFingerprints: (state, action) => {
      state.fingerprints = action.payload.fingerprints
      console.log("fingerprints:", action.payload.fingerprints)
    }
  }
});

export const { setFingerprints } = fingerprintSlice.actions