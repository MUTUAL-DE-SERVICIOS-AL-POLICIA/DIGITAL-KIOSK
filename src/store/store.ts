import { configureStore } from '@reduxjs/toolkit';
import { authSlice, loanSlice, statisticsSlice } from '.';
import { contributionSlice } from './contribution/contributionSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        loans: loanSlice.reducer,
        statistics: statisticsSlice.reducer,
        contributions: contributionSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})