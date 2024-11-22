


export const getEnvVariables = () => {

    return {
        // @ts-expect-error no necesary
        VITE_HOST_BACKEND: import.meta.env.VITE_HOST_BACKEND,
        // @ts-expect-error no necesary
        VITE_HOST_BACKEND_PRINT: import.meta.env.VITE_HOST_BACKEND_PRINT,
        // @ts-expect-error no necesary
        ACTIVITY_TIME: import.meta.env.VITE_ACTIVITY_TIME,
        // @ts-expect-error no necesary
        MAC_DEVICE: import.meta.env.VITE_MAC_DEVICE,
        // @ts-expect-error no necesary
        VITE_HOST_BACKEND_BIOMETRIC: import.meta.env.VITE_HOST_BACKEND_BIOMETRIC,
        // @ts-expect-error no necesary
        VITE_HOST_API_GATEWAY: import.meta.env.VITE_HOST_API_GATEWAY,
    }
}