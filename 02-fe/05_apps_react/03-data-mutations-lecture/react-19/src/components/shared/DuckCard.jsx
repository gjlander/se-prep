// const singleDuck = {
//     _id: 1,
//     name: 'Sir Quacks-a-lot',
//     imgUrl: 'https://cdn11.bigcommerce.com/s-nf2x4/images/stencil/1280x1280/products/430/7841/Knight-Rubber-Duck-Yarto-2__93062.1576270637.jpg?c=2',
//     quote: 'I will slay your bugs!',
// };

const DuckCard = ({ imgUrl, name, quote }) => {
    // console.log(duck, prop2);

    return (
        <div className='shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col'>
            <figure className='rounded-t-md overflow-hidden w-full h-96'>
                <img className='w-full h-full' src={imgUrl} alt={name} />
            </figure>
            <div className='flex flex-col p-6 pt-2 rounded-b-md bg-slate-800 h-40'>
                <h2 className='text-3xl border-b-2 mb-4 border-b-gray-400'>
                    {name}
                </h2>
                <p>{quote}</p>
            </div>
        </div>
    );
};

export default DuckCard;
