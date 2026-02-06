# Context API

- When you have a piece of state ( or any data) that's needed in several parts of your application, passing deeply nested state can become annoying
- To solve that issue, React has the Context API. This is what was working under the hood to make `useOutletContext` work

## Local Playground example

- I've downloaded the [first slide of the context api playground](https://playground.wbscod.in/react/react-context-api/1), and given it the proper directory structure
- I've also added an example of prop drilling to compare it to

## Prop Drilling

- I've used this word before, but I don't think I've proper explained it
- We have defined a `user` in `App`, and we need access to that data in `NoContextGranChild`. Let's say, for whatever reason, that data is needed in other component trees, so we can't move it closer to the component that needs it.
- Our solution then, is to pass it as props to the `NoContextParent`

```js
<NoContextParent user={user} />
```

- Our `NoContextParent` doesn't need it, so it's just passed it along to the `NoContextChild`

```js
const NoContextParent = ({ user }) => {
	return (
		<div className='parent'>
			<code>Prop Drilling Parent</code>
			<NoContextChild user={user} />
		</div>
	);
};
```

- `NoContextChild` also doesn't need it, so it continues to pass it down to `NoContextGranChild`

```js
const NoContextChild = ({ user }) => {
	return (
		<div className='child'>
			<code>Prop Drilling Child</code>
			<NoContextGranChild user={user} />
		</div>
	);
};
```

- Where it is FINALLY used. This act of a component that doesn't need the state simply passing it on to a child, is what's known as prop drilling
- This can become difficult to keep track of, and a bit unwieldy to use...

## So we use Context instead

- The Context API has two main functions
  - createContext allows us to create the context object itself
  - use hook allows us to access the value of the context object
    - `use` was introduced in React 19 and has a dual purpose of consuming Promises and context
    - `useContext` was used before React 19, and is still usable, but we will default to using `use`
- So, in `App.jsx`, we first have to create the UserContext ( and export it)

```js
export const UserContext = createContext();
```

- Then we have to create a context provider. This defines the limits of where this context can be accessed - similar to how Outlet was our boundary for useOutletContext
- Now instead of passing `context={user}` we pass `value={user}`
  - Because we're only passing one piece of data, we don't need the double {} to pass as an object. To pass more values, we would have to.

```js
<UserContext value={user}>
	<ContextParent />
</UserContext>
```

- Now we can follow the tree down, and since those parent components don't need the data, they don't concern themselves with it
- Then in the GrandChild, we need to import the UserContext itself from `App.jsx` and use from react
- We pass the UserContext as an argument to useContext, and can access the value
  - Since it is a single value, we don't have to destructure

```js
import { use } from 'react';
import { UserContext } from '../App';
const ContextGranChild = () => {
	// Use the useContext hook to access the user object
	const user = use(UserContext);
	return (
		<div className='text-2xl text-center'>
			Hello there my name is {user.name} and I am {user.age} years old
		</div>
	);
};

export default ContextGranChild;
```

#### Questions about this basic setup before we transition to the Duckpond?

## Creating a DuckContext

- Currently we have a `ducks` state in `Home.jsx` and a `myDucks` state in `MyPond.jsx`. Since our form isn't saving to local storage anymore, let's unify that into one state that can be used across our app

### Create a new context folder, and create our new context

- Make `context` folder
- Make `index.js`

```js
import { createContext } from 'react';

const DuckContext = createContext();

export { DuckContext };
```

- Now back in `MainLayout.jsx`, we import the DuckContext, and wrap our whole application in it

```js
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { DuckContext } from '../context';
import { Navbar, Footer } from '../components';

const MainLayout = () => {
	return (
		<DuckContext>
			<div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
				<Navbar />
				<main className='flex-grow flex flex-col justify-between py-4'>
					<Outlet />
				</main>
				<Footer />
				<ToastContainer />
			</div>
		</DuckContext>
	);
};

export default MainLayout;
```

- Now let's initialize our `ducks` state in `MainLayout.jsx` instead of `Home.jsx`, along with our `error` and `loading` states

