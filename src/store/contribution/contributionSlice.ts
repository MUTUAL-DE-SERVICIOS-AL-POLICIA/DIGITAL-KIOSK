import { createSlice } from "@reduxjs/toolkit";

export const contributionSlice = createSlice({
   name: 'contribution',
   initialState: {
      contributions: <any>null,
      hasContributionActive: Boolean,
      hasContributionPassive: Boolean
   },
   reducers: {
      setContributions: (state, action) => {
         state.contributions = action.payload.contributions
      },
      setHasContributionActive: (state, action) => {
         state.hasContributionActive = action.payload.hasContributionActive
      },
      setHasContributionPassive: (state, action) => {
         state.hasContributionPassive = action.payload.hasContributionPassive
      }
   }
})

export const { setContributions, setHasContributionActive, setHasContributionPassive } = contributionSlice.actions