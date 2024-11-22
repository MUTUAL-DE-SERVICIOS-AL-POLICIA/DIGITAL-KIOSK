import { gatewayApi, biometricApi } from "@/services"
import { setFingerprints } from "@/store/biometric/fingerprintSlice"
import { useDispatch, useSelector } from "react-redux"

export const useBiometricStore = () => {
  const { fingerprints } = useSelector((state: any) => state.fingerprints)
  const dispatch = useDispatch()

  const getFingerprints = async (personId: number) => {
    try {
      const { data } = await gatewayApi.get(`/persons/getFingerprintComparison/${personId}`)
      dispatch(setFingerprints({ fingerprints: data }))
    } catch(e: any) {
      console.error(e)
      console.error("Error al obtener huellas para la comparación")
    }
  }

  const compareFingerprints = async (fingerprints: any) => {
    // ? (1) necesito el array de huellas
    try {
      const { data } = await biometricApi.post(`/biometrico/comparar/huella`, {fingerprints})
      console.log(data)
      if(data) {
        return true
      } else return false
    } catch(e: any) {
      console.error("Error al comparar huella")
      return false
    }
  }

  return {
    fingerprints,
    getFingerprints,
    compareFingerprints
  }
}