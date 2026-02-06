# React Fundamentals Part 1

## Topics to cover for part 1

- Breaking UI into components
- Styling, vanilla CSS, style attribute, Tailwind

# React-ifying a Vanilla Project

- This is a simplified version of the result from our Web Storage API lecture.
- Routing works differently in React, so we'll eventually bring them back, but for now we'll focus on just having a single page
- For that, I also brought our add duck form back into the home page.
- I got rid of the summon the ducks button, now they'll appear for us on page load
- I also simplified the JS, using our ducksInThePond array again, instead of fetch

## Making a project with Vite

- One of the most common tools for using React is Vite
- Setup the project, and go through the options
  ` npm create vite@latest`
- Note nested new folder, cd into it, then install dependencies `npm i`
- We have our `node_modules` folder now, just like with Parcel
- We know `package.json` from Parcel as well

### We'll only have one HTML file, and it will be mostly blank

- We have an `index.html` that is mostly empty, just a `div` with id of `root`, and a script tag.
- All of the content will be rendered with JS (like that exercise where you rendered everything with the DOM)
- This will be our only HTML file, even when we start adding more pages, everything will be rendered with JavaScript, This is what we mean with SPA.
- It has a couple of config files, and generates a README, but where things get interesting is inside of `src`

### main.jsx

