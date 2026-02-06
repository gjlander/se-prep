# React Router

## Topics to cover

- Initial setup for static routes
- Link and NavLink
- Layout and Outlet (nested routes)
- Dynamic Routes and useParams
- useNavigate
- project org with index file

## Initial Setup

### Reorganize for routing

- First, let's move everything inside of our App function into a new `Home.jsx` component, since this is what we want on the Home page
- - Make a new folder for pages, update import paths
- Now `App.jsx` will be concerned with handling routing

```js
import Home from './pages/Home';

function App() {
  return (
    <>
      <Home />
    </>
  );
}

export default App;
```

### Setting up React Router

- First we have to install, use `npm i react-router`
- - Old version used `react-router-dom`, use caution with ChatGPT as it may say this
- Import BrowserRouter, Routes, and Route

```js
import { BrowserRouter, Routes, Route } from 'react-router';
```

- BrowserRouter has to wrap our whole app, then in side of that we nest Routes
- Inside of routes, we can define each route.
- - The path tells us the URL path we want this to render on. For the root path, or home, we just use "/"
- - For element, we pass the JSX component we want to render here

```js
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Let's move our DuckForm to the MyPond page for adding to localstorage

- Make a new MyPond.jsx page
- Copy over all of `Home`
- Replace duck state, with one based on local storage

```js
import { useState } from 'react';

import Navbar from '../components/Navbar';
import Header from '../components/Header';
import DuckPond from '../components/DuckPond';
import DuckForm from '../components/DuckForm';
import Footer from '../components/Footer';

