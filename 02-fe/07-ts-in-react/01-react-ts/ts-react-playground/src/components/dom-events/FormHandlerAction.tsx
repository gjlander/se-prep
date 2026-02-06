import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

const FallBack = ({ error, resetErrorBoundary }: FallbackProps) => {
	return (
		<>
			<div>{error instanceof Error ? error.message : 'Ooops! Something went wrong'}</div>
			<button onClick={resetErrorBoundary}>Try again</button>
		</>
	);
};

const FormHandlerAction = () => {
	const action = (formData: FormData) => {
		const email = formData.get('email');
		if (!email) throw new Error('Email is required');
		console.log('Form submitted');
	};

	return (
		<ErrorBoundary FallbackComponent={FallBack}>
			<form action={action}>
				<input name='email' type='email' />
				<button type='submit'>Submit</button>
			</form>
		</ErrorBoundary>
	);
};

export default FormHandlerAction;
