import { useState, useEffect } from 'react';

import { getAllDucks } from '../data';
import { DuckContext } from '../context';

const DuckProvider = ({ children }) => {
	const [ducks, setDucks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const abortController = new AbortController();
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const duckData = await getAllDucks(abortController);
				setDucks(duckData);
			} catch (error) {
				if (error.name === 'AbortError') {
					console.info('Fetch Aborted');
				} else {
					console.error(error);
					setError('Error bringing ducks to the pond.');
				}
			} finally {
				setLoading(false);
			}
		})();

		return () => {
			abortController.abort();
		};
	}, []);
	return (
		<DuckContext value={{ ducks, setDucks, loading, error }}>
			{children}
		</DuckContext>
	);
};

export default DuckProvider;