const Home = () => {
  const [myDucks, setMyDucks] = useState(JSON.parse(localStorage.getItem('myDucks')) || []);

  return (
    <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow flex flex-col justify-between py-4'>
        <DuckPond ducks={myDucks} />
        <DuckForm setDucks={setMyDucks} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
```

- import it, and render it in a new route

```js
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='mypond' element={<MyPond />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- Now I can manually type in the URL, and see the page!

## Link and NavLink

- That's not, of course, how we'd like our users
- In our `Navbar` component, we can update the hrefs to match our paths

```html
<li className="p-2 rounded-lg hover:bg-slate-600">
  <a href="/">Home</a>
</li>
<li className="p-2 rounded-lg hover:bg-slate-600">
  <a href="/mypond">My Pond</a>
</li>
```

- This shows us the right content, but if you notice, it's refreshing the page every time - NOT what we want!
- To use client-side navigation, React Router has a Link component we can use instead
- Now instead of href, it has a to property

```js
<li className='p-2 rounded-lg hover:bg-slate-600'>
                    <Link to='/'>Home</Link>
                </li>
                <li className='p-2 rounded-lg hover:bg-slate-600'>
                    <Link to='/mypond'>My Pond</Link>
                </li>
```

- You can use this anywhere you previous used `a` elements
- There is also `NavLink`, this is functionally EXACTLY the same as `Link`, but it applies the `active` class so you can style to show the page you are currently on

```js
<li className='p-2 rounded-lg hover:bg-slate-600'>
                    <NavLink to='/'>Home</NavLink>
                </li>
                <li className='p-2 rounded-lg hover:bg-slate-600'>
                    <NavLink to='/mypond'>My Pond</NavLink>
                </li>
```

- We can pass a function to the `NavLink` `className` to add our DaisyUI active class

```js
const showActive = ({ isActive }) => (isActive ? 'menu-active' : '');

 <li>
      <NavLink className={showActive} to='/'>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className={showActive} to='/mypond'>
              My Pond
            </NavLink>
          </li>
```

## Nested Routes, Layout, and Outlet

- If we do a side-by-side comparison of `Home.jsx` and `MyPond.jsx` we can see there's a lot of repetition. Basically everything outside of `<main>` is the same
- React Router let's us nest routes to apply a layout.
- So far, we've used self-closing `Route` components, we can also nest other Route components inside

### Make a new MainLayout component

- The things we want on all of our pages, like Navbar and Footer, will go in the MainLayout component

```js
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow flex flex-col justify-between py-4'></main>
      <Footer />
    </div>
  );
};

export default MainLayout;
```

- And remove those pieces from the individual pages

```js
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import DuckPond from '../components/DuckPond';

import { getDucks } from '../data/ducks';

const Home = () => {
  const [ducks, setDucks] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const allDucks = await getDucks();
        if (!ignore) {
          setDucks(allDucks);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    console.log('useEffect ran!');

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Header />
      <DuckPond ducks={ducks} />
    </>
  );
};

export default Home;
```

```js
import { useState } from 'react';

import DuckPond from '../components/DuckPond';
import DuckForm from '../components/DuckForm';

const MyPond = () => {
  const [myDucks, setMyDucks] = useState(JSON.parse(localStorage.getItem('myDucks')) || []);
  return (
    <>
      <DuckPond ducks={myDucks} />
      <DuckForm setDucks={setMyDucks} />
    </>
  );
};

export default MyPond;
```

- Back in App.jsx we import our layout, and nest our Route elements inside a parent Route
- The parent element now has the MainLayout, with path="/"
- We update our home page path to index, to indicate we want to use the exact same path that the parent Route has

```js
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='mypond' element={<MyPond />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- Now we have our layout, but what about the pages?

### React Router has an Outlet component that acts kind of like a placeholder

- We can import it, then render it in our layout

```js
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow flex flex-col justify-between py-4'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
```

- This only works for routes nested inside our Layout Route, it we move it outside, no more layout (demo this)
- This outlet works as a placeholder, so on /, it renders `<Home/>` where Outlet is, when the path is 'mypond' it renders `<MyPond/>`

## Dynamic Routes

- So far we've only used static routes, but a really cool feature of React Router is the use of dynamic routes
- With dynamic routes, we can essentially give a placeholder name (similar to passing an argument a function)
- Let's make a new single duck page with placeholder info from our duck

```js
import { duck } from '../data/ducks';
const DuckPage = () => {
  const { name, imgUrl, quote } = duck;
  console.log(imgUrl);
  return (
    <div className='hero bg-base-100 min-h-screen'>
      <div className='hero-content flex-col lg:flex-row'>
        <img src={imgUrl} className='max-w-sm rounded-lg shadow-2xl' />
        <div>
          <h1 className='text-5xl font-bold'>{name}</h1>
          <p className='py-6'>{quote}</p>
          <button className='btn btn-primary'>Go back</button>
        </div>
      </div>
    </div>
  );
};

export default DuckPage;
```

- Next we import it, and set it as the element to our new route
- To indicate we want part of our route to be static, we use the :

```js
<Route path='ducks/:duckId' element={<DuckPage />} />
```

- Now if we type the URL, no matter what we put for the dynamic part, it takes us to the right page (demo this)
- Of course, this isn't what we want. What we want is for that dynamic part to be the unique ID so we can use it to display the information of one specific duck
- If we wrap each card in a Link component, we can use the ID to set the dynamic part of the route, like so

```js
{
  ducks.map(duck => (
    <Link key={duck._id} to={`ducks/${duck._id}`}>
      <DuckCard {...duck} />
    </Link>
  ));
}
```

- Now to access the dynamic section of the route, we an use a custom hook from React Router called useParams.
- We deconstruct whatever name we gave to the dynamic route (in our case duckId), and now we can use it

```js
const { duckId } = useParams();
console.log('duckId: ', duckId);
```

- In our `ducks.js` file, we have another function that gets a single duck by ID, we can now import that function, and use the duckId from useParams to get our individual duck, and display that instead of our placeholder duck
- Since we want this to run when the page loads, we'll put it inside of a useEffect, then add our duckId to the dependency array so it updates any time we go to the page for a new duck. We will also want a state to store our current duck
- This will look similar to our other fetch, so let's copy/paste it, then update

```js
const [currDuck, setCurrDuck] = useState({});
const { duckId } = useParams();
console.log('duckId: ', duckId);
const { name, imgUrl, quote } = currDuck;

useEffect(() => {
  let ignore = false;
  (async () => {
    try {
      const duckData = await getDuckById(duckId);
      if (!ignore) {
        setCurrDuck(duckData);
      }
    } catch (error) {
      console.error(error);
    }
  })();

  return () => {
    ignore = true;
  };
}, [duckId]);
```

- Now whichever duck we click on, it shows the info for that duck!

## useNavigate

- Most of the time, we'll use the Link or NavLink component for navigation, but sometimes we want to navigate based on where we were, or as a side effect
- For example, in our "Go Back" button, we just want to go one page back in our history, just like the back button the browser offers
- We can't do that with Link, so we can use another custom hook from React Router, called useNavigate
- As always, we import it, Then to use it, look like this

```js
const navigate = useNavigate();

const handleGoBack = () => {
  navigate(-1);
};
```

- To go back one page, we simply pass -1 as an argument
- In this case, it's not taking to the "/" path, but checking our history and going back one

### Navigation as a side effect

- Our other use case for useNavigate is if we want the navigation to happen as a side effect
- Say for example, once our use is signed in, we want to redirect them to the mypond page after 1 second

```js
const navigate = useNavigate();
const handleSignIn = () => {
  setSignedIn(prev => !prev);
  setTimeout(() => {
    navigate('/mypond');
  }, 1000);
};
```

## Project Organization

- This last bit isn't specific to React Router, but as our application grows, we can do something to make our lives a little easier
- In App.jsx, we've got a growing line of imports at the top, and also several folders inside of `src`. A common pattern you will see is to add an `index.js` file to each nested folder inside of `src`, and then import and re-export files
- `pages/index.js`

```js
import Home from './Home';
import DuckPage from './DuckPage';
import MyPond from './MyPond';

export { Home, DuckPage, MyPond };
```

- By naming the file `index.js`, Vite doesn't require the filename, so we can import all of our pages just from the folder

```js
import { BrowserRouter, Routes, Route } from 'react-router';
import { Home, MyPond, DuckPage } from './pages';
import MainLayout from './layouts/MainLayout';
```

- This makes our imports more readable, and makes it clear they're all coming from the same place

`data/index.js`

- Since we only fetch from one source let's just rename `ducks.js` to `index.js`, but if we were using several APIs, we'd follow the same structure
- update imports in `DuckPage`, and `Home`

`layouts/index.js`

- to keep the pattern, let's also make an `index.js` for layouts

```js
import MainLayout from './MainLayout';

export { MainLayout };
```

- `App.jsx`

```js
import { BrowserRouter, Routes, Route } from 'react-router';
import { Home, MyPond, DuckPage } from './pages';
import { MainLayout } from './layouts';
```

### Since we have several pages now, we can also organize our components based on if they appear in a single page, or are shared between pages

`src/components/home`

- Header.jsx
  `src/components/myPond`
- DuckForm.jsx
  `src/components/shared`
- DuckCard.jsx
- DuckPond.jsx
- Footer.jsx
- Navbar.jsx

- We then still import/export these from the `index.js` file

```js
import Header from './home/Header';
import DuckForm from './myPond/DuckForm';
import DuckCard from './shared/DuckCard';
import DuckPond from './shared/DuckPond';
import Footer from './shared/Footer';
import Navbar from './shared/Navbar';

export { Header, DuckForm, DuckCard, DuckPond, Footer, Navbar };
```

Then update our imports

- MainLayout.jsx

```js
import { Outlet } from 'react-router';
import { Navbar, Footer } from '../components';
```

- Home.jsx

```js
import { useState, useEffect } from 'react';
import { getAllDucks } from '../data';
import { Header, DuckPond } from '../components';
```

- MyPond.jsx

```js
import { useState } from 'react';
import { DuckPond, DuckForm } from '../components';
```

## Go to exercise and walk-through template repo
