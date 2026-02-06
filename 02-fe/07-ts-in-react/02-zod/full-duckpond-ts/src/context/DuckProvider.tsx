import type { Duck, DuckContextType } from '../types';
import { useState, useEffect, type ReactNode } from 'react';

import { getAllDucks } from '../data';
import { DuckContext } from '../context';

type DuckProviderProps = {
	children: ReactNode;
};

const DuckProvider = ({ children }: DuckProviderProps) => {
	const [ducks, setDucks] = useState<Duck[]>([]);
	useEffect(() => {
		const abortController = new AbortController();
		(async () => {
			try {
				const allDucks = await getAllDucks(abortController);

				setDucks(allDucks);
			} catch (error) {
				if (error instanceof Error && error.name === 'AbortError') {
					console.info('Fetch aborted');
				} else {
					console.error(error);
				}
			}
		})();

		return () => {
			abortController.abort();
		};
	}, []);

	const value: DuckContextType = { ducks, setDucks };
	return <DuckContext value={value}>{children}</DuckContext>;
};

export default DuckProvider;
