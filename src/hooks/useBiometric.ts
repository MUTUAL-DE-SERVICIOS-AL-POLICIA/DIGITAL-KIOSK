import { gatewayApi } from "@/services"
import { setFingerprints } from "@/store/biometric/fingerprintSlice"
import { useDispatch, useSelector } from "react-redux"

const api = gatewayApi

export const useBiometricStore = () => {
  const { fingerprints } = useSelector((state: any) => state.fingerprints)
  const dispatch = useDispatch()

  const getFingerprints = async (personId: number) => {
    const { data } = await api.get(`/getFingerprintComparison/${personId}`)
    dispatch(setFingerprints({ fingerprints: data.payload }))
  }
  return {
    fingerprints,
    getFingerprints,
  }
}