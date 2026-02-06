import type { Duck } from '../types';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getDuckById } from '../data';
const DuckPage = () => {
	const { duckId } = useParams();
	const [currDuck, setCurrDuck] = useState<Duck | null>(null);
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};
	console.log('duckId: ', duckId);

	useEffect(() => {
		const abortController = new AbortController();
		(async () => {
			try {
				const duckData = await getDuckById(duckId ?? '', abortController);

				setCurrDuck(duckData);
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
	}, [duckId]);

	if (!currDuck) return <div>Loading...</div>;
	const { name, imgUrl, quote } = currDuck;
	return (
		<div className='hero bg-base-100 min-h-screen'>
			<div className='hero-content flex-col lg:flex-row'>
				<img src={imgUrl} className='max-w-sm rounded-lg shadow-2xl' />
				<div>
					<h1 className='text-5xl font-bold'>{name}</h1>
					<p className='py-6'>{quote}</p>
					<button onClick={handleGoBack} className='btn btn-primary'>
						Go back
					</button>
				</div>
			</div>
		</div>
	);
};

export default DuckPage;
