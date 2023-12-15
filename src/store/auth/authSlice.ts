import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'not-authenticated',
        user: {},
        identityCard: '',
    },
    reducers: {
        onLogin: (state, { payload }) => {
            state.status = 'authenticated';
            state.user = payload;
        },
        onLogout: (state) => {
            state.status = 'not-authenticated';
            state.user = {};
        },
        setIdentityCard: (state, { payload }) => {
            state.identityCard = payload.identityCard
        }
    }
});


// Action creators are generated for each case reducer function
export const { onLogin, onLogout, setIdentityCard } = authSlice.actions;