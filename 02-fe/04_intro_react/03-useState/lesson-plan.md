# React Hooks: useState

## Topics for exercise

- General useState basics
- State is local
- Update based on previous state
- Conditional rendering with state - classes
- Object as state (form)
- Sharing state

# Slide show

## Rendering in React (Slide 4) go to [playground](https://playground.wbscod.in/react/react-hooks-usestate/1)

- Open dev tools and show markup
- Demonstrate nothing happens

### Back to slide 5

## What is State? (Slide 7), back to playground slide 2

- Open devtools again, show it updates
- State lets React know to rerender
- Still using DOM manipulation under the hood, just like Tailwind is using Vanilla CSS under the hood.

## Stay in playground for final slide - Anatomy of State

- you can pass an initial state as an argument
- useState returns an array with 2 items
- The first item is always the state itself, the second is a function to update it
- Common practice is to use destructuring to access them directly

## Let's add some state to our Duck Pond

## Conditional Rendering with State

- In our `Navbar` we have a hard coded value for `isSignedIn`, let's change that to a state
- First we import useState from React
- Then we declare our state and setter
- We'll pass it an initial state of `false`. You're not signed in when you first visit the site

```js
import { useState } from 'react';
const Navbar = () => {
  // const isSignedIn = false;
  const [isSignedIn, setIsSignedIn] = useState(false);
  //...rest of component
};
```

- Now let's use a click event to update our state to true

```js
const handleClick = () => setIsSignedIn(true);
```

- And add it to our sign in button

```js
<button onClick={handleClick}>Sign In</button>
```

- Now, it updates our state, which causes that part of the page to rerender!

### Updating based on previous state

- Now we can only sign in, what about signing out?
- We could in theory, write a second function, but we don't need to.
- As you may have noticed in the counter examples, we can also pass a callback function to our setter. This let's us update based on the previous state
- The previous state is passed as an argument, then you return the new state
- Since this is a simple boolean switch, we can simply set it to the logical opposite

```js
const handleClick = () => setIsSignedIn(prev => !prev);
```

- Then add it as an onClick to our sign out button

```js
<button onClick={handleClick}>Sign Out</button>
```

- Now we can sign in and out!

### React Developer Tools

- In addition to our usual dev tools, we can download a [Chrome extension](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) to give us additional tools while working with React

#### Components tab

- Similar to the elements tab, but this shows us our React components
- When we hover, it highlights the component
- If we click on it, and there's state inside, it shows it to us. There's a small lag, but it shows us our signedIn state in the header. Great tool for debugging

## Complex state

- In our duck form, we have several inputs as part of our form.
- In theory, we could have a separate state for each one, and a separate handler to update them, but that isn't very efficient.
- Better is to have a single state that is an object, representing the entire form
- We set the initial state as an empty string, to represent an unused input

```js
import { useState } from 'react';
const DuckForm = () => {
  const [form, setForm] = useState({
    name: '',
    imgUrl: '',
    quote: ''
  });
  //...rest of component
};
```

- Then we need to add a name property to each of our inputs that matches the key in our state object
- We can also delete the id, since we're not using it anymore
- We also want the value to come from our state now

```js
<form id='add-form' className='flex flex-col gap-4 w-3/4'>
  <label className='w-full flex gap-2 items-baseline'>
    <span className='text-xl'>Name:</span>
    <input
      onChange={handleChange}
      value={form.name}
      name='name'
      type='text'
      placeholder="What is your duck's name?"
      className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 flex-grow'
    />
  </label>
  <label className='w-full flex gap-2 items-baseline'>
    <span className='text-xl'>Image:</span>
    <input
      onChange={handleChange}
      value={form.imgUrl}
      name='imgUrl'
      type='url'
      placeholder='What does your duck look like?'
      className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
    />
  </label>
  <label className='w-full flex gap-2 items-baseline'>
    <span className='text-xl'>Quote:</span>
    <input
      onChange={handleChange}
      value={form.quote}
      name='quote'
      type='text'
      placeholder='What does your duck say?'
      className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
    />
  </label>
  <button type='submit' className='bg-green-600 p-2 rounded-lg font-bold'>
    Add duck
  </button>
</form>
```

#### Now when we type, our input isn't updating. We need to update the form state using the setter in order to see the updates.

### Updating our form with a single handleChange

- Let's update our onChange to change our form state instead of console logging
- We want to update based on previous state, so we need our callback function
- When working with state, we always have to make a copy, so first we copy our previous state with the spread operator
- Then we want to only update the input that we're currently on. This is where the name property matching the key comes into play
- We can use the `e.target.name` as the key property, and update it to the `e.target.value`

```js
const handleChange = e => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
```

#### Now why did we bother to do all of this, if the end result looks the same?

- Big whoop, we can type in the inputs, we could do that before.
- We want React to be our "one source of truth". By having a form state, now React knows what's happening, and we prevent things from getting out of sync

## Last piece: Passing state as props

- Now let's try to actually update our Pond when we make a new duck
- Let's move our ducks into `App.jsx` so both components can access it, and make it a state
- Then we can pass it as props down to the duckpond
- Our duckform is going to need the setter

```js
function App() {
  const [ducks, setDucks] = useState(ducksInThePond);
  return (
    <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
      <Navbar />
      <Header />
      <main className='flex-grow flex flex-col justify-between py-4'>
        <DuckPond ducks={ducks} />
        <DuckForm setDucks={setDucks} />
      </main>
      <Footer />
    </div>
  );
}
```

### Back in our DuckForm, let's create a submit handler

- In it, we want to add our new duck to the end of the array
- We have everything we need, except the id, so let's add that

```js
const handleSubmit = e => {
  e.preventDefault();
  const newDuck = { ...form, _id: crypto.randomUUID() };
  console.log(newDuck);
};
```

- We can't mutate the original array, so we can use the spread operator again

```js
const handleSubmit = e => {
  e.preventDefault();
  const newDuck = { ...form, _id: crypto.randomUUID() };
  console.log(newDuck);

  setDucks(prev => [...prev, newDuck]);
};
```

- And boom! Our new duck appears! But only in state, no persistence yet
- We can now use our state to validate the inputs, very similar to vanilla JS

```js
const handleSubmit = e => {
  e.preventDefault();
  try {
    if (!form.name.trim()) {
      throw new Error('Name is required');
    }
    if (!form.imgUrl.trim()) {
      throw new Error('Image URL is required');
    }
    if (!form.quote.trim()) {
      throw new Error('Quote is required');
    }
    const newDuck = { ...form, _id: crypto.randomUUID() };
    console.log(newDuck);

    setDucks(prev => [...prev, newDuck]);
  } catch (error) {
    alert(error.message);
  }
};
```

- Very last step is to reset our form state

```js
setForm({
  name: '',
  imgUrl: '',
  quote: ''
});
```
