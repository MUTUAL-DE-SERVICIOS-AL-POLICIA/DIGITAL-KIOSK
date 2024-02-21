import BackspaceIcon from '@mui/icons-material/Backspace';
import "./index.css";

interface KeyboardProps {
	onClick: (number: any) => void;
}

const KeyboardNumeric = (props: KeyboardProps) => {

	const { onClick } = props

	const numbers = [
		'7', '8', '9',
		'6', '5', '4',
		'3', '2', '1',
		'0', '-', <BackspaceIcon fontSize='large'/>
	]

	return (
		<div className="keyboardNumeric">
			{numbers.map((number, index) => (
				<div className="key" key={index} onClick={() => onClick(number)}>{number}</div>
			))}
		</div>
	)
}

export default KeyboardNumeric;