import { coffeApi, externalApi } from "@/services";
import { setLoans } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const api = coffeApi;
const apiExternal = externalApi;

export const useLoanStore = () => {
  const { loans } = useSelector((state: any) => state.loans);
  const dispatch = useDispatch();

  const getLoans = async (loanId: number) => {
    const { data } = await api.get(`/kiosk/get_affiliate_loans/${loanId}`);
    dispatch(setLoans({ loans: data.payload }));
  };

  const printKardexLoan = async (loanId: number) => {
    try {
      // @ts-expect-error no necesary
      const { data } = await Promise.race([
        api.get(`/kiosk/loan/${loanId}/print/kardex`, { responseType: "arraybuffer" }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000)),
      ]);
      if (data) {
        const file = new Blob([data], { type: "application/pdf" });
        const formData = new FormData();
        formData.append("pdfFile", file, "kardex.pdf");
        const res: any = await Promise.race([
          await apiExternal.post("/printer/print/", formData),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000)),
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
        Swal.fire({
          title: "Hubo un error",
          text: message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return 501;
      }
    }
  };

  return {
    //* Propiedades
    loans,
    //* Métodos
    getLoans,
    printKardexLoan,
  };
};
