import { createSlice } from '@reduxjs/toolkit';

export const loanSlice = createSlice({
  name: 'loan',
  initialState: {
    loans: <any>null
  },
  reducers: {
    setLoans: (state, action) => {
      state.loans = action.payload.loans
    },
  }
});


// Action creators are generated for each case reducer function
export const { setLoans } = loanSlice.actions;