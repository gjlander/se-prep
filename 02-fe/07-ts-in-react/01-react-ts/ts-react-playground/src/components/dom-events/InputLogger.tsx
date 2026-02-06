import { type ChangeEventHandler } from 'react';

const InputLogger = () => {
	const handleInput: ChangeEventHandler<HTMLInputElement> = event => {
		console.log('Input value:', event.target.value);
	};

	return <input type='text' onChange={handleInput} />;
};

export default InputLogger;
