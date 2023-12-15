import { setIdentityCard } from "@/store";
import { useDispatch, useSelector } from "react-redux";
export const useCredentialStore = () => {
  const { identityCard } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const changeIdentityCard = async (identityCard: string) => {
    console.log(`AGREGANDO EL NUMERO DE CARNET ${identityCard}`)
    dispatch(setIdentityCard({ identityCard: identityCard }));
  }
  return {
    //* Propiedades
    identityCard,
    //* Métodos
    changeIdentityCard,
  }
}