- Our `main.jsx` is mainly for wiring up React to work properly, we won't write much in this file
- We use the jsx extension to let us write JavaScript XML, which allows us to write code that looks like HTML inside of our JS files. Go to [slide 3](https://playground.wbscod.in/react/react-basics-20/3)
- This all gets compiled into Vanilla JS in the end, hence our need for a bundler. .
- Possible to use React without JSX, but not recommended. It is also possible to use JSX outside of React, but it was developed for React
- We use imports to use the files we need, we now import css instead of using the link tag - this is a feature added by Vite

### App.jsx

- Here is where we start writing what will render on the page
- Vite comes with a lot of boilerplate, let's look at it, then clear it out
- If we use show preview, only get blank page (remember nothing is in the html). Now we have to use our `npm run dev` command
- Demo the page
- Clear out boilerplate

## From Vanilla HTML to JSX

- Everything is a component in React, and every component (at least for us) is a function.
- Older React used objects, known as class components, but for the last several years best practice is to use functional components.
- We demo class components in the playground, but will only work with functional components.
- Inside of the return is where our JSX goes

### Copy/paste the content of `<body>` inside the return (change body to div, and delete script tag)

- You'll notice it looks almost exactly the same as our HTML, but a few key differences to note are:
- - `class` is a reserved keyword in JS, so HTML `class` is changed to `className`
- - Labels with `for` are also changed to `htmlFor`, since for is also reserved
- - With HTML, the forward slash on closing tags was optional, in JSX it is required
- JSX allows us additional features, but everything you learned about writing HTML is still applicable here

## Styling with React

- We have to content of our page, but it's back to our plain ugly HTML. Just like with Vanilla HTML, we can use a stylesheet, inline styles, or our favorite, Tailwind

### Vanilla CSS

- Works basically the same as in Vanilla
- We create a css file inside of `src`
- Our new part here is we have to import the whole file into `main.jsx`
- Now we use it exactly as in Vanilla (just classes are classNames)

```css
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

body {
	background-color: lightgray;
}

#summon-btn {
	background-color: aqua;
}

.text-center {
	text-align: center;
}
```

### Inline Styles

- We can also use inline styles in JSX, just instead of a string, it takes an object
- We have to use double brackets, I'll go into why later
- Properties are with camelCase, and text has to go in quotes

```jsx
<h1
	style={{
		backgroundColor: 'red',
		padding: '1rem'
	}}
	className='text-6xl mb-6'
>
	The Duck Pond
</h1>
```

### Tailwind

- Just like with Parcel, to use Tailwind, we have to install it
- The configuration is a bit different for React, there are instructions in the LMS, but Tailwind also has a [guide for Vite](https://tailwindcss.com/docs/installation/using-vite)
- Setting up Tailwind isn't our focus for today, so sit back and relax while I set it up
- Now our page isn't ugly anymore!

## Breaking our UI into Components

- Let's start with what's in our html file, then circle back to duck cards
- We could in theory work like this, but then we're not taking advantage of what React can do for us

### Each section gets a component

#### Inside `src` folder make a new folder called `components` and a file for each component. It is possible to have several in the same file (and that's what you'll see in the playground, but best practice is one component per file)

- By convention, our filename matches the name of the component, and component has to start uppercase

#### Navbar.jsx

- Remove it
- Make a new folder called components
- Inside, add new file called Navbar.jsx
- Write the functional component, and export by default
- Only one component per file

```js
const Navbar = () => {
	return (
		<nav className='flex justify-end bg-slate-800 py-2 px-8 text-2xl mb-6'>
			<ul className='flex gap-6'>
				<li className='p-2 rounded-lg hover:bg-slate-600'>
					<a href='index.html'>Home</a>
				</li>
				<li className='p-2 rounded-lg hover:bg-slate-600'>
					<a href='src/myPond.html'>My Pond</a>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
```

- import it in App.jsx
- put it in the return with our JSX
- All components start with capitol letter, native HTMl elements with lowercase
- nothing has changed about our UI, it's just more organized

### Let's do the same for the Header, DuckPond, DuckForm, and Footer

- Header.jsx

```js
const Header = () => {
	return (
		<header className='text-center'>
			<h1
				// style={{
				//     backgroundColor: 'red',
				//     padding: '1rem',
				// }}
				className='text-6xl mb-6'
			>
				The Duck Pond
			</h1>
		</header>
	);
};

export default Header;
```

- DuckPond.jsx

```js
const DuckPond = () => {
	return <section id='pond' className='flex justify-center flex-wrap gap-4 p-4 w-full'></section>;
};

export default DuckPond;
```

- DuckForm.jsx

```js
const DuckForm = () => {
	return (
		<section className='flex flex-col items-center gap-4 border-2 rounded-lg p-4 mx-8'>
			<h2 className='text-4xl'>Add a new duck to my pond!</h2>
			<form id='add-form' className='flex flex-col gap-4 w-3/4'>
				<label className='w-full flex gap-2 items-baseline'>
					<span className='text-xl'>Name:</span>
					<input
						id='name'
						type='text'
						placeholder="What is your duck's name?"
						className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 flex-grow'
					/>
				</label>
				<label className='w-full flex gap-2 items-baseline'>
					<span className='text-xl'>Image:</span>
					<input
						id='img-url'
						type='url'
						placeholder='What does your duck look like?'
						className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
					/>
				</label>
				<label className='w-full flex gap-2 items-baseline'>
					<span className='text-xl'>Quote:</span>
					<input
						id='quote'
						type='text'
						placeholder='What does your duck say?'
						className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
					/>
				</label>
				<button type='submit' className='bg-green-600 p-2 rounded-lg font-bold'>
					Add duck
				</button>
			</form>
		</section>
	);
};

export default DuckForm;
```

- Footer.jsx

```js
const Footer = () => {
	return (
		<footer className='flex justify-center bg-slate-800 py-4 text-2xl w-full'>
			© Copyright Ducks on Ducks on Ducks, all rights reserved
		</footer>
	);
};

export default Footer;
```

- Again, each component is just a function, and in the return is where we write our JSX

### To use it, we have to import it

```js
import Navbar from './components/Navbar';
import Header from './components/Header';
import DuckPond from './components/DuckPond';
import DuckForm from './components/DuckForm';
import Footer from './components/Footer';

function App() {
	return (
		<div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
			<Navbar />
			<Header />
			<main className='flex-grow flex flex-col justify-between py-4'>
				<DuckPond />
				<DuckForm />
			</main>
			<Footer />
		</div>
	);
}

export default App;
```

- Native HTML elements are in lowercase in JSX, to use our React components, it has to be uppercase. This is why component names need to be uppercase, because JS is case sensitive, components can even be named the same as HTML elements (as with our footer)
- Nothing about our UI has changed, but now it's much easier to see the structure of our page at a glance
- Components can be as small as a button, and as large as a whole page, and anything in between
- You'll notice out `App.jsx` is one big functional component that wraps the entire UI of our application

### Now let's say we don't want this div wrapper

- Show it makes an error
- Must have one parent element, if it's not needed, can use an empty one

## [Playground Examples](https://playground.wbscod.in/react/react-basics-20/1)

- Limitation of playground to only have 1 JS file
- Some documentation has this format as well, so good to be able to read
- Locally, each function would be it's own file
- Start at bottom with `App` and then look at what you need one at a time

# React Fundamentals Part 2

## Topics for part 2

- Displaying Data
- Conditional Rendering
- Rendering Lists
- Events

## Displaying Data

- So far, we've taken HTML and converted it into JSX, so everything is hard coded in. But we can also display data based on JS
- Let's make a new component for a Duck Card, and start simple
- Make DuckCard.jsx

```js
const DuckCard = () => {
	return <div>DuckCard</div>;
};

export default DuckCard;
```

- We want this to show up in our DuckPond, so we import it there
- Then we add it to the return of our component - we can nest components

```js
import DuckCard from './DuckCard';

const DuckPond = () => {
	return (
		<section id='pond' className='flex justify-center flex-wrap gap-4 p-4 w-full'>
			<DuckCard />
		</section>
	);
};

export default DuckPond;
```

- Right now it's just a div, let's have it render some actual information, by bringing over the first duck from our array

```js
const singleDuck = {
	_id: 1,
	name: 'Sir Quacks-a-lot',
	imgUrl:
		'https://cdn11.bigcommerce.com/s-nf2x4/images/stencil/1280x1280/products/430/7841/Knight-Rubber-Duck-Yarto-2__93062.1576270637.jpg?c=2',
	quote: 'I will slay your bugs!'
};
```

- So far, we've been working with plain text, like in HTML.
- Because JSX is LIKE HTML but is NOT HTML, we have some additional features, like we can use JS variable directly in our markup
- It looks very similar to using a template literal, so let's copy/paste our markup from before

```js
`<div class='shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col'>
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
        </div>`;
```

- We'll have to make a few adjustments
- - class becomes className like before
- - Let's just add back dot notation for now
- - And get rid of the $ before curly brackets
- And voila!
- Similar to how we used ${} in a template literal to escape back into JavaScript land, we simply use {} in JSX

### One of the benefits of components, is that they can be reusable. Right now, this duck card only works for the individual duck.

## Props

- We can solve that by using props!
- Remember before we talked about the parent/child hierarchy, parents can pass information to their children, but children can't pass info up. So let's move our Duck into the parent `DuckPond.jsx`

### Passing Props

- Now that our duck is in the parent, we have to pass the information down
- Props just like HTML attributes, but they can only go on components
- We can pass our duck like this

```js
import DuckCard from './DuckCard';
const singleDuck = {
	_id: 1,
	name: 'Sir Quacks-a-lot',
	imgUrl:
		'https://cdn11.bigcommerce.com/s-nf2x4/images/stencil/1280x1280/products/430/7841/Knight-Rubber-Duck-Yarto-2__93062.1576270637.jpg?c=2',
	quote: 'I will slay your bugs!'
};
const DuckPond = () => {
	return (
		<section id='pond' className='flex justify-center flex-wrap gap-4 p-4 w-full'>
			<DuckCard duck={singleDuck} />
		</section>
	);
};

export default DuckPond;
```

- Back in our duck card, let's comment out the OG Duck
- Now everything breaks! We'll fix it soon, but first let's comment it out
- Props are passed down as an object, we can have several props, they would jut get added to the object

```js
<DuckCard duck={singleDuck} prop2="I'm also here" />
```

- As we know, we can destructure arguments in functions, so let's do that here

```js
const DuckCard = ({ duck, prop2 }) => {
	console.log(duck, prop2);
	//component...
};
```

- This is a linting error, we'll just tur n it off in the config file
- For type checking the standard it to use TypeScript - learn it after the bootcamp

```js
'react/prop-types': 'off',
```

- Now we update our dot notation to the prop name, and it works again!

### Using spread operator to destructure individual props

- Passing the whole duck can be useful if we need the whole duck, but since we know exactly which properties we need, we have another option
- We can use the spread operator to pass down the duck, and directly destructure just the properties we need

```js
<DuckCard duck={singleDuck} {...duck} prop2="I'm also here" />
```

- Now inside of DuckCard.jsx, we can pass the properties we want directly, and get rid of the dot notation

```js
const DuckCard = ({ imgUrl, name, quote }) => {
	// console.log(duck, prop2);

	return (
		<div className='shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col'>
			<figure className='rounded-t-md overflow-hidden w-full h-96'>
				<img className='w-full h-full' src={imgUrl} alt={name} />
			</figure>
			<div className='flex flex-col p-6 pt-2 rounded-b-md bg-slate-800 h-40'>
				<h2 className='text-3xl border-b-2 mb-4 border-b-gray-400'>{name}</h2>
				<p>{quote}</p>
			</div>
		</div>
	);
};

export default DuckCard;
```

## Rendering Lists

- We have our single duck now, but we want to render our whole pond. Luckily React makes it very easy for us to render an array of items!
- Now let's bring in our whole array of ducks

### We use the map method, because we want to return JSX

- We use {} to use JS in our JSX
- Then map over our ducks array, and return a duck card
- We still have to pass down our props

```js
{
	ducksInThePond.map(duck => <DuckCard {...duck} />);
}
```

- And it works! But we're getting an error, let's check it out

#### If rendering a list, every item needs unique key property

- Usually you would use the unique id of an item
- Without this, React can't tell the difference between the items, which could lead to buggy behavior.

## Conditional Rendering

- A very powerful aspect of React is conditional rendering.
- This can scale to something as small as applying CSS conditionally, to rendering different components, or even entire pages
- Let's add a sign in button to the navbar
- We want it to check if we're signed in and either say "Sign In" or "Sign Out"
- Inside of JSX we can't use an if statement, so we use a ternary operator

```js
const Navbar = () => {
	const isSignedIn = false;
	return (
		<nav className='flex justify-end bg-slate-800 py-2 px-8 text-2xl mb-6'>
			<ul className='flex gap-6'>
				<li className='p-2 rounded-lg hover:bg-slate-600'>
					<a href='index.html'>Home</a>
				</li>
				<li className='p-2 rounded-lg hover:bg-slate-600'>
					<a href='src/myPond.html'>My Pond</a>
				</li>
				<li className='p-2 rounded-lg hover:bg-slate-600'>
					{isSignedIn ? <button>Sign Out</button> : <button>Sign In</button>}
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
```

### There are lots of other ways to take advantage of conditional rendering shown in the [playground](https://playground.wbscod.in/react/react-basics/7)

## Events in React

- Our final piece, events!
- React uses synthetic events. All this does is standardize behavior across browsers. We still have events like submit, and click, but the syntax is a little different
- There's a click event example in the playground, so let's look at an onChange
- By convention these are often called handle<event>

```js
const handleChange = e => {
	console.log(e.target.value);
};
```

- Then we add an onChange (with camelCase) like an HTML attribute, and pass it our function (without curly brackets, since we want the function, not the return)

```jsx
<input
	onChange={handleChange}
	id='name'
	type='text'
	placeholder="What is your duck's name?"
	className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 flex-grow'
/>
```

- Can also pass an anonymous function

```jsx
<input
	onChange={e => console.log(e.target.value)}
	id='img-url'
	type='url'
	placeholder='What does your duck look like?'
	className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
/>
```

- This also works with our other events, like onSubmit. You can check the React docs for a full list of events.
- We'll leave it at that for today, and in the next lecture we'll look at how to use events to update the UI.

## React exercises from the playground

- I know that's a lot! Before I let you go work, I just want to talk about how to work locally with the React exercises
- Similar to before, download an unzip
- Then all you have to do is `cd` and run `npm i`, these steps can also be found in [Setup with Vite](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/%f0%9f%97%9e%ef%b8%8f-setup-with-vite/)
- Remember to use `npm run dev` to start the server, we will no longer use live preview
- Your first step after downloading will be to move components to their own file
