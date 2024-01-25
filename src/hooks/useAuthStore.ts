import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { coffeApi } from "@/services";
import {
  onLogin,
  onLogout,
} from "@/store";
import { useCredentialStore } from ".";

export const useAuthStore = () => {
  const { status, user } = useSelector((state: any) => state.auth);
  const { changeIdentityCard, changeStep } = useCredentialStore();
  const dispatch = useDispatch();

  const startLogin = async (identityCard: string) => {
    try {
      const { data } = await coffeApi.post('/poa/get_session', {
        "device_name": "54:BF:64:61:D7:95",
        "identity_card": "4362223"
        // "identity_card": identityCard

      });
      localStorage.setItem('token', data.payload.access_token);
      const dataUser = {
        "nup": data.payload.nup,
        "fullName": data.payload.full_name,
        "degree": data.payload.degree
      }
      const user = `${JSON.stringify(dataUser)}`;
      console.log(dataUser)
      localStorage.setItem('user', user);
      changeIdentityCard(identityCard)
      dispatch(onLogin(dataUser));
      changeStep('instructionCard')
    } catch (error: any) {
      if (!error.response) return Swal.fire('Intentalo nuevamente', 'Error en el servidor', 'error')
      dispatch(onLogout());
      const message = error.response.data.message
      Swal.fire('Error', message, 'error')
    }
  }

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      const user = localStorage.getItem('user')
      return dispatch(onLogin(JSON.parse(user!)));
    } else {
      localStorage.clear();
      dispatch(onLogout());
    }
  }

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  }



  return {
    //* Propiedades
    status,
    user,
    //* Métodos
    startLogin,
    checkAuthToken,
    startLogout,
  }

}
