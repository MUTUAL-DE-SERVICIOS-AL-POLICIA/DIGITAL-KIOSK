import { setSelection } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { gatewayApi } from "@/services";

export const useChooserStore = () => {
  const { selection, procedures } = useSelector((state: any) => state.chooser);

  const dispatch = useDispatch();

  const saveSelection = (selection: string) => {
    dispatch(setSelection({ selection: selection }));
  };

  const getValidProcedures = async (identityCard: string) => {
    try {
      const response = await gatewayApi.get(
        `/kiosk/procedures/${identityCard}`
      );
      const data = response.data;
      return data;
    } catch (error: any) {
      console.error("Error al obtener procedimientos: ", error);
    }
  };

  return {
    selection,
    procedures,
    saveSelection,
    getValidProcedures,
  };
};
