# Event API Kick-off

## Parts

- ### HTTP Requests

  - HTTP methods
  - GET what they've been using
  - POST - to create a new resource
  - PUT - to update a resource
  - DELETE - to delete a resource
  - Postman
  - Fetch options

- ### Frontend
  - Fetch options
  - Authentication/Authorization
  - Signing in and saving a token
  - Protecting routes

# HTTP Requests

## Points to cover

- HTTP methods
- - GET what they've been using
- - POST - to create a new resource
- - PUT - to update a resource
- - DELETE - to delete a resource
- Postman
- Fetch options

## HTTP Methods

- Thus far, you've been working with 3rd party APIs that only grant read access. For full CRUD operations with persistence, we've been relying on local storage. While you'll eventually be building your own RESTful APIs, we want you to have a chance to experience full CRUD on the frontend, so we've built an API for you to run with the events scheduler

- Before we look at the Events API you'll be working with, let's do a more general recap on HTTP methods

### GET

- This is mainly what we've been working with so far
- Any URL put in the browser is making a GET request, so we could put our endpoints there to see what the response will be.
- Demo with DuckPond `https://duckpond-89zn.onrender.com/ducks/`
  - Note these have an owner property, they are not wild ducks

#### In order to use any other method, we'd have to write JS for it, and potentially build a UI. For testing and debugging this might not be practical. Luckily, the Events API has useful documentation with swagger, but a more general solution is...

### HTTP Client: Postman

- Postman allows us to make HTTP requests without having to use our browser. We can pass data, and test.
- It's important to note that it doesn't have the security measures that your browser has, so only put in URLs you are confident are safe

#### Making a Collection

- You can see I already have several collections, this is a way to organize your requests
- Demo making a new collection with RE, called `DuckPond-Deployed`
- Then I can click `Add a request` to make a new request
- Demo Naming the request

#### Making a GET Request

- If I copy/paste that same URL and click `Send`
- I can see the response body, I can look at the Headers for more information, and I can see the response code
- Make a second request to single duck. I can see, just like in the browser, what the response is.
  - Note the addition of the owner property to the duck, this will come into play soon.

### POST

