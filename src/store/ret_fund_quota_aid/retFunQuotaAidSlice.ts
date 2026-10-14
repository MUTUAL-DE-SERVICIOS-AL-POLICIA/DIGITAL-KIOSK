import { createSlice } from "@reduxjs/toolkit";

export const retFunQuotaAidSlice = createSlice({
  name: "retFunQuotaAid",
  initialState: {
    retFunds: <any>[],
    quotaAids: <any>[],
  },
  reducers: {
    setRetFunds: (state, action) => {
      state.retFunds = action.payload.retFunds;
    },
    setQuotaAids: (state, action) => {
      state.quotaAids = action.payload.quotaAids;
    },
  },
});

export const { setRetFunds, setQuotaAids } = retFunQuotaAidSlice.actions;