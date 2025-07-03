import { gatewayApi } from "@/services";

export const useEconomicComplementStore = () => {
  const checkSemesterEnabled = async (identityCard: string) => {
    try {
      const { data } = await gatewayApi.get(
        `/kiosk/person/${identityCard}/ecoCom`
      );
      return data;
    } catch (e: any) {
      console.error("Hubo un error con el backend PVT-BE");
    }
  };

  const createEconomicComplementProcess = async (body: any) => {
    try {
      const data = await gatewayApi.post(`/kiosk/ecoCom`, body);
      return data;
    } catch (e: any) {
      console.error("Hubo un error al crear un trámite");
    }
  };

  const getInformationEconomicComplement = async (ecoComId: string) => {
    try {
      const { data } = await gatewayApi.get(`/kiosk/ecoCom/${ecoComId}`);
      return data;
    } catch (e: any) {
      console.error(
        "Hubo un error al obtener la información del trámite creado"
      );
    }
  };

  return {
    checkSemesterEnabled,
    createEconomicComplementProcess,
    getInformationEconomicComplement,
  };
};
