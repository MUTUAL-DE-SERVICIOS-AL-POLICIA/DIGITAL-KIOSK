import { useDispatch, useSelector } from "react-redux"
import { gatewayApi } from "@/services"
import { setPerson } from "@/store"

export const usePersonStore = () => {
  const { person } = useSelector((state: any) => state.person )
  const dispatch = useDispatch()

  const getPerson = async (identityCard: string) => {
    try {
      const { data } = await gatewayApi.get(`/kiosk/person/${identityCard}`)
      dispatch(setPerson({ person: data }))
      return data.id
    } catch(e: any) {
      console.error("Error al obtener datos de la persona")
    }
  }

  return {
    person,
    getPerson
  }
}