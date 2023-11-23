
import { DoNotDisturbOn } from "@mui/icons-material";
import { Button, Card, CardActionArea, CardContent, ClickAwayListener, IconButton, Tooltip, Typography } from "@mui/material"
import { useState } from "react"
import { KeyboardSimple} from "./keyboard";

const Popper = (close: () => void, upKeyboard: () => void, keyboard: boolean) => {
  return (
    <>
      <Card>
        <CardContent>
          <Typography align="center">
            ¿Cuenta con un carnet alfanumérico? <br />
            Ej: 123456-1M
          </Typography>
        </CardContent>
        <CardActionArea>
          <Button onClick={upKeyboard}>Si</Button>
          <Button onClick={close}>No</Button>
        </CardActionArea>
      </Card>
      {keyboard && <KeyboardSimple />}
    </>
  )
}

export const AlphaNumeric = () => {
  const [open, setOpen] = useState(false)
  const [keyboard, setKeyboard] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }
  const handleTooltipOpen = () => {
    setOpen(true)
  }

  const upKeyboard = () => {
    setKeyboard(true)
  }

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <IconButton color="primary">
        <Tooltip
          PopperProps={{
            disablePortal: true
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          placement="top-start"
          title={Popper(handleTooltipClose, upKeyboard, keyboard)}
          arrow>
          <DoNotDisturbOn sx={{fontSize: 60}} onClick={handleTooltipOpen} />
        </Tooltip>
      </IconButton>
    </ClickAwayListener>
  )
}