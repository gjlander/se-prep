type StatusProps = {
	status: 'loading' | 'success' | 'error';
};

const Status = ({ status }: StatusProps) => {
	return <p>Status: {status}</p>;
};

export default Status;
