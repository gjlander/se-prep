import DuckCard from './DuckCard';

const DuckPond = ({ ducks }) => {
  return (
    <section id='pond' className='flex justify-center flex-wrap gap-4 p-4 w-full'>
      {/* <DuckCard duck={singleDuck} {...duck} prop2="I'm also here" /> */}
      {ducks.map(duck => (
        <DuckCard key={duck._id} {...duck} />
      ))}
    </section>
  );
};

export default DuckPond;
