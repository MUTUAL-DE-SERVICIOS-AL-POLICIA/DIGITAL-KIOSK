import { DoNotDisturbOn } from "@mui/icons-material";
import {
  Button,
  ClickAwayListener,
  IconButton,
  Stack,
  Typography,
  styled,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import { memo, useCallback, useState } from "react";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    borderRadius: "20px",
  },
}));

const PopperContent = memo(
  ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => (
    <Stack spacing={2}>
      <Typography align="center" sx={{ fontSize: 20, fontWeight: 400 }}>
        ¿Cuenta con un carnet alfanumérico? <br />
        Ej: 123456-1M
      </Typography>
      <Stack direction="row" justifyContent="space-between">
        <Button sx={{ fontSize: 20, fontWeight: 700 }} onClick={onConfirm}>
          Sí
        </Button>
        <Button sx={{ fontSize: 20, fontWeight: 700 }} onClick={onClose}>
          No
        </Button>
      </Stack>
    </Stack>
  )
);

// Componente AlphaNumeric
interface AlpghaNumericProps {
  handleKeyboardComplete: (value: boolean) => void;
}

export const AlphaNumeric = memo(
  ({ handleKeyboardComplete }: AlpghaNumericProps) => {
    const [open, setOpen] = useState(false);

    const handleTooltip = useCallback(
      (state: boolean) => {
        setOpen(false);
        handleKeyboardComplete(state);
      },
      [handleKeyboardComplete]
    );

    const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

    return (
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <IconButton color="primary" onClick={toggleOpen}>
          <LightTooltip
            onClose={() => handleTooltip(false)}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            placement="top-start"
            title={
              <PopperContent
                onClose={() => handleTooltip(false)}
                onConfirm={() => handleTooltip(true)}
              />
            }
            arrow
          >
            <DoNotDisturbOn sx={{ fontSize: 60 }} />
          </LightTooltip>
        </IconButton>
      </ClickAwayListener>
    );
  }
);
