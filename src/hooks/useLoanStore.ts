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
    const { data } = await api.get(`/poa/get_affiliate_loans/${loanId}`);
    console.log(data.payload)
    dispatch(setLoans({ loans: data.payload }));
  }

  const printKardexLoan = async (loanId: number) => {
    try {
      const { data } = await api.get(`/poa/loan/${loanId}/print/kardex`, {
        responseType: 'arraybuffer'
      });
      const file = new Blob([data], { type: 'application/pdf' });
      const formData = new FormData()
      formData.append('pdfFile', file, 'kardex.pdf' )
      await apiExternal.post('/printer/print/', formData)
    } catch (error: any) {
      const message = error.response.data.error
      Swal.fire('Error', message, 'error');
    }
  }


  return {
    //* Propiedades
    loans,
    //* Métodos
    getLoans,
    printKardexLoan,
  }
}
