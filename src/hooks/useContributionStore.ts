import { coffeApi, externalApi } from "@/services";
import {
  setContributions,
  setHasContributionActive,
  setHasContributionPassive,
} from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useSweetAlert } from "./useSweetAlert";

const api = coffeApi;
const apiExternal = externalApi;

export const useContributionStore = () => {
  const { contributions, hasContributionActive, hasContributionPassive } =
    useSelector((state: any) => state.contributions);
  const dispatch = useDispatch();
  const { showAlert } = useSweetAlert();

  const getAllContributions = async (affiliateId: number) => {
    try {
      const { data } = await api.get(`/kiosk/all_contributions/${affiliateId}`);
      dispatch(setContributions({ contributions: data.payload }));
      dispatch(
        setHasContributionActive({
          hasContributionActive: data.payload.has_contributions_active,
        })
      );
      dispatch(
        setHasContributionPassive({
          hasContributionPassive: data.payload.has_contributions_passive,
        })
      );
    } catch (erro: any) {
      showAlert({
        title: "Hubo un error",
        message: "No se puedo obtener las contribuciones",
        icon: "error",
      });
      console.error("No se pudo obtener las contribuciones");
    }
  };

  const printContributionActive = async (affiliateId: number) => {
    try {
      // @ts-expect-error no necesary
      const { data } = await Promise.race([
        api.get(`/kiosk/contributions_active/${affiliateId}`, {
          responseType: "arraybuffer",
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 15000)
        ),
      ]);
      if (data) {
        const file = new Blob([data], { type: "application/pdf" });
        const formData = new FormData();
        formData.append("pdfFile", file, "contribution_active.pdf");
        const res: any = await Promise.race([
          await apiExternal.post("/printer/print/", formData),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 15000)
          ),
        ]);
        if (res) {
          if (res.status == 200) {
            return res.status;
          }
        }
      }
    } catch (error: any) {
      if (error.code) {
        if (error.code == "ERR_NETWORK") {
          return 500;
        }
      } else if (error.response) {
        const message = error.response?.data?.error || "Error de conexión";
        showAlert({
          title: "Hubo un error",
          message: message,
          icon: "error",
        });
        return 501;
      }
    }
  };
  const printContributionPassive = async (affiliateId: number) => {
    try {
      // @ts-expect-error no necesary
      const { data } = await Promise.race([
        api.get(`/kiosk/contributions_passive/${affiliateId}/`, {
          responseType: "arraybuffer",
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 15000)
        ),
      ]);
      if (data) {
        const file = new Blob([data], { type: "application/pdf" });
        const formData = new FormData();
        formData.append("pdfFile", file, "contribution_passive.pdf");
        const res: any = await Promise.race([
          await apiExternal.post(`/printer/print/`, formData),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 15000)
          ),
        ]);
        if (res) {
          if (res.status == 200) {
            return res.status;
          }
        }
      }
    } catch (error: any) {
      if (error.code) {
        if (error.code == "ERR_NETWORK") {
          return 500;
        }
      } else if (error.response) {
        const message = error.response?.data?.error || "Error de conexión";
        showAlert({
          title: "Hubo un error",
          message: message,
          icon: "error",
        });
        return 501;
      }
    }
  };

  return {
    contributions,
    hasContributionActive,
    hasContributionPassive,
    printContributionPassive,
    printContributionActive,
    getAllContributions,
  };
};
