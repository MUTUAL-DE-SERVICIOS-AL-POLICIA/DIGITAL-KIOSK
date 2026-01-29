import { useDispatch, useSelector } from "react-redux";
import { coffeApi, gatewayApi } from "@/services";
import { onLogin, onLogout } from "@/store";
import { useCredentialStore } from ".";
import { getEnvVariables } from "@/helpers";
import { useSweetAlert } from "./useSweetAlert";

export const useAuthStore = () => {
  const { status, user } = useSelector((state: any) => state.auth);
  const { changeIdentityCard, changeStep, changeName } = useCredentialStore();
  const { showAlert } = useSweetAlert();
  const dispatch = useDispatch();

  const { changeLoadingGlobal } = useCredentialStore();
  const { MAC_DEVICE } = getEnvVariables();

  const startLogin = async (identityCard: string) => {
    try {
      changeLoadingGlobal(true);
      const { data } = await coffeApi.post("/kiosk/get_session", {
        device_name: MAC_DEVICE,
        /*
         * "identity_card": "1060667", // con 2 aportes, ni un préstamo
         * "identity_card": "4362223", // 1 aporte y 1 préstamo
         * "identity_card": "4778148", // 1 aporte y 2 préstamos
         */
        identity_card: identityCard,
      });
      localStorage.setItem("token", data.payload.access_token);
      const dataUser = {
        nup: data.payload.nup,
        fullName: data.payload.full_name,
        degree: data.payload.degree,
      };
      setTimeout(() => {
        const user = `${JSON.stringify(dataUser)}`;
        localStorage.setItem("user", user);
        changeIdentityCard(identityCard);
        changeName(data.payload.full_name);
        dispatch(onLogin(dataUser));
        changeStep("chooser");
        changeLoadingGlobal(false);
      }, 1000);
    } catch (error: any) {
      changeLoadingGlobal(false);
      changeIdentityCard("");
      dispatch(onLogout());
      if (!error.response) {
        showAlert({
          title: "Intentalo nuevamente",
          message: "Error en el servidor",
          icon: "error",
        });
        return;
      }
      const message = error.response.data.message;
      showAlert({
        title: "Carnet no valido",
        message,
        icon: "error",
      });
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = localStorage.getItem("user");
      return dispatch(onLogin(JSON.parse(user!)));
    } else {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  };

  const authMethodRegistration = async (body: object) => {
    try {
      await gatewayApi.post("/kiosk/saveDataKioskAuth", body);
    } catch (error: any) {
      console.error(
        "Salió un error al guardar el método de autenticación: ",
        error
      );
    }
  };

  return {
    //* Propiedades
    status,
    user,
    //* Métodos
    startLogin,
    checkAuthToken,
    startLogout,
    authMethodRegistration,
  };
};
