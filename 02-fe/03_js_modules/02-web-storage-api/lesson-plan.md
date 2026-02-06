# Web Storage API

## What is localStorage?

- Way of having data persist between page refresh. Stores on the client

- Go to docs: [Web Storage API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API#concepts_and_usage)
- Open tab, show dark theme
- Stores in key, value pairs
- Use cases: Theme, user settings, JWT tokens. DO NOT store sensitive data
- Unique to each origin, stored by the client

## Tour of the app

- Since our app is growing, used a common structure, where we have our `index.html` file in the root folder, and then create a `src` folder for all of our other files
- Added a second page for adding a duck to our person pond (in local storage)
- and a new `js` file for the new page

#### We'll work up to that, but first let's go over some basics of localStorage

## 4 Methods: .setItem(), .getItem(), .removeItem(), .clear()

### .setItem()

- Two arguments: key, value
- Always show in dev tools

```js
localStorage.setItem('newThing', 'Look Ma, I set something in localStorage!');
```

- What happens if I set a new item with the same key? ( It overrides it)

### .getItem()

- One argument: key
- Returns value of that key
- Emphasize difference between variable and item

```js
const myNewThing = localStorage.getItem('newThing');
console.log('value of newThing: ', myNewThing);
```

### .removeItem()

- Takes key as argument, removes item from localStorage
- Returns null, important to note

```js
setTimeout(() => {
  localStorage.removeItem('newThing');
}, 3000);
```

- What will the value of each of these console.logs be?

```js
setTimeout(() => {
  localStorage.removeItem('newThing');
  console.log('after removing: ', localStorage.getItem('newThing'));
  console.log('variable after removing: ', myNewThing);
}, 3000);
```

### clear()

- Takes no arguments, removes all items from localStorage

  > Comment out timeout

- Briefly go over what I copied here

```js
localStorage.setItem('newThing', 'Look Ma, I set something in localStorage!');
localStorage.setItem('secondThing', 'Look Ma, I set something else in localStorage!');
localStorage.setItem('thirdThing', 'Look Ma, I set a third thing in localStorage!');
localStorage.clear();
```

- Can also manually delete items in dev tools

## localStorage only stores strings, anything that isn't a string will be coerced into a string

### What if we want to store more complex data?

#### Now let's look at adding a new duck to the local pond

- We can still use most of our event listener, we won't worry about rendering just yet
- Doesn't need to be async, and can get rid of the try/catch block
- Let's start with just setting it to localStorage

```js
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
      _id: ducksInThePond.length,
      name: name.value,
      imgUrl: imgUrl.value,
      quote: quote.value
    };

    localStorage.setItem('newDuck', newDuck);
  } catch (error) {
    alert(error.message);
  }
});
```

- Why did it save as [object Object]?
- Since we can only save strings, we need to convert it to JSON format

## In comes JSON

- Go to docs: [JSON Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

### JSON.stringify()

- Just like we had to stringify our newDuck to send it in the body, we also have to stringify to save it here
- Now it saves properly

```js
localStorage.setItem('newDuck', JSON.stringify(newDuck));
```

### But we want a pond full of ducks... we can save an array of objects!

- We could use the .push() method, but we could also use the spread operator
- Create an empty array for the ducks

```js
const myDucks = [];

//inside submit handler
const updatedDucks = [...myDucks, newDuck];

// localStorage.setItem('newDuck', JSON.stringify(newDuck));
localStorage.setItem('myDucks', JSON.stringify(updatedDucks));
```

- Show in app tab

### Check localStorage for initial value

- Now if we try to add more ducks, we still only have 1-why?
- We are always setting our initial value to an empty array, we need to first check localStorage. We'll need a couple of things here

#### First we use our localStorage.getItem()

- Log, then show type -it's a string

```js
const myDucks = localStorage.getItem('myDucks');
console.log(myDucks);
console.log(typeof myDucks);
```

- Just as we had to convert things into strings to store, when we get from storage, we have to convert it back into a JS object. For that we use `JSON.parse()`

### JSON.parse()

- Once it is parsed, it's all good and we can work with it

```js
const myDucks = localStorage.getItem('myDucks');
const parsedDucks = JSON.parse(myDucks);
console.log(myDucks);
console.log(typeof myDucks);
console.log(parsedDucks);
```

- This can also be done in a single line like this

```js
const myDucks = JSON.parse(localStorage.getItem('myDucks'));
```

#### This works if we have items, but remember we get null if the item doesn't exist

- Clear localStorage then try to add a new duck, show error
- We want this to always be an array
- Null is falsy, so if there is no item called ducks we start with an empty array by using the logical || operator

```js
const myDucks = JSON.parse(localStorage.getItem('myDucks')) || [];
```

### Now let's actually render our new duck

- We can reuse our rendering function from `index.js`, also need reference to `my-pond` section

```js
const myPond = document.querySelector('#my-pond');

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

- Then just call it inside our submit handler like before

```js
// inside submit handler
renderSingleDuck(newDuck, myPond);
```

### While we're at it, let's render all of our ducks in localStorage

```js
myDucks.forEach(duck => {
  renderSingleDuck(duck, myPond);
});
```
