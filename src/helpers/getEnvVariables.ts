


export const getEnvVariables = () => {

    return {
        // @ts-ignore
        VITE_HOST_BACKEND: import.meta.env.VITE_HOST_BACKEND,
        // @ts-ignore
        VITE_HOST_BACKEND_PRINT: import.meta.env.VITE_HOST_BACKEND_PRINT,
    }
}