
interface KeyboardProps {
	onClick: (number: string) => void;
}

const KeyboardNumeric = (props: KeyboardProps) => {

	const { onClick } = props

	const numbers = [
		'7', '8', '9',
		'4', '5', '6',
		'1', '2', '3',
		'0', '-', '<-'
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