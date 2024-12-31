import Swal from "sweetalert2";
import "src/views/auth/styles.css";

type SweetAlertOptions = {
  title: string;
  message?: string;
  html?: string;
  icon?: "success" | "error" | "warning" | "info" | "question" | undefined;
  confirmText?: string;
  cancelText?: string;
  timer?: number;
  allowOutsideClick?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const useSweetAlert = () => {
  const showAlert = ({
    title,
    message,
    html,
    icon = undefined,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    timer = 12000,
    allowOutsideClick = false,
    onConfirm,
    onCancel,
  }: SweetAlertOptions) => {
    Swal.fire({
      title,
      text: message,
      html,
      icon,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      showCancelButton: !!onCancel,
      customClass: {
        title: "swal-title",
        confirmButton: "swal-button",
        cancelButton: "swal-cancel-button",
      },
      timer,
      allowOutsideClick,
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      } else if (result.dismiss === Swal.DismissReason.cancel && onCancel) {
        onCancel();
      }
    });
  };
  return { showAlert };
};
