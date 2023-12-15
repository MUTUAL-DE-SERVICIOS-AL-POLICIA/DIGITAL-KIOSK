import { configureStore } from '@reduxjs/toolkit';
import { authSlice, loanSlice } from '.';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        loans: loanSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})