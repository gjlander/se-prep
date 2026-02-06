# Context API

- When you have a piece of state ( or any data) that's needed in several parts of your application, passing deeply nested state can become annoying
- To solve that issue, React has the Context API. The nice thing is, you've already been working with a version of it - useOutletContext is using Context under the hood, and works in basically the same way

## using Outlet Context

- in `MainLayout.jsx` we create some state related to authentication
- Because the Navbar exists outside of the Outlet, we still pass via props. You could say, being outside of the Outlet, it's outside of the context provider.
  - This means that there is a boundary to where the context can be used
- Inside of our context provider (in this case, the Outlet), we pass everything we need as an object to `context`

```js
<Outlet
  context={{
    signedIn,
    setSignedIn,
    user,
    setUser,
    setCheckSession
  }}
/>
```

- Then, instead of passing props, any component nested inside of Outlet can access the data directly if they need it by using `useOutletContext` and deconstructing the needed values
- `Signin.jsx`

```js
import { useState } from 'react';
import { Link, useOutletContext, Navigate } from 'react-router';
import { signIn } from '../data/auth';
const SignIn = () => {
  const [{ email, password }, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { signedIn, setSignedIn, setCheckSession } = useOutletContext();
  // rest of component...
};
```

- Using Context you wire up yourself will work in almost exactly the same way. The only tricky part is how to wire up your own context
- Before we refactor our duckpond to use a self-made context, instead of relying on React Router, let's look at a basic example from the playground

## Local Playground example

- I've downloaded the [first slide of the context api playground](https://playground.wbscod.in/react/react-context-api/1), and given it the proper directory structure
- I've also added an example of prop drilling to compare it to

## Prop Drilling

- I've used this word before, but I don't think I've proper explained it
- We have defined a `user` in `App`, and we need access to that data in `NoContextGranChild`. Let's say, for whatever reason, that data is needed in other component trees, so we can't move it close to the component that needs it.
- Our solution then, is to pass it as props to the `NoContextParent`

```js
<NoContextParent user={user} />
```

- Our `NoContextParent` doesn't need it, so it just passed it along to the `NoContextChild`

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
  - useContext hook allows us to access the value of the context object
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
- Then in the GrandChild, we need to import the UserContext itself from `App.js` and useContext from react
- We pass the UserContext as an argument to useContext, and can access the value
  - Since it is a single value, we don't have to deconstruct

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

## Creating an AuthContext

- Let's refactor our DuckPond to use our own AuthContext, instead of the Outlet

### Create a new context folder, and create our new context

- Make `context` folder
- Make `context.js`

```js
import { createContext } from 'react';

const AuthContext = createContext();

export { AuthContext };
```

- Now back in `MainLayout.jsx`, we import the AuthContext, and wrap our whole application in the provider

```js
import { AuthContext } from '../context/context';
// other stuff...
<AuthContext.Provider>
  <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
    <Navbar signedIn={signedIn} setSignedIn={setSignedIn} user={user} setUser={setUser} />
    <main className='flex-grow flex flex-col justify-between py-4'>
      <Outlet
        context={{
          signedIn,
          setSignedIn,
          user,
          setUser,
          setCheckSession
        }}
      />
    </main>
    <Footer />
  </div>
</AuthContext.Provider>;
```

- Now that our Navbar is inside the provider, we can get rid of the props, and we can get rid of the context on our Outlet. We can now pass that same object as value to our Provider

```js
<AuthContext.Provider
  value={{
    signedIn,
    setSignedIn,
    user,
    setUser,
    setCheckSession
  }}
>
  <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
    <Navbar
    // signedIn={signedIn}
    // setSignedIn={setSignedIn}
    // user={user}
    // setUser={setUser}
    />
    <main className='flex-grow flex flex-col justify-between py-4'>
      <Outlet
      // context={{
      //     signedIn,
      //     setSignedIn,
      //     user,
      //     setUser,
      //     setCheckSession,
      // }}
      />
    </main>
    <Footer />
  </div>
</AuthContext.Provider>
```

- Everything will break for a bit, so let's fix things one component at a time
- `Navbar.jsx`
- We no longer need to pass props, we can use our context

```js
import { useContext } from 'react';
import { AuthContext } from '../context/context';
import { Link, NavLink, useNavigate } from 'react-router';
//nothing new here, just accessing the props
const Navbar = (/*{ signedIn, setSignedIn, user, setUser }*/) => {
  const { signedIn, setSignedIn, user, setUser } = useContext(AuthContext);
  // rest of component...
};
```

- `Signin.jsx`
- This one is even easier, import AuthContext and useContext, and replace `useOutletContext`

