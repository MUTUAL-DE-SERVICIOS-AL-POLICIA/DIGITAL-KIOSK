import { /*coffeApi,*/ gatewayApi } from "@/services";
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
  setFacialRecognition,
  setLoadingGlobal,
} from "@/store";
import { useDispatch, useSelector } from "react-redux";

// const api = coffeApi;

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
    facialRecognition,
    loading,
  } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch();

  const changeStep = async (step: string | null) => {
    dispatch(setChangeStep({ step }));
  };
  const changeIdentityCard = async (identityCard: string) => {
    dispatch(setIdentityCard({ identityCard: identityCard }));
  };
  const changeIdentifyUser = async (userIdentify: boolean) => {
    dispatch(setIdentifyUser({ userIdentify: userIdentify }));
  };
  const changeTimer = async (timer: number) => {
    dispatch(setTimer({ timer }));
  };
  const changeStateInstruction = async (state: boolean) => {
    dispatch(setInstructionState({ state }));
  };
  const changeResetAll = async () => {
    dispatch(setResetAll());
  };
  const changeName = async (full_name: string) => {
    dispatch(setName({ full_name: full_name }));
  };
  const changeImage = async (image: string) => {
    dispatch(setImageCapture({ image }));
  };
  const changeRecognizedByOcr = async (ocr: boolean) => {
    dispatch(setOcr({ ocr }));
  };
  const changeRecognizedByFacialRecognition = async (
    facialRecognition: boolean
  ) => {
    dispatch(setFacialRecognition({ facialRecognition }));
  };
  const changeLoadingGlobal = async (loading: boolean) => {
    dispatch(setLoadingGlobal({ loading }));
  };
  const savePhoto = async ({
    personId,
    photoIdentityCard = null,
    photoFace = null,
  }: {
    personId: number;
    photoIdentityCard?: any;
    photoFace?: any;
  }) => {
    try {
      const formData = new FormData();
      if (photoIdentityCard) {
        formData.append("photoIdentityCard", photoIdentityCard, "carnet.jpg");
      }
      if (photoFace) formData.append("photoFace", photoFace, "rostro.jpg");
      formData.append("personId", personId.toString());
      const data = await gatewayApi.post(`/kiosk/savePhoto`, formData);
      if (data.status == 201) {
        console.log("se guardo exitosamente la fotografía");
      }
    } catch (error: any) {
      console.error("No se pudo guardar la imagen: ", error);
    }
  };

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
    loading,
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
    changeRecognizedByFacialRecognition,
    changeLoadingGlobal,
    savePhoto,
  };
};
