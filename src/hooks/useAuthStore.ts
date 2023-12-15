import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { coffeApi } from "@/services";
import {
  onLogin,
  onLogout,
} from "@/store";

export const useAuthStore = () => {
  const { status, user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async () => {
    console.log('login')
    try {
      const { data } = await coffeApi.post('/affiliate/auth', {
        "username": "4362223",
        "password": "123123",
        "device_id": "60b0e0e023c75fd5",
        "firebase_token": "cxKZ1zqgR7KAEdOAR-z2fX:APA91bHeBQ9Pyc-SkeTyuRcYUDXqWIy2MSaB90qcN7aj5EbfFcxe2ihUUCXWu1wMaefekUXsFrxxIZvJuD6krjExqG9MHC_9TnBLVyhQck8hwOZ5Hcd_ra-PeME9kn1TXCyWMujLTJbv",
        "birth_date": "28-12-1947",
        "is_new_app": true
      });
      console.log(data)
      localStorage.setItem('token', data.data.api_token);
      // localStorage.setItem('refresh', data.refresh);
      const user = `${JSON.stringify(data.data.user)}`;
      localStorage.setItem('user', user);
      dispatch(onLogin(user));
    } catch (error: any) {
      dispatch(onLogout());
      const message = error.response.data.error
      Swal.fire('Error', message, 'error')
    }
  }

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      const user = localStorage.getItem('user')
      return dispatch(onLogin(user));
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
