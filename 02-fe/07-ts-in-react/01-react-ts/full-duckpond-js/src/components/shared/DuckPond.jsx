import { Link } from 'react-router';
import { useDucks } from '../../context';
import DuckCard from './DuckCard';

const DuckPond = () => {
  const { ducks } = useDucks();
  // console.log(context);
  return (
    <section id='pond' className='flex justify-center flex-wrap gap-4 p-4 w-full'>
      {ducks.map(duck => (
        <Link key={duck._id} to={`ducks/${duck._id}`}>
          <DuckCard {...duck} />
        </Link>
      ))}
    </section>
  );
};

export default DuckPond;
