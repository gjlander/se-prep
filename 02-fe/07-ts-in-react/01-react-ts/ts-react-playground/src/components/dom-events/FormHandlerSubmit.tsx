import { type FormEventHandler, useState } from 'react';

const FormHandlerSubmit = () => {
	const [error, setError] = useState<string | null>(null);

	const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get('email');
		if (!email) {
			setError('Email is required');
			return;
		}
		console.log('Form submitted:', email);
	};

	if (error) {
		return (
			<>
				<div>{error}</div>
				<button onClick={() => setError(null)}>Try again</button>
			</>
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<input name='email' type='email' />
			<button type='submit'>Submit</button>
		</form>
	);
};

export default FormHandlerSubmit;
