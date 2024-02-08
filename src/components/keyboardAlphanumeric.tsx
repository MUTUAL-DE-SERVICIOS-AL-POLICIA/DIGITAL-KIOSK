import BackspaceIcon from '@mui/icons-material/Backspace';
import "./index.css";

interface KeyboardProps {
  onClick: (key: any) => void
}

const KeyboardAlphanumeric = (props: KeyboardProps) => {

  const {
    onClick
  } = props

  const keys = [
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