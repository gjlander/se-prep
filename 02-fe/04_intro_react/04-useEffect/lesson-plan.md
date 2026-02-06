# React Hooks: useEffect

## Topics for exercises

- Basic usage
- Dependency array
- Cleanup functions

## Go through playground

## Let's look at a practical example in our Duck Pond

- When `App` mounts (renders for the first time), we are setting our array of ducks in state, then rendering it.
- Let's actually turn that into a network request
- You can write the code inside the component, like the playground example, but we want to modularize (break up) our code

## Make a fetchAllDucks function and import it

- Create a new `data` folder, and `ducks.js`
- This will look just like other getting functions we've written

```js
const getAllDucks = async () => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks');
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const data = await res.json();
	// console.log(data);

	return data;
};

export { getAllDucks };
```

- Then we import it into `App.jsx`

```js
import { getAllDucks } from './data/ducks';
```

### Import useEffect and call it

- first argument is the callback, second is the dependency array
- To start, you can always just type out the architecture of it

```js
useEffect(() => {}, []);
```

- We'll use an empty dependency array so that the request is only made once when the page initially loads

- Now to get our ducks we call it. The obvious answer would be to make the callback async

```js
useEffect(async () => {
	const ducks = await getAllDucks();
}, []);
```

- If we try to do that, we get the error that the callback can't be async. This gives us a few options
- 1. We could use .then to handle the promise
- 2. We could write an async function, and then call it inside
- We'll go with option 2

```js
const getAndSetDucks = async () => {
	const allDucks = await getAllDucks();
	setDucks(allDucks);
};
getAndSetDucks();
```

- Because we want to define the function, and immediately call it, we can get fancy and make a self-invoking function
- This is an anonymous function that immediately executes, you just wrap you function in (), then put empty () after it

```js
useEffect(() => {
	(async () => {
		const allDucks = await getAllDucks();
		setDucks(allDucks);
	})();
}, []);
```

- Since this is async, and we don't have a try/catch block in our `getDucks` function, we can add one here
- If an error gets thrown in getDucks, it will still land in the catch block of our parent function

```js
(async () => {
	try {
		const allDucks = await getAllDucks();

		setDucks(allDucks);
	} catch (error) {
		console.error(error);
	}
})();
```

- Because this only runs once (or twice in development), we don't have to worry about racing conditions, so a cleanup function isn't strictly necessary

## But it's still good practice, so let's add it in

- We can use the ignore flag, or AbortController. We will default to AbortController

```js
useEffect(() => {
	const abortController = new AbortController();
	(async () => {
		try {
			const allDucks = await getAllDucks();

			setDucks(allDucks);
		} catch (error) {
			if (error.name === 'AbortError') {
				console.info('Fetch aborted');
			} else {
				console.error(error);
			}
		}
	})();

	return () => {
		abortController.abort();
	};
}, []);
```

- Because our fetch request needs the `abortController`, we now pass it as an argument

```js
const allDucks = await getAllDucks(abortController);
```

- `ducks.js`

```js
const getAllDucks = async abortCont => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks', {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const data = await res.json();
	// console.log(data);

	return data;
};

export { getAllDucks };
```

## Adding loading and error states

- Since a network request is async, we can render some fallback UI while it's still loading. We can also show some UI in case of error by creating an error state

### Loading state

- We set the loading state to true when we run the effect, and we set the default to true so we don't get a flash of something when the page first loads

```js
const [loading, setLoading] = useState(true);
async () => {
	setLoading(true);
};
```

- Then, whether or not an error occurred, we set loading to false with the `finally` block

```js
finally {
				setLoading(false);
			}
```

- We pass our loading sate as props, then use it in `DuckPond`
- Then we conditionally render a (now simple) loading screen, but this could later be a spinner or something better

```js
const DuckPond = ({ ducks, loading }) => {
	return (
		<section id='pond' className='flex justify-center flex-wrap gap-4 p-4 w-full'>
			{loading && <p className='text-center text-gray-600 font-medium'>Loading...</p>}
			{!loading && ducks.map(duck => <DuckCard key={duck._id} {...duck} />)}
		</section>
	);
};
```

- We can use the `sleep` function to simulate a slow network request

```js
const sleep = ms => new Promise(res => setTimeout(res, ms));

await sleep(2000);
```

### Error state

- We set our initial state to null, since there is no error. And reset the error when the effect runs

```js
const [error, setError] = useState(null);

setLoading(true);
setError(null);
```

- If we land in the catch block, we set the error

```js
catch (error) {
				if (error.name === 'AbortError') {
					console.info('Fetch aborted');
				} else {
					console.error(error);
					setError('Error bringing ducks to the pond');
				}
			}
```

- Pass it via props and conditonally render

```js
const DuckPond = ({ ducks, loading, error }) => {
	return (
		<section id='pond' className='flex justify-center flex-wrap gap-4 p-4 w-full'>
			{loading && <p className='text-center font-medium'>Loading...</p>}
			{error && <p className='text-center text-red-500 font-semibold'>{error}</p>}
			{!loading && !error && ducks.map(duck => <DuckCard key={duck._id} {...duck} />)}
		</section>
	);
};
```

## This will be your most common use case for useEffect. useEffect should be used sparingly. Before you use it ask yourself

1. Am I trying to sync/connect with something outside of React?
   - If the answer is no, use state to update the UI
2. Is this update based on user input or action?
   - If the answer is yes, make the fetch request, or whatever logic is needed, inside of an event handler.

```

```
