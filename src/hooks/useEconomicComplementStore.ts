// import { pvtbeApi } from "@/services"

export const useEconomicComplementStore = () => {
  const getCity = async () => {
    try {
      // const data = await pvtbeApi.get(`/city`)
      // return data
    } catch (e: any) {
      console.error("Hubo un error con el backend PVT-BE");
    }
  };

  return {
    getCity,
  };
};
