type ButtonProps = {
	label: string;
	colour?: string;
};

const Button = ({ label, colour = 'blue' }: ButtonProps) => {
	return <button style={{ backgroundColor: colour }}>{label}</button>;
};

export default Button;
