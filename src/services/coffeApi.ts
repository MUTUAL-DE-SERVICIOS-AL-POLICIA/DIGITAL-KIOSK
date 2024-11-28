import axios from "axios";
import { getEnvVariables } from "../helpers";

const {
  VITE_HOST_BACKEND,
  VITE_HOST_BACKEND_PRINT,
  VITE_HOST_BACKEND_BIOMETRIC,
  VITE_HOST_API_GATEWAY,
  // VITE_HOST_API_PVT_BE,
  // VITE_API_PVT_BE_TOKEN
} = getEnvVariables();

const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL: `${baseURL}api`,
  });

  instance.interceptors.request.use((request) => {
    // if(baseURL == VITE_HOST_API_PVT_BE) {
    //     request.headers.set('Authorization', `Bearer ${VITE_API_PVT_BE_TOKEN}`)
    // } else {
    const token = localStorage.getItem(`token`);
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
    // }
    return request;
  });

  return instance;
};

export const coffeApi = createAxiosInstance(VITE_HOST_BACKEND);
export const externalApi = createAxiosInstance(VITE_HOST_BACKEND_PRINT);
export const biometricApi = createAxiosInstance(VITE_HOST_BACKEND_BIOMETRIC);
export const gatewayApi = createAxiosInstance(VITE_HOST_API_GATEWAY);
// export const pvtbeApi = createAxiosInstance(VITE_HOST_API_PVT_BE);
