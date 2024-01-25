


export const getEnvVariables = () => {

    return {
        VITE_HOST_BACKEND: import.meta.env.VITE_HOST_BACKEND,
        VITE_HOST_BACKEND_PRINT: import.meta.env.VITE_HOST_BACKEND_PRINT,
    }
}