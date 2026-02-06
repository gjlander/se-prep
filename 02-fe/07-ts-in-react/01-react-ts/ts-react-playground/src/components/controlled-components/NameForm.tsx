import { type ChangeEventHandler, useState } from 'react';

const NameForm = () => {
	const [name, setName] = useState('');

	const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
		setName(event.target.value);
	};

	return (
		<form>
			<label htmlFor='name'>Name:</label>
			<input id='name' type='text' value={name} onChange={handleChange} />
			{name && <p>Hello, {name}!</p>}
		</form>
	);
};

export default NameForm;
