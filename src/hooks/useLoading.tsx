import { LoadingContext } from "@/context/LoadingContext";
import { useContext } from "react";

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading debe usarse dentro de un LoadingProvider");
  }
  return context;
};