```js
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { getAllDucks } from '../data';
import { DuckContext } from '../context';
import { Navbar, Footer } from '../components';

const MainLayout = () => {
	const [ducks, setDucks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const abortController = new AbortController();
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const duckData = await getAllDucks(abortController);
				setDucks(duckData);
			} catch (error) {
				if (error.name === 'AbortError') {
					console.info('Fetch Aborted');
				} else {
					console.error(error);
					setError('Error bringing ducks to the pond.');
				}
			} finally {
				setLoading(false);
			}
		})();

		return () => {
			abortController.abort();
		};
	}, []);
	// jsx...
};
```

- Then we pass our states and setters that other components will need as `value` to our `DuckContext`

  - Since we're passing several values now, we'll use the double `{}` syntax to pass them as an object

```js
 <DuckContext value={{ ducks, setDucks, loading, error }}>
```

- Now back in `Home.jsx` we can clear out the state and useEffect, and since `Home` doesn't need the state anyway, we can move directly into `DuckPond` instead of passing props (we can do this since we won't use the `myDucks` state anymore either, otherwise we would still pass it as props to `DuckPond`)
- For that we'll need to import
  - `use` from React
  - `DuckContext` from `../context`

```js
import { use } from 'react';
import { Link } from 'react-router';
import { DuckContext } from '../../context';
import DuckCard from './DuckCard';
```

- Then call `use` and pass our `DuckContext` as an argument and store the return in a variable

```js
const DuckPond = () => {
	const context = use(DuckContext);
	console.log(context);
	return (
		<section
			id='pond'
			className='flex justify-center flex-wrap gap-4 p-4 w-full'
		>
			{/* {ducks.map(duck => (
        <Link key={duck._id} to={`ducks/${duck._id}`}>
          <DuckCard {...duck} />
        </Link>
      ))} */}
		</section>
	);
};
```

- In the logs, we see that we now have an object with a `ducks`, `setDucks`, `error`, and `loading` properties, exactly what we'd expect based on the `value` we passed
- Since we're only concerned with our states, we can destructure it right away, and use it

```js
const DuckPond = () => {
	const { ducks, loading, error } = use(DuckContext);
	// console.log(context);
	return (
		<section
			id='pond'
			className='flex justify-center flex-wrap gap-4 p-4 w-full'
		>
			{loading && (
				<p className='text-center font-medium text-4xl'>Loading...</p>
			)}
			{error && (
				<p className='text-center text-red-500 font-semibold text-4xl'>
					{error}
				</p>
			)}
			{!loading &&
				!error &&
				ducks.map(duck => (
					<Link key={duck._id} to={`ducks/${duck._id}`}>
						<DuckCard {...duck} />
					</Link>
				))}
		</section>
	);
};
```

- Since we're recycling this component in `MyPond`, we can also see it working there

### Passing our setter

- Now in `MyPond` we can clear out our `myDucks` state, and remove `setDucks` from props

```js
import { DuckPond, UseActionState } from '../components';

const MyPond = () => {
	return (
		<>
			<DuckPond />
			<UseActionState />
		</>
	);
};

export default MyPond;
```

- And in `DuckForm/UseActionState` we consume the context instead of relying on props

```js
import { useActionState, useState, use } from 'react';
import { toast } from 'react-toastify';
import { DuckContext } from '../../context';
import { createDuck } from '../../data';
import { validateDuckForm, sleep } from '../../utils';

const DuckForm = () => {
	const { setDucks } = use(DuckContext);
	// rest of component...
};
```

### This technically works, and we could stop here and have a function app with context. But there's a couple of improvement we can make in organizing our code

## Creating a custom useDucks hook

- You may have noticed we now need to import 2 things into every component we want to use our DuckContext in
  - use from 'react'
  - DuckContext from our context file
- Not the end of the world, but since these 2 things are needed EVERY time we want to use the context, we can create a custom hook to handle that for us
- `context/index.js`

