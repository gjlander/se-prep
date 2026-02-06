const ducksInThePond = [
  {
    _id: 1,
    name: 'Sir Quacks-a-lot',
    imgUrl:
      'https://cdn11.bigcommerce.com/s-nf2x4/images/stencil/1280x1280/products/430/7841/Knight-Rubber-Duck-Yarto-2__93062.1576270637.jpg?c=2',
    quote: 'I will slay your bugs!'
  },
  {
    _id: 2,
    name: 'Captain Quack Sparrow',
    imgUrl: 'https://www.veniceduckstore.it/cdn/shop/products/Captain-Quack-Rubber-Duck-slant.jpg',
    quote: "You'll always remember this as the day you almost squeezed Captain Quack Sparrow."
  },
  {
    _id: 3,
    name: 'Ruder Duck',
    imgUrl: 'https://i.ebayimg.com/images/g/vToAAOSwr6hdW8L8/s-l1600.jpg',
    quote: '#@*% off! Debug your own code!'
  },
  {
    _id: 4,
    name: 'Darth Quacker',
    imgUrl: 'https://www.duckshop.de/media/image/3c/ce/25/Black_Star_Badeente_58495616_4_600x600.jpg',
    quote: 'No, I am your debugger!'
  },
  {
    _id: 5,
    name: 'Spider-Duck',
    imgUrl:
      'https://i5.walmartimages.com/seo/Spidy-Super-Hero-Rubber-Duck_a42dbd68-e8cd-41f2-ac6d-c812a3a00339.bc3415f3b98088ac58eaeda1f06c10c9.png?odnHeight=640&odnWidth=640&odnBg=FFFFFF',
    quote: 'Does whatever a Spider-Duck can!'
  },
  {
    _id: 6,
    name: 'Sr Developer Duckbert',
    imgUrl: 'https://www.duckshop.de/media/image/91/86/a1/Nerd_Badeente_67685078_600x600.jpg',
    quote: 'Come to me with your BIG bugs!'
  },
  {
    _id: 7,
    name: 'Quacker',
    imgUrl: 'https://m.media-amazon.com/images/I/61iqP4VFsEL.__AC_SX300_SY300_QL70_ML2_.jpg',
    quote: 'Why so serious?'
  },
  {
    _id: 8,
    name: 'Mad Quacker',
    imgUrl: 'https://duckycity.com/cdn/shop/products/SG-REYTD-JCNYO_1024x1024_clipped_rev_1-min_540x.jpeg?v=1505504539',
    quote: 'Be careful, or I might just make your bugs into SUPER bugs!'
  },
  {
    _id: 9,
    name: 'Ducklock Holmes',
    imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbw5dFwbwPw_Uf_KTKU94mljxvtCcZzMCmKA&s',
    quote: ''
  }
];

const header = document.querySelector('header');
const h1 = document.querySelector('header h1');
const pond = document.querySelector('#pond');
const summonBtn = document.querySelector('#summon-btn');
const addForm = document.querySelector('#add-form');
// const inputs = document.querySelectorAll('#add-form input');

// console.log(header);
header.classList.add('bg-slate-400', 'p-4', 'rounded-md');
// header.textContent = "Hehe, I'm new now";

// console.dir(h1);

// console.log(inputs);

//with Template String
const renderDucks = (ducksArray, container) => {
  container.innerHTML = '';
  ducksArray.forEach(({ imgUrl, name, quote }) => {
    container.innerHTML += ` 
        <div class='shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col'>
             <figure class='rounded-t-md overflow-hidden w-full h-96'>
                <img
                    class='w-full h-full'
                    src=${imgUrl}
                    alt=${name}
                />
            </figure>
            <div class='flex flex-col p-6 pt-2 rounded-b-md bg-slate-800 h-40'>
                <h2 class='text-3xl border-b-2 mb-4 border-b-gray-400'>
                    ${name}
                </h2>
                <p>${quote}</p>
            </div>
        </div>
        `;
  });
};
// const renderSingleDuck = (duckObj, container) => {
//     const { imgUrl, name, quote } = duckObj;
//     const card = document.createElement('div');
//     card.className =
//         'shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col';
//     card.textContent = name;

//     container.appendChild(card);
// };

const renderSingleDuck = (duckObj, container) => {
  const { imgUrl, name, quote } = duckObj;
  const card = document.createElement('div');
  card.className = 'shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col';

  const figure = document.createElement('figure');
  figure.className = 'rounded-t-md overflow-hidden w-full h-96';
  const img = document.createElement('img');
  img.className = 'w-full';
  img.src = imgUrl;
  img.alt = name;
  figure.appendChild(img);

  const body = document.createElement('div');
  body.className = 'flex flex-col p-6 pt-2 rounded-b-md bg-slate-800 h-40';
  const title = document.createElement('h2');
  title.className = 'text-3xl border-b-2 mb-4 border-b-gray-400';
  title.textContent = name;
  const text = document.createElement('p');
  text.textContent = quote;
  body.appendChild(title);
  body.appendChild(text);

  card.appendChild(figure);
  card.appendChild(body);

  container.appendChild(card);
};

// renderDucks(ducksInThePond, pond);

summonBtn.addEventListener('click', () => renderDucks(ducksInThePond, pond));

// summonBtn.onclick = () => renderDucks(ducksInThePond, pond);

addForm.addEventListener('submit', e => {
  e.preventDefault();
  // console.log(e.target);
  const name = addForm.querySelector('#name');
  const imgUrl = addForm.querySelector('#img-url');
  const quote = addForm.querySelector('#quote');

  // console.log(name.value);
  // console.log(imgUrl.value);
  // console.log(quote.value);
  try {
    if (!name.value.trim()) {
      throw new Error('Name is required');
    }
    if (!imgUrl.value.trim()) {
      throw new Error('Image URL is required');
    }
    if (!quote.value.trim()) {
      throw new Error('Quote is required');
    }
    const newDuck = {
      _id: ducksInThePond.length,
      name: name.value,
      imgUrl: imgUrl.value,
      quote: quote.value
    };

    console.log(newDuck);
    renderSingleDuck(newDuck, pond);
    e.target.reset();
  } catch (error) {
    alert(error.message);
  }
});
