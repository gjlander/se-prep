# Web Apis & DOM API

## Points for exercises

- Select elements
- Access element properties and update them
- Create elements
- Event listeners (form submission)

## Let's start with a simple webpage

- We'll make a pond for our rubber duck debuggers to hang out in
- Add our tailwind CDN and empty tailwind.config.js file
- We have a header, and an empty section
- And a simple form for adding a new duck to the pond

## Access elements

- document.querySelector(), use your CSS selectors to target the first element that matches that selector

```js
const header = document.querySelector('header');
console.log(header);
```

- It has a lot of properties on it, highlight classList, className, id, textContent, style
- This is an object, so we can use dot notation to update these properties

```js
header.classList.add('bg-slate-400', 'p-4', 'rounded-md');
header.textContent = "Hehe, I'm new now";
```

- Can also use combinators

```js
const h1 = document.querySelector('header h1');
console.log(h1);
```

- I'm not sure why, but sometimes with console.log() it shows the HTML element like HTML, to still see the properties, you can use `console.dir()`

```js
console.dir(h1);
```

#### NodeList

- say you don't just want the first item, but several
- document.querySelectorAll() returns a NodeList - this is like an Array, but doesn't have most of the methods

```js
const inputs = document.querySelectorAll('#add-form input');
console.log(inputs);
```

- Can still iterate over using forEach, for of..., or for loop

### Other methods, but will default to querySelector, refer to [slide 3](https://playground.wbscod.in/static/web-apis-dom/3)

## Create elements

### Template Strings - Let's actually show some ducks!

- Let's pretend we have our ducks saved somewhere in a database. When the page loads, we'll make a fetch request, and then for each duck we make a card
- For now, we'll just use an array of objects

```js
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
```

- Go over the properties
- Here's why we have our empty section, we want our ducks to render in here
- First we grab a reference to the section- how do I do that?

```js
const pond = document.querySelector('#pond');
```

- For organization, I like to put global variables at the top
- We can write a function that takes an array of objects and the container we want to render in as arguments

```js
const renderDucks = (ducksArray, container) => {
  container.innerHTML = '';
  ducksArray.forEach(duck => {
    container.innerHTML += ` 
        <div class='shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col'>
             <figure class='rounded-t-md overflow-hidden w-full h-96'>
                <img
                    class='w-full h-full'
                    src=${duck.imgUrl}
                    alt=${duck.name}
                />
            </figure>
            <div class='flex flex-col p-6 pt-2 rounded-b-md bg-slate-800 h-40'>
                <h2 class='text-3xl border-b-2 mb-4 border-b-gray-400'>
                    ${duck.name}
                </h2>
                <p>${duck.quote}</p>
            </div>
        </div>
        `;
  });
};
```

- Then, since our JS script runs when the page loads, we can simply call the function

```js
renderDucks(ducksInThePond, pond);
```

- This dot notation is kinda ugly how, how could we use object destructuring to make it look nicer?

```js
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
```

- The end result is exactly the same, just looks a bit nicer (though I guess that's up for debate)

### document.createElement()

- Template literals are convenient and readable, but they are a security risk. For the context of the bootcamp, they're still useful, so we'll use them. But for real-world application use with caution
- Other option is with document.createElement(), we will cover that in more detail soon

## Events

- Let's say we don't want our ducks to appear when the page loads. We want to have a button that the user will click to summon the ducks instead. For that, we'll need the button (obviously), and then what's called an event listener
- First make the button, then make a reference to it in our JS

```html
<button id="summon-btn" class="bg-purple-600 p-4 rounded-lg text-2xl">Summon the ducks!</button>
```

```js
const summonBtn = document.querySelector('#summon-btn');
```

- There are several types of events, the most common we'll work with are submit, and click. We use the addEventListener() method
- First arg is the event type, second is the callback
- We can simply move our render ducks function inside of the callback

```js
summonBtn.addEventListener('click', () => renderDucks(ducksInThePond, pond));
```

- Second option is to change the onclick

```js
summonBtn.onclick = () => renderDucks(ducksInThePond, pond);
```

- We will default to using addEventListener()

### Submit Event

- Let's finally do something with that form!
- Get a reference to it

```js
const addForm = document.querySelector('#add-form');
```

- Add a submit listener

```js
addForm.addEventListener('submit', () => console.log('Tried to add a new duck!'));
```

- We can see this refreshed the page - annoying! Why? How can we stop that?
- By default, forms always refresh the page, for each event, we can pass that event as an argument. Then we have access to different methods and properties.
- We can also prevent this default behavior

```js
addForm.addEventListener('submit', e => {
  e.preventDefault();
  console.log(e);
  console.log('Tried to add a new duck!');
});
```

- We can always access the event target - which is refers to the HTML element the event is happening on
- There are lots of ways we could use this, but for today we'll go simple, and just grab a reference to the inputs we need using querySelector. Just like we could use the document, can also use other elements

```js
addForm.addEventListener('submit', e => {
  e.preventDefault();
  // console.log(e.target);
  const name = addForm.querySelector('#name');
  const imgUrl = addForm.querySelector('#img-url');
  const quote = addForm.querySelector('#quote');

  console.dir(name);
  console.dir(imgUrl);
  console.dir(quote);

  console.log('Tried to add a new duck!');
});
```

- Inputs have a value property, we can use that to now use the user input

```js
console.log(name.value);
console.log(imgUrl.value);
console.log(quote.value);
```

- We can make a newDuck object, and assign the input values to the property values

```js
const newDuck = {
  _id: ducksInThePond.length,
  name: name.value,
  imgUrl: imgUrl.value,
  quote: quote.value
};

console.log(newDuck);
```

#### Form validation and reset

- We only want the form to submit if all our our required fields are filled out. Rather than relying on HTML (which can be easily overwritten) we can add some basic validation ourselves

- Because empty strings are falsy, we can check for them. We'll also use the `trim()` method to remove whitespace
- If something required is missing, we can throw an error with a descriptive message

```js
if (!name.value.trim()) {
  throw new Error('Name is required');
}
if (!imgUrl.value.trim()) {
  throw new Error('Image URL is required');
}
if (!quote.value.trim()) {
  throw new Error('Quote is required');
}
```

- Now if we submit with an empty field, we get an `Uncaught Error`. We'll use a try/catch block to handle the error

```js
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
} catch (error) {}
```

- Now if an error is thrown, we can have our logic in the catch block, we'll simply show an alert with the error message

```js
catch (error) {
    alert(error.message);
  }
```

- As a final touch, we can reset the form to clear all inputs on success

```js
e.target.reset();
```

- All well and good, we want to see the new duck! Have to render it, this time we'll use createElement()

#### Let's start with a simple version

```js
const renderSingleDuck = (duckObj, container) => {
  const { imgUrl, name, quote } = duckObj;
  const card = document.createElement('div');
  card.className = 'shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col';
  card.textContent = name;

  container.appendChild(card);
};
```

- Now buckle up for the full thing

```js
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
```

- This has no persistence - it's not saved anywhere. If we reload the page it's gone. We'll look how to actually save this later this week.

### I know that's a lot! Use the playground, the docs, and the lecture code to help you on the exercises. Don't feel like you have to 100% exercise 2. Do at least the navbar, but one you feel like you have the hang of it, move on and come back to it if you have time. Treat #5 as bonus.
