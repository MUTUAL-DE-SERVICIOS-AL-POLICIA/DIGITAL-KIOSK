import { SxProps, TextField, Theme } from "@mui/material"
import { memo } from "react"
import { AlphaNumeric } from ".";

export const ComponentInput = memo((
  {
    id,
    name,
    value,
    onChange,
    type,
    label,
    endAdornment = AlphaNumeric(),
    multiline = false,
    error = false,
    helperText = '',
    disabled = false,
    customSx,
    size = 'Normal',
  }:
    {
      id?: string,
      name: string,
      value: any,
      onChange?: any,
      type: any,
      label: string,
      endAdornment?: any,
      multiline?: boolean
      error?: boolean,
      helperText?: string,
      disabled?: boolean,
      customSx?: SxProps<Theme>,
      size?: any,
    }) => {
  return (
    <TextField
      id={id}
      type={type}
      multiline={multiline}
      label={label}
      name={name}
      value={value}
      disabled={disabled}
      size={size}
      onChange={onChange}
      autoComplete='off'
      error={error}
      helperText={helperText}
      InputProps={{
        endAdornment,
        style: {
          color: 'black',
          borderColor: '#0B815A'
        },
      }}
      sx={{
        ...{
          '& label.Mui-focused': {
            color: 'black',
          },
        },
        ...customSx,
      }}
    />
  );
});
