import LoadingButton from "@mui/lab/LoadingButton";
import { SxProps, Theme } from "@mui/material";
import { MouseEventHandler, ReactNode, memo } from "react";
import "./index.css";

interface buttonProps {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  startIcon?: ReactNode;
  disable?: boolean;
  loading?: boolean;
  variant?: any;
  endIcon?: ReactNode;
  sx?: SxProps<Theme>;
  color?: any;
}

export const ComponentButton = memo((props: buttonProps) => {
  const {
    text,
    onClick,
    startIcon,
    endIcon,
    disable = false,
    loading = false,
    variant = "contained",
    sx,
    color,
  } = props;

  const defaultStyles: SxProps<Theme> = {
    backgroundColor: color || "#008698",
    "&:hover": {
      backgroundColor: color || "#006577",
    },
    ...sx,
  };

  return (
    <LoadingButton
      loading={loading}
      variant={variant}
      disabled={disable}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      color={color}
      sx={defaultStyles}
    >
      {text}
    </LoadingButton>
  );
});
