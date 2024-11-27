import { coffeApi } from "@/services";
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

const api = coffeApi;

export const useCredentialStore = () => {
  const { step, identityCard, userIdentify, timer, InstructionState, name, image, ocr, facialRecognition, loading } =
    useSelector((state: any) => state.auth);

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
  const changeRecognizedByFacialRecognition = async (facialRecognition: boolean) => {
    dispatch(setFacialRecognition({ facialRecognition }));
  };
  const changeLoadingGlobal = async (loading: boolean) => {
    dispatch(setLoadingGlobal({ loading }));
  };
  const savePhoto = async ({
    affiliateId,
    photo_ci = null,
    photo_face = null,
  }: {
    affiliateId: string;
    photo_ci?: any;
    photo_face?: any;
  }) => {
    const formData = new FormData();
    if (photo_ci) formData.append("photo_ci", photo_ci, "carnet.jpg");
    if (photo_face) formData.append("photo_face", photo_face, "rostro.jpg");
    formData.append("affiliate_id", affiliateId.toString());
    try {
      const data = await api.post(`/kiosk/save_photo`, formData);
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
