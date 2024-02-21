import { configureStore } from '@reduxjs/toolkit';
import { authSlice, loanSlice, statisticsSlice } from '.';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        loans: loanSlice.reducer,
        statistics: statisticsSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})