import BackspaceIcon from "@mui/icons-material/Backspace";
import "./index.css";
import { ReactNode } from "react";

interface KeyboardProps {
  onClick: (number: string | ReactNode) => void;
}

const KeyboardNumeric = (props: KeyboardProps) => {
  const { onClick } = props;

  /* prettier-ignore */
  const numbers = [
		'1', '2', '3',
		'4', '5', '6',
		'7', '8', '9',
		'-', '0', <BackspaceIcon sx={{color: '#008698'}} fontSize='large'/>
	]

  return (
    <div className="keyboardNumeric">
      {numbers.map((number, index) => (
        <div className="key" key={index} onClick={() => onClick(number)}>
          {number}
        </div>
      ))}
    </div>
  );
};

export default KeyboardNumeric;
