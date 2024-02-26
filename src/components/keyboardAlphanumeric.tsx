import BackspaceIcon from '@mui/icons-material/Backspace';
import "./index.css";
import { ReactNode } from 'react';

interface KeyboardProps {
  onClick: (key: string | ReactNode) => void
}

const KeyboardAlphanumeric = (props: KeyboardProps) => {

  const {
    onClick
  } = props

  const keys = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z',
    'X', 'C', 'V', 'B', 'N', 'M', '-', <BackspaceIcon/>
  ]

  return (
    <div className="keyboardAlphanumeric">
      { keys.map((key, index) => (
        <div className="keyalphanumeric" key={index} onClick={() => onClick(key)}>{key}</div>
      ))}
    </div>
  )
}

export default KeyboardAlphanumeric;