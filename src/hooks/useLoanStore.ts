import { coffeApi } from "@/services";
import { setLoans } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
// import * as fs from 'fs';
import printJS from 'print-js';
// import { print } from "pdf-to-printer";
const api = coffeApi;

export const useLoanStore = () => {
  const { loans } = useSelector((state: any) => state.loans);
  const dispatch = useDispatch();

  const getLoans = async (loanId: number) => {
    const { data } = await api.get(`/poa/get_affiliate_loans/${loanId}`);
    console.log(data.payload)
    dispatch(setLoans({ loans: data.payload }));
  }

  // const handlePrint = (e: React.FormEvent) => {

  //   e.preventDefault();
  //   print(pdfURL);

  // };

  const printKardexLoan = async (loanId: number) => {
    try {
      const { data } = await api.get(`/poa/loan/${loanId}/print/kardex`, {
        responseType: 'arraybuffer'
      });
      const blob = new Blob([data], { type: 'application/pdf' });
      // const file = path.join(app.getPath('temp'), 'output.pdf');
      // const buffer = Buffer.from(await blob.arrayBuffer());
      // fs.writeFileSync(file, buffer);
      const pdfURL = window.URL.createObjectURL(blob)
      console.log(pdfURL)
      printJS(pdfURL)


      // var printer = getPrintParams();
      // printer.fileName = "";
      // printer.printerName = "Adobe PDF";
      // this.print(pp);
      // app.openDoc({ cPath: pdfURL, bUseConv: true };
      // this.saveAs(this.path);
      // const options = {
      //   printer: "sistemas2",
      //   pages: "1",
      //   scale: "fit",
      // };

      // print(pdfURL, options).then(console.log);

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
