const pond = document.querySelector('#pond');
const summonBtn = document.querySelector('#summon-btn');
const addForm = document.querySelector('#add-form');

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

const errorHandler = (error, container) => {
  console.error(error);
  const h2 = document.createElement('h2');
  h2.className = 'inline-block m-auto text-6xl mb-6 text-red-600';
  h2.textContent = error;
  container.appendChild(h2);
};

const getAllDucks = async () => {
  // console.log('You tried to fetch the ducks!');
  const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks');
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
  const data = await res.json();
  //   console.log(data);
  return data;
};

const createDuck = async newDuck => {
  // console.log('You tried to fetch the ducks!');
  const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks/', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newDuck)
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
  const data = await res.json();
  //   console.log(data);
  return data;
};

// summonBtn.addEventListener('click', () => {
//     // console.log('You tried to summon the ducks!');
//     fetch('https://duckpond-89zn.onrender.com/ducks/')
//         .then((res) => {
//             if (!res.ok)
//                 throw new Error(`${res.status}. Something went wrong!`);
//             // console.log(res);
//             return res.json();
//         })
//         .then((data) => renderDucks(data, pond))
//         .catch((err) => errorHandler(err, pond));
// });

summonBtn.addEventListener('click', async () => {
  try {
    const allDucks = await getAllDucks();
    renderDucks(allDucks, pond);
  } catch (err) {
    errorHandler(err, pond);
  }
});

addForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name = addForm.querySelector('#name');
  const imgUrl = addForm.querySelector('#img-url');
  const quote = addForm.querySelector('#quote');

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
      name: name.value,
      imgUrl: imgUrl.value,
      quote: quote.value
    };
    const duckData = await createDuck(newDuck);
    renderSingleDuck(duckData, pond);
    e.target.reset();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
