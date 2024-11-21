import { createContext, ReactNode, useState } from "react";


interface LoadingProviderProp {
  children: ReactNode;
}

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)


const LoadingProvider = ({ children }: LoadingProviderProp) => {
  const [isLoading, setIsLoading ] = useState<boolean>(false)

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading}}>
      { children }
    </LoadingContext.Provider>
  )
}

export { LoadingContext, LoadingProvider }