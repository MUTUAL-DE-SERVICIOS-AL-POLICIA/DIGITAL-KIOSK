import { createSlice } from '@reduxjs/toolkit';

export const statisticsSlice = createSlice({
    name: 'statistics',
    initialState: {
        leftText: '',
        middleText: '',
        rightText: '',
        ocrState: false,
        facialRecognition: false
    },
    reducers: {
        setLeftText: (state, { payload } ) => {
            state.leftText = payload.leftText
        },
        setMiddleText: (state, { payload }) => {
            state.middleText = payload.middleText
        },
        setRightText: (state, { payload }) => {
            state.rightText = payload.rightText
        },
        setOcrState: (state, { payload }) => {
            state.ocrState = payload.ocrState
        },
        setFacialRecognitionS: (state, { payload }) => {
            state.facialRecognition = payload.facialRecognition
        }
    }
})

export const {
    setLeftText,
    setRightText,
    setMiddleText,
    setOcrState,
    setFacialRecognitionS
} = statisticsSlice.actions