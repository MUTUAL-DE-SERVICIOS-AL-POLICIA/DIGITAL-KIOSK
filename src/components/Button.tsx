import LoadingButton from '@mui/lab/LoadingButton';
import { SxProps, Theme } from '@mui/material';
import { memo } from 'react';
import "./index.css";

interface buttonProps {
  type?: any;
  text: string;
  onClick?: any;
  startIcon?: any;
  disable?: boolean;
  loading?: boolean;
  variant?: any;
  endIcon?: any;
  sx?: SxProps<Theme>;
  color?: any;
}

export const ComponentButton = memo((props: buttonProps) => {
  const {
    type,
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

  return (
    <LoadingButton
      loading={loading}
      type={type}
      className="mt-2"
      variant={variant}
      disableRipple
      disabled={disable}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      color={color}
      sx={{
        marginTop: '10px',
        marginBottom: '10px',
        width: '100%',
        fontWeight: 'bold',
        backgroundColor: color || '#008698', // Usa el color proporcionado o el predeterminado
        '&:hover': {
          transform: 'scale(0.95)',
          transition: 'transform 0.2s ease', // Añade la propiedad de transición
          backgroundColor: color ? 'orange' : '#008698',
          // No especificar backgroundColor aquí para que no cambie en hover
        },
        ...sx,
      }}
    >
      {text}
    </LoadingButton>
  );
});