```js
import { createContext, use } from 'react';

const DuckContext = createContext();

const useDucks = () => {
	const context = use(DuckContext);
	return context;
};

export { DuckContext, useDucks };
```

- Since this can only be used inside of the DuckContext, let's throw an Error if they try to use it outside

```js
const useDucks = () => {
	const context = use(DuckContext);
	if (!context) throw new Error('useDucks must be used within a DuckContext');
	return context;
};
```

- Now we can update `DuckPond` and `UseActionState/DuckForm` to use our custom hook
- `DuckPond.jsx`

```js
import { Link } from 'react-router';
import { useDucks } from '../../context';
import DuckCard from './DuckCard';

const DuckPond = () => {
	const { ducks } = useDucks();
	// rest of component...
};
```

- `UseActionState.jsx`

```js
import { useActionState, useState } from 'react';
import { toast } from 'react-toastify';
import { useDucks } from '../../context';
import { createDuck } from '../../data';
import { validateDuckForm, sleep } from '../../utils';

const DuckForm = () => {
	const { setDucks } = useDucks();
	// rest of component...
};
```

### This is nice, but our MainLayout is a bit cluttered...

## Created a separate DuckProvider

- Our MainLayout should only be concerned with rendering the layout, so let's modularize our code by creating a special `DuckProvider` component
- Make `DuckProvider.jsx` inside `context` folder
- Move all of our duck logic in there

```js
import { useState, useEffect } from 'react';

import { getAllDucks } from '../data';
import { DuckContext } from '../context';

const DuckProvider = () => {
	const [ducks, setDucks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const abortController = new AbortController();
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const duckData = await getAllDucks(abortController);
				setDucks(duckData);
			} catch (error) {
				if (error.name === 'AbortError') {
					console.info('Fetch Aborted');
				} else {
					console.error(error);
					setError('Error bringing ducks to the pond.');
				}
			} finally {
				setLoading(false);
			}
		})();

		return () => {
			abortController.abort();
		};
	}, []);
	return (
		<DuckContext value={{ ducks, setDucks, loading, error }}></DuckContext>
	);
};

export default DuckProvider;
```

- import and re-export it from `index.js`

```js
import { createContext, use } from 'react';
import DuckProvider from './DuckProvider';
const DuckContext = createContext();

const useDucks = () => {
	const context = use(DuckContext);
	if (!context) throw new Error('useDucks must be used within a DuckContext');
	return context;
};

export { DuckContext, useDucks, DuckProvider };
```

- Now we can wrap our whole application in this provider

```js
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { DuckProvider } from '../context';
import { Navbar, Footer } from '../components';

const MainLayout = () => {
	return (
		<DuckProvider>
			<div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
				<Navbar />
				<main className='flex-grow flex flex-col justify-between py-4'>
					<Outlet />
				</main>
				<Footer />
				<ToastContainer />
			</div>
		</DuckProvider>
	);
};

export default MainLayout;
```

- You may notice though, that nothing is rendering now
- We still have to render what's between the provider

```js
<DuckContext value={{ ducks, setDucks }}>
	<div>Where's my stuff?</div>
</DuckContext>
```

- Because we have children nested inside of the component, it gives us access to a special React prop - `children`
- If we pass `children` as a prop, then render it, everything that's nested will get rendered

```js
const DuckProvider = ({ children }) => {
	// app logic...
	return <DuckContext value={{ ducks, setDucks }}>{children}</DuckContext>;
};
```

- Now everything's back!

## Notes on Context

- When a state from the context provider tree changes, it rerenders the whole tree, so this doesn't improve performance over prop drilling
- For more complex applications, it could be worth looking into a state management library (after the bootcamp)
- Context is mainly about writing scalable, and maintainable code
- Most useful when something is needed in deeply nested components AND several places

## useReducer

- useContext can pair very nicely with another hook called useReducer
- If you're feeling very comfortable with useContext, as a BONUS you can try to implement useReducer in the exercise today, based on the playground slides
- We won't cover it in the correction, but I will push a second version of the Todo App that uses reducer
