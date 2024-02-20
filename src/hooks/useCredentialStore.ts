import {
  setChangeStep,
  setIdentifyUser,
  setIdentityCard,
  setInstructionState,
  setName,
  setResetAll,
  setTimer,
  setImageCapture,
  setOcr,
  setFacialRecognition
} from "@/store";
import { useDispatch, useSelector } from "react-redux";

export const useCredentialStore = () => {
  const {
    step,
    identityCard,
    userIdentify,
    timer,
    InstructionState,
    name,
    image,
    ocr,
    facialRecognition
  } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch();

  const changeStep = async (step: string | null) => {
    dispatch(setChangeStep({ step }))
  }
  const changeIdentityCard = async (identityCard: string) => {
    dispatch(setIdentityCard({ identityCard: identityCard }));
  }
  const changeIdentifyUser = async (userIdentify: boolean) => {
    dispatch(setIdentifyUser({ userIdentify: userIdentify }));
  }
  const changeTimer = async (timer: number) => {
    dispatch(setTimer({ timer }));
  }
  const changeStateInstruction = async (state: boolean) => {
    dispatch(setInstructionState({ state }));
  }
  const changeResetAll = async () => {
    dispatch(setResetAll());
  }
  const changeName = async (full_name: string) => {
    dispatch(setName({full_name: full_name}))
  }
  const changeImage = async (image: string) => {
    dispatch(setImageCapture({image}))
  }
  const changeRecognizedByOcr = async (ocr: boolean) => {
    dispatch(setOcr({ocr}))
  }
  const changeRecognizedByFacialRecognition = async (facialRecognition: boolean) => {
    dispatch(setFacialRecognition({facialRecognition}))
  }


  return {
    //* Propiedades
    step,
    identityCard,
    userIdentify,
    timer,
    InstructionState,
    name,
    image,
    ocr,
    facialRecognition,
    //* Métodos
    changeStep,
    changeIdentityCard,
    changeIdentifyUser,
    changeTimer,
    changeStateInstruction,
    changeResetAll,
    changeName,
    changeImage,
    changeRecognizedByOcr,
    changeRecognizedByFacialRecognition
  }
}
