import DuckCard from './DuckCard';
// const singleDuck = {
//     _id: 1,
//     name: 'Sir Quacks-a-lot',
//     imgUrl: 'https://cdn11.bigcommerce.com/s-nf2x4/images/stencil/1280x1280/products/430/7841/Knight-Rubber-Duck-Yarto-2__93062.1576270637.jpg?c=2',
//     quote: 'I will slay your bugs!',
// };

const DuckPond = ({ ducks }) => {
    return (
        <section
            id='pond'
            className='flex justify-center flex-wrap gap-4 p-4 w-full'
        >
            {/* <DuckCard duck={singleDuck} prop2="I'm also here" /> */}
            {ducks.map((duck) => (
                <DuckCard key={duck._id} {...duck} />
            ))}
        </section>
    );
};

export default DuckPond;
