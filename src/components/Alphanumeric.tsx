import { DoNotDisturbOn } from "@mui/icons-material";
import {
  Button,
  ClickAwayListener,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

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

const Popper = (close: () => void, upKeyboard: () => void) => {
  return (
    <>
      <Typography align="center" style={{ fontSize: 20, fontWeight: 400 }}>
        ¿Cuenta con un carnet alfanumérico? <br />
        Ej: 123456-1M
      </Typography>
      <Stack direction="row" justifyContent="space-between">
        <Button style={{ fontSize: 20, fontWeight: 700 }} onClick={upKeyboard}>
          Si
        </Button>
        <Button style={{ fontSize: 20, fontWeight: 700 }} onClick={close}>
          No
        </Button>
      </Stack>
    </>
  );
};

interface alpghaNumericProps {
  handleKeyboardComplete: (value: boolean) => void;
}
export const AlphaNumeric = (props: alpghaNumericProps) => {
  const { handleKeyboardComplete } = props;

  const [open, setOpen] = useState(false);

  const handleTooltip = (state: boolean) => {
    setOpen(false);
    handleKeyboardComplete(state);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <IconButton color="primary">
        <LightTooltip
          onClose={() => handleTooltip(false)}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          placement="top-start"
          title={Popper(
            () => handleTooltip(false),
            () => handleTooltip(true)
          )}
          arrow
        >
          <DoNotDisturbOn sx={{ fontSize: 60 }} onClick={() => setOpen(true)} />
        </LightTooltip>
      </IconButton>
    </ClickAwayListener>
  );
};
