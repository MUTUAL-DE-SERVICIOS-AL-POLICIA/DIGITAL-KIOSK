


export const getEnvVariables = () => {

    return {
        // @ts-ignore
        VITE_HOST_BACKEND: import.meta.env.VITE_HOST_BACKEND,
        // @ts-ignore
        VITE_HOST_BACKEND_PRINT: import.meta.env.VITE_HOST_BACKEND_PRINT,
        // @ts-ignore
        ACTIVITY_TIME: import.meta.env.VITE_ACTIVITY_TIME,
        // @ts-ignore
        MAC_DEVICE: import.meta.env.VITE_MAC_DEVICE,
    }
}