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
    name: '',
    image: '',
    ocr: false,
    facialRecognition: false,
    loading: false
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
    },
    setImageCapture: (state, { payload }) => {
      state.image = payload.image
    },
    setOcr: (state, { payload }) => {
      state.ocr = payload.ocr
    },
    setFacialRecognition: (state, { payload }) => {
      state.facialRecognition = payload.facialRecognition
    },
    setLoadingGlobal: (state, { payload}) => {
      state.loading = payload.loading
    }
  }
});


// Action creators are generated for each case reducer function
export const {
  setChangeStep,
  onLogin,
  onLogout,
  setIdentityCard,
  setIdentifyUser,
  setTimer,
  setInstructionState,
  setResetAll,
  setName,
  setImageCapture,
  setOcr,
  setFacialRecognition,
  setLoadingGlobal
} = authSlice.actions;