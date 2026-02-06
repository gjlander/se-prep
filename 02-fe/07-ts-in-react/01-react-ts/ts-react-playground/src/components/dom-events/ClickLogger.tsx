import { type MouseEventHandler /*type MouseEvent*/ } from 'react';

const ClickLogger = () => {
	const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
		console.log('Button clicked', event);
	};

	//  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
	// 		console.log('Button clicked', event);
	// 	};
	return <button onClick={handleClick}>Click Me</button>;
};

export default ClickLogger;
