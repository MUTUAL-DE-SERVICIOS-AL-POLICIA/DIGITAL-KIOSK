import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'not-authenticated',
    step: 'home', // 'identityCard','instruction','reconognition'
    user: {},
    identityCard: '',
    userIdentify: false,
    timer: 20,
    InstructionState: true,
    name: ''
  },
  reducers: {
    setChangeStep: (state, { payload }) => {
      state.step = payload.step
    },
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
    },
    setIdentifyUser: (state, { payload }) => {
      state.userIdentify = payload.userIdentify;
    },
    setTimer: (state, { payload }) => {
      state.timer = payload.timer;
    },
    setInstructionState: (state, { payload }) => {
      state.InstructionState = payload.state;
    },
    setResetAll: (state, /*{ payload }*/) => {
      state.identityCard = '';
      state.userIdentify = false;
      state.timer = 20;
      state.InstructionState = true;
    },
    setName: (state, { payload }) => {
      state.name = payload.full_name
    }
  }
});


// Action creators are generated for each case reducer function
export const { setChangeStep, onLogin, onLogout, setIdentityCard, setIdentifyUser, setTimer, setInstructionState, setResetAll, setName } = authSlice.actions;