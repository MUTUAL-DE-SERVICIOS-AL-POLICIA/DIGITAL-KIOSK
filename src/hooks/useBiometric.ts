import { gatewayApi, biometricApi } from "@/services";
import { setFingerprints } from "@/store/biometric/fingerprintSlice";
import { useDispatch, useSelector } from "react-redux";

export const useBiometricStore = () => {
  const { fingerprints } = useSelector((state: any) => state.fingerprints);
  const dispatch = useDispatch();

  const getFingerprints = async (personId: number) => {
    try {
      const { data } = await gatewayApi.get(
        `/kiosk/getFingerprintComparison/${personId}`
      );
      dispatch(setFingerprints({ fingerprints: data }));
      return data;
    } catch (e: any) {
      console.error(e);
      console.error("Error al obtener huellas para la comparación");
    }
  };

  const compareFingerprints = async (fingerprints: any) => {
    try {
      const { data } = await biometricApi.post(
        `/biometrico/comparar/huella`,
        fingerprints
      );
      const { fingerprintTypeId, isValid, quality, wsq } = data;
      return { fingerprintTypeId, isValid, quality, wsq };
    } catch (e: any) {
      console.error("Error al comparar huella");
      return false;
    }
  };

  return {
    fingerprints,
    getFingerprints,
    compareFingerprints,
  };
};