- If I change the method for the ducks endpoint, I get a different result
- On the same URL, I can use each of the HTTP methods to have something different happen
- What happens with each method on each endpoint would be in the documentation for that API (since I made this, I know what's needed)

#### Authentication and Authorization

- Some endpoints are protected. I wouldn't want any random person to be able to make a new duck, delete ducks, etc.
- This means I have to
  1. Authenticate the user - verify they are who they say they are
  2. Authorize the user - check if that user is allowed this operation
- You'll learn how to implement this at the end of the Backend block.
- For now, you can see I've created a few `auth` endpoints
  - These mirror very closely how the Events API works

### Adding to the body

- In a post request, you usually need to send accompanying information. In an app, this would usually come from a form. In Postman, we can add the data as raw json directly
- Susan Storm is one of our users, let's see what happens when she signs in
- We don't want to store sensitive information on the client, so we can use this token to encrypt some basic info. Later, we'll save this in local storage.

### Creating a new Duck

- Now we can add that token to the Headers (headers are meta-data about the request)
- Add Authorization header, `Bearer token`
- Where have you seen something like this before?
  - This is exactly what was happening when you made requests to TMDB
- Now we get a new error, because we don't have any duck info
- I've got some duck info prepared (note the addition of the owner property, these ducks are not wild)

```json
{
	"name": "Quacksart",
	"imgUrl": "https://amsterdamduckstore.com/wp-content/uploads/2024/08/Mo-Rubber-Duck-Amsterdam-Duck-Store-front-e1725026098270.jpg",
	"quote": "Listening to your bugs is music to my ears!",
	"owner": "67a35cfd4348fa83ccb275bc"
}
```

- In our response, we get the newly created duck, and a 201, the response that means 'successfully created'

### PUT

- A put request will look very similar, we'll have the information to update in the body of the request

### DELETE

- Delete requests don't need anything in the body of the request

## Introduction to [API for group project](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/module-project-event-scheduler/topic/%f0%9f%9b%a0%ef%b8%8f-project-guidelines-and-requirements-6/)

- Demo running locally to show documentation
- Play around with it in Postman
- Has useful doc with swagger, but wanted to show postman already since we'll be using it in the backend

# Frontend Auth Flow

#### Let's see what this would look like in the frontend now

## Tour of the app

- I added a few things from `context-api` lecture to get us started

### App.jsx

- I added `SignIn` and `NotFound` pages. The \* for the `NotFound` path acts as a wildcard, so basically anything that isn't a defined path will use that
- Show what the pages look like
  - Sign In button is now a Link to signin page
  - handleSignOut is now coming from our Auth Context, as well as the `signedIn` state

### MainLayout.jsx

- Since our `Navbar` and `Footer`, don't need the `ducks` state, I'm only wrapping what's needed in our `DuckProvider`
- I've wrapped our whole app inside of a new `AuthProvider`, where I've wired up a second context to handle anything related to Authentication/Authorization

```js
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { DuckProvider, AuthProvider } from '../context';
import { Navbar, Footer } from '../components';

const MainLayout = () => {
	return (
		<AuthProvider>
			<div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
				<Navbar />
				<DuckProvider>
					<main className='flex-grow flex flex-col justify-between py-4'>
						<Outlet />
					</main>
				</DuckProvider>
				<Footer />
				<ToastContainer />
			</div>
		</AuthProvider>
	);
};

export default MainLayout;
```

### context/index.js

- I've created an `AuthContext` and a custom `useAuth` hook, just like our `DuckContext`

```js
import { createContext, use } from 'react';
import DuckProvider from './DuckProvider';
import AuthProvider from './AuthProvider';

const DuckContext = createContext();

const useDucks = () => {
	const context = use(DuckContext);
	if (!context) throw new Error('useDucks must be used within a DuckContext');
	return context;
};

const AuthContext = createContext();

const useAuth = () => {
	const context = use(AuthContext);
	if (!context)
		throw new Error('useAuth must be used within an AuthContextProvider');
	return context;
};

export {
	DuckContext,
	useDucks,
	DuckProvider,
	AuthContext,
	useAuth,
	AuthProvider
};
```

### AuthProvider.jsx

- We have three pieces of state related to auth

  - `signedIn` - a boolean value based on if the user is signed in, defaults to false
  - `user` - either our user object our `null`
  - `checkSession` - another boolean that tells us whether to reauthenticate the user, defaults to `true` so that when a user first comes to the site, we check if they are "still signed in"

- We pass these so they can be consumed by the components in our app

### SignIn.jsx

- We destructure directly in the form state (remember this is just to prevent the form from resetting if there's an error)
- We have an action that looks very similar to what we made for a new duck
- We call `handleSignIn` to set `signedIn` to `true`

## Sign In - from Postman to Frontend

- Show signing in Susan Storm in Postman

  - Note again the token we get in the response

- To achieve the same result in our app, we'll have to write a function
- In our `data` folder, let's make a new `auth.js` file, for our functions related to authentication
  - Our `duck` functions have also been moved into `ducks.js` for better organization

### Options object in fetch

- With GET requests, we can usually get away with just passing the URL endpoint to fetch, but there is an optional second argument
- This second argument is an object for configuring your request, you saw this when working with TMDB
- It allows us to
- specify the HTTP method: ` method: 'POST',`
- add headers: `headers: {
    'Content-Type': 'application/json',
},`
- add info to the body: `body: JSON.stringify(formData),` (note we have to stringify it into JSON)
- and more...

```js
const BASE_URL = 'https://duckpond-89zn.onrender.com/auth';

const signIn = async formData => {
	const res = await fetch(`${BASE_URL}/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = await res.json();
	// console.log(data);

	return data;
};

export { signIn };
```

- Import and re-export from `index.js`

```js
import { getAllDucks, getDuckById, createDuck } from './ducks';
import { signIn } from './auth';

export { getAllDucks, getDuckById, createDuck, signIn };
```

- Now we import it to our SignIn page, and use it in our action

```js
import { useActionState, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { validateSignIn } from '../utils';
import { signIn } from '../data';
// other stuff...

const signinAction = async (prevState, formData) => {
	const email = formData.get('email');
	const password = formData.get('password');

	const validationErrors = validateSignIn({ email, password });
	if (Object.keys(validationErrors).length !== 0) {
		return { error: validationErrors, success: false };
	}
	try {
		toast.success('Welcome back');

		const signInRes = await signIn({ email, password });

		console.log(signInRes);

		return { error: null, success: true };
	} catch (error) {
		toast.error(error.message || 'Something went wrong!');
		return { error: null, success: false };
	}
};
```

- We can see we get exactly the same response we got in Postman.

#### Now what do we do with it?

- In Postman, we just copy/pasted the token and added it the the Headers of our Create Duck request. In our app, we'll need a couple more steps

## Authentication in the frontend

- Our first step is to save the token in local storage, so that if the user came back to our site later they would stay signed in (because the token is a string, we don't need to stringify)
- We also update our signed in state, and tell the app we need to check the session again
- Let's update `handleSignIn` to save the token and set checkSession to true

```js
const handleSignIn = token => {
	localStorage.setItem('token', token);
	setSignedIn(true);
	setCheckSession(true);
};
```

- We now need to pass the token we get back from `signIn`

```js
//in signinAction
toast.success('Welcome back');

const signInRes = await signIn({ email, password });

console.log(signInRes);
handleSignIn(signInRes.token);

return { error: null, success: true };
```

## Getting user profile

- Once the token has been created, the next step is to get the actual user profile
- By convention, this endpoint is often called `me`, though in the events-api, this would be the `profile` endpoint
- Make request in Postman. Note in the response we don't send the user's password.

### Getting me in our app

- A second function in `auth.js`

```js
const me = async () => {
	const token = localStorage.getItem('token');

	const res = await fetch(`${BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = await res.json();
	// console.log(data);

	return data;
};
```

- Now we back in `AuthProvider.jsx`, we can put this in a useEffect, and call it any time we want to check the session
- Now getUser() will always run the first time you visit the page, and if a user signs in.

```js
useEffect(() => {
	const getUser = async () => {
		try {
			const data = await me();

			setUser(data);
			setSignedIn(true);
		} catch (error) {
			console.error(error);
		} finally {
			setCheckSession(false);
		}
	};

	if (checkSession) getUser();
}, [checkSession]);
```

- To sign out, you simply update the needed state, and remove the token from local storage

```js
const handleSignOut = () => {
	localStorage.removeItem('token');
	setSignedIn(false);
	setUser(null);
};
```

## Protected Routes

- The LMS has an article on protected layouts, let's see that in action
- Only a signed in user can make a new duck. We have protected this endpoint on the backend, but we want to prevent users from even seeing the MyPond Page if they're not signed in
- First we can conditionally render it, so it only appears when a user is signed in

```js
{
	signedIn ? (
		<>
			<li>
				<NavLink className={showActive} to='/mypond'>
					My Pond
				</NavLink>
			</li>
			<li>
				<button className='btn btn-primary' onClick={handleSignOut}>
					Sign Out
				</button>
			</li>
		</>
	) : (
		<li>
			<Link className='btn btn-primary' to='/signin'>
				Sign In
			</Link>
		</li>
	);
}
```

- But it's still accessible if some were to manually type the URL

### Making a protected Layout

- If we have sections of our app we want to protect like this, we can make a nested layout for them
- Make a new `AuthLayout.jsx`
- We have some protection here already, but instead of text, we could simply redirect the user to the signin page by using react-router `<Navigate>` component
- It works similar to the Link component, but simply redirects right away

```js
import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../context';
const AuthLayout = () => {
	const { signedIn } = useAuth();
	if (signedIn) {
		return <Outlet />;
	} else {
		return <Navigate to='/signin' />;
	}
};

export default AuthLayout;
```

- Then nest anything we want to protect inside this layout

```js
import { BrowserRouter, Routes, Route } from 'react-router';
import { Home, MyPond, DuckPage, SignIn, NotFound } from './pages';
import { MainLayout, AuthLayout } from './layouts';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path='ducks/:duckId' element={<DuckPage />} />
					<Route path='signin' element={<SignIn />} />
					<Route path='mypond' element={<AuthLayout />}>
						<Route index element={<MyPond />} />
					</Route>
				</Route>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
```

- Now if someone signed out happens upon the page, they get redirected.
- This can be done with pages, or entire layouts
- On our signin page we can do the opposite. If we are signed in, the redirect to mypond

```js
if (signedIn) return <Navigate to='/mypond' />;
```
