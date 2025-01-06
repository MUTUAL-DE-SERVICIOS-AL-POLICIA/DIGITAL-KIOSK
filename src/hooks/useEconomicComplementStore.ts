import { pvtbeApi } from "@/services";
import { setCheckSemesters, setProceduresAlreadyCreated } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export const useEconomicComplementStore = () => {
  const { checkSemesters, proceduresAlreadyCreated } = useSelector(
    (state: any) => state.economicComplement
  );
  const dispatch = useDispatch();

  const checkSemesterEnabled = async (identityCard: string) => {
    try {
      const { data } = await pvtbeApi.get(
        `/kiosk/person/${identityCard}/ecoCom`
      );
      const res = data.data;
      const proceduresAlreadyCreated = res.filter(
        (procedure: any) => procedure.eco_com_id !== null
      );
      dispatch(
        setProceduresAlreadyCreated({
          proceduresAlreadyCreated: proceduresAlreadyCreated,
        })
      );
      dispatch(setCheckSemesters({ checkSemesters: data }));
      return data;
    } catch (e: any) {
      console.error("Hubo un error con el backend PVT-BE");
    }
  };

  const createEconomicComplementProcess = async (body: any) => {
    try {
      const data = await pvtbeApi.post(`/kiosk/ecoCom`, body);
      return data;
    } catch (e: any) {
      console.error("Hubo un error al crear un trámite");
    }
  };

  const getInformationEconomicComplement = async (ecoComId: string) => {
    try {
      const { data } = await pvtbeApi.get(`/kiosk/ecoCom/${ecoComId}`);
      console.log(data);
      return data;
    } catch (e: any) {
      console.error(
        "Hubo un error al obtener la información del trámite creado"
      );
    }
  };

  return {
    checkSemesters,
    proceduresAlreadyCreated,
    checkSemesterEnabled,
    createEconomicComplementProcess,
    getInformationEconomicComplement,
  };
};
