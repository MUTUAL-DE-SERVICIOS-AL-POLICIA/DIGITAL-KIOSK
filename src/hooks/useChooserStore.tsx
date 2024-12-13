import { setProcedures, setSelection } from "@/store";
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
      console.log("Esto se obtiene: ", response);
      dispatch(setProcedures({ procedures: response }));
    } catch (error: any) {}
  };

  return {
    selection,
    procedures,
    saveSelection,
    getValidProcedures,
  };
};
