import { coffeApi } from "@/services"
import { setFingerprints } from "@/store/biometric/fingerprintSlice"
import { useDispatch, useSelector } from "react-redux"

const api = coffeApi

export const useBiometricStore = () => {
  const { fingerprints } = useSelector((state: any) => state.fingerprints)
  const dispatch = useDispatch()

  const getFingerprints = async () => {
    const { data } = await api.get(``)
    dispatch(setFingerprints({ fingerprints: data.payload }))
  }
  return {
    fingerprints,
    getFingerprints,
  }
}