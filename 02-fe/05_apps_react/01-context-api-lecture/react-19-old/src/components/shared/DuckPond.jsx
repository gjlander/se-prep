import { Link } from 'react-router';
import { useDucks } from '../../context';
import DuckCard from './DuckCard';

const DuckPond = () => {
	const { ducks, loading, error } = useDucks();
	// console.log(context);
	return (
		<section
			id='pond'
			className='flex justify-center flex-wrap gap-4 p-4 w-full'
		>
			{loading && (
				<p className='text-center font-medium text-4xl'>Loading...</p>
			)}
			{error && (
				<p className='text-center text-red-500 font-semibold text-4xl'>
					{error}
				</p>
			)}
			{!loading &&
				!error &&
				ducks.map(duck => (
					<Link key={duck._id} to={`ducks/${duck._id}`}>
						<DuckCard {...duck} />
					</Link>
				))}
		</section>
	);
};

export default DuckPond;
