// localStorage.setItem('newThing', 'Look Ma, I set something in localStorage!');
// localStorage.setItem('newThing2', 'Look Ma, I set something in localStorage!');
// localStorage.setItem('newThing3', 'Look Ma, I set something in localStorage!');

// localStorage.setItem('newThing', 'Overwritten!');

// const myNewThing = localStorage.getItem('newThing');
// console.log('value of newThing: ', myNewThing);

// setTimeout(() => {
//     localStorage.removeItem('newThing');
//     console.log('after removing: ', localStorage.getItem('newThing'));
//     console.log('variable after removing: ', myNewThing);
// }, 3000);

// localStorage.clear();

const myDucks = JSON.parse(localStorage.getItem('myDucks')) || [];
// const parsedDucks = JSON.parse(myDucks);
// console.log(myDucks);
// console.log(typeof myDucks);
// console.log(parsedDucks);

const myPond = document.querySelector('#my-pond');
const addForm = document.querySelector('#my-pond-add-form');

const renderSingleDuck = (duckObj, container) => {
  const { imgUrl, name, quote } = duckObj;
  const card = document.createElement('div');
  card.className = 'shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col';

  const figure = document.createElement('figure');
  figure.className = 'rounded-t-md overflow-hidden w-full h-96';
  const img = document.createElement('img');
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

addForm.addEventListener('submit', e => {
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
      _id: 'id-' + crypto.randomUUID(),
      name: name.value,
      imgUrl: imgUrl.value,
      quote: quote.value
    };

    renderSingleDuck(newDuck, myPond);

    const updatedDucks = [...myDucks, newDuck];

    // localStorage.setItem('newDuck', JSON.stringify(newDuck));
    localStorage.setItem('myDucks', JSON.stringify(updatedDucks));
    e.target.reset();
  } catch (error) {
    alert(error.message);
  }
});

myDucks.forEach(duck => {
  renderSingleDuck(duck, myPond);
});
