import { useState, useEffect } from 'react';

import { getAllDucks } from '../data/ducks';
import { DuckContext } from './duckContext';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

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
				await sleep(2000);
				const allDucks = await getAllDucks(abortController);

				setDucks(allDucks);
			} catch (error) {
				if (error.name === 'AbortError') {
					console.info('Fetch aborted');
				} else {
					console.error(error);
					setError('Error bringing ducks to the pond');
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