```js
import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router';
import { AuthContext } from '../context/context';
import { signIn } from '../data/auth';
const SignIn = () => {
  const [{ email, password }, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { signedIn, setSignedIn, setCheckSession } = useContext(AuthContext);
  // rest of component...
};
```

- `MyPond.jsx`

```js
import { useState, useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/context';
import DuckPond from '../components/DuckPond';
import DuckForm from '../components/DuckForm';

const MyPond = () => {
  const [myDucks, setMyDucks] = useState(JSON.parse(localStorage.getItem('myDucks')) || []);
  const { signedIn } = useContext(AuthContext);
  // rest of component...
};
```

- Now everything works again!

### This technically works, and we could stop here and have a function app with context. But there's a couple of improvement we can make in organizing our code

## Creating a custom useAuth hook

- You may have noticed we now need to import 2 things into every component we want to use our AuthContext in
  - useContext from 'react'
  - AuthContext from our context file
- Not the end of the world, but since these 2 things are needed EVERY time we want to use the context, we can create a custom hook to handle that for us
- `context.js`

```js
import { createContext, useContext } from 'react';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export { AuthContext, useAuth };
```

- Since this can only be used inside of the AuthContextProvider, let's throw an Error if they try to use it outside

```js
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthContextProvider');
  return context;
};
```

- Now we can update `Navbar`, `Signin`, and `MyPond` to use this custom hook
- `Navbar.jsx`

```js
import { useAuth } from '../context/context';
import { Link, NavLink, useNavigate } from 'react-router';
const Navbar = (/*{ signedIn, setSignedIn, user, setUser }*/) => {
  const { signedIn, setSignedIn, user, setUser } = useAuth();
};
```

- `Signin.jsx`

```js
import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../context/context';
import { signIn } from '../data/auth';
const SignIn = () => {
  const [{ email, password }, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { signedIn, setSignedIn, setCheckSession } = useAuth();
};
```

- `MyPond.jsx`

```js
import { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/context';
import DuckPond from '../components/DuckPond';
import DuckForm from '../components/DuckForm';

const MyPond = () => {
  const [myDucks, setMyDucks] = useState(JSON.parse(localStorage.getItem('myDucks')) || []);
  const { signedIn } = useAuth();
};
```

### This is nice, but our MainLayout is a bit cluttered...

## Created a separate AuthProvider

- Now that we're using our own context, there's no real reason to have all of our Auth logic in our MainLayout
- Our MainLayout should only be concerned with rendering the layout, so let's modularize our code by creating a special `AuthContextProvider` component
- Make `AuthContextProvider.jsx` inside `context` folder
- Move all of our auth logic in there

```js
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/context';
import { me } from '../data/auth';
const AuthContextProvider = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState();
  const [checkSession, setCheckSession] = useState(true);

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
  return (
    <AuthContext.Provider
      value={{
        signedIn,
        setSignedIn,
        user,
        setUser,
        setCheckSession
      }}
    ></AuthContext.Provider>
  );
};

export default AuthContextProvider;
```

- Now we can wrap our whole application in this provider

```js
import { Outlet } from 'react-router';
import AuthContextProvider from '../context/AuthContextProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <AuthContextProvider>
      <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex-grow flex flex-col justify-between py-4'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthContextProvider>
  );
};

export default MainLayout;
```

- You may notice though, that nothing is rendering now
- We still have to render what's between the provider

```js
<AuthContext.Provider
  value={{
    signedIn,
    setSignedIn,
    user,
    setUser,
    setCheckSession
  }}
>
  <div>Where is my stuff?</div>
</AuthContext.Provider>
```

- Because we have children nested inside of the component, it gives us access to a special React prop - `children`
- If we pass `children` as a prop, then render it, everything that's nested will get rendered

```js
const AuthContextProvider = ({ children }) => {
  // app logic
  return (
    <AuthContext.Provider
      value={{
        signedIn,
        setSignedIn,
        user,
        setUser,
        setCheckSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
```

- Now everything's back!

## Notes on Context

- When a state from the context provider tree changes, it rerenders the whole tree, so this doesn't improve performance of prop drilling
- For more complex applications, it could be worth looking into a state management library (after the bootcamp)
- Context is mainly about writing scalable, and maintainable code
- Most useful when something is needed in deeply nested components AND several places

## useReducer

- useContext can pair very nicely with another hook called useReducer
- If you're feeling very comfortable with useContext, as a BONUS you can try to implement useReducer in the exercise today, based on the playground slides
- We won't cover it in the correction, but I will push a second version of the Todo App that uses reducer
