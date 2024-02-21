import { setFacialRecognitionS, setLeftText, setMiddleText,  setOcrState, setRightText } from "@/store"
import { useDispatch, useSelector } from "react-redux"

export const useStastisticsStore = () => {
    const {
        leftText,
        rightText,
        middleText,
        ocrState,
        faceRecognitionState,
    } = useSelector((state: any) => state.statistics)

    const dispatch = useDispatch()

    const changeLeftText = async (leftText: string) => {
        dispatch(setLeftText({ leftText }))
    }
    const changeRightText = async (rightText: string) => {
        dispatch(setRightText({ rightText }))
    }
    const changeMiddleText = async (middleText: string) => {
        dispatch(setMiddleText({ middleText }))
    }
    const changeOcrState = async (ocrState: boolean) => {
        dispatch(setOcrState({ ocrState }))
    }
    const changeFaceRecognitionS = async (faceRecognitionState: boolean) => {
        dispatch(setFacialRecognitionS({  faceRecognitionState }))
    }

    return {
        leftText,
        rightText,
        middleText,
        ocrState,
        faceRecognitionState,
        changeLeftText,
        changeRightText,
        changeMiddleText,
        changeOcrState,
        changeFaceRecognitionS
    }
}