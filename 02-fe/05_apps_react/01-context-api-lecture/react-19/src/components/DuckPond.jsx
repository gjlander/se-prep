import { use } from 'react';
import DuckCard from './DuckCard';
import { DuckContext } from '../context/duckContext';

const DuckPond = () => {
	const { ducks, loading, error } = use(DuckContext);
	// console.log(context);
	return (
		<section
			id='pond'
			className='flex justify-center flex-wrap gap-4 p-4 w-full'
		>
			{loading && <p className='text-center font-medium'>Loading...</p>}
			{error && (
				<p className='text-center text-red-500 font-semibold'>{error}</p>
			)}
			{!loading &&
				!error &&
				ducks.map((duck) => <DuckCard key={duck._id} {...duck} />)}
		</section>
	);
};

export default DuckPond;
