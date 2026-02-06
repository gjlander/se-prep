# React w/ TypeScript

## Topics to Cover

- Typing Props
- Typing state
- Controlled components
- DOM Events
- Typing hooks
  - useActionState

## Typing Props

- Because Components are just functions, we type them just like any other function
- Props get passed as a single argument to the component (function), we use destructuring syntax to access the properties of that object, but we type them just like we would any other function

### Typing props article

#### Children and Style props

- In addition to props we can pass, components have some built-in props. To properly type these, we need to rely on type that come from React
- We can see them installed in our `package.json`
- We can access the `React` namespace, or just import the types we need

```ts
import { type ReactNode, type CSSProperties } from 'react';

type ContainerProps = {
	children: ReactNode;
	style?: CSSProperties;
};
```

## DuckPond in TS

- I've gone ahead and refactored our DuckPond using a Vite TS setup. I've renamed all js and jsx files to ts/tsx, and add types annotations to ts files. tsx files are untouched, so have lots of errors. As we continue through the lecture, we'll work on fixing those errors

- auth.ts and ducks.ts
  - I've typed the parameters and returns of each auth function
- ducks.ts
- We have some redundant types here with `DBEntry`, but we'll look at organizing those soon

- also typed our utils - again, note the redundant types

### Typing props in our DuckPond

- Since we've already refactored to use Context, we only have 3 components that still have props:

  - DuckProvider.tsx, AuthProvider.tsx, DuckCard.tsx

- Both providers just have the children prop, so we can type them the same way

```ts
import { useState, useEffect, type ReactNode } from 'react';
const AuthProvider = ({ children }: { children: ReactNode }) => {};
```

```ts
import { useState, useEffect, type ReactNode } from 'react';

import { getAllDucks } from '../data';
import { DuckContext } from '../context';

type DuckProviderProps = {
	children: ReactNode;
};

const DuckProvider = ({ children }: DuckProviderProps) => {};
```

- Typing our DuckCard is also straightforward

```ts
type DuckCardProps = {
	imgUrl: string;
	name: string;
	quote: string;
};
const DuckCard = ({ imgUrl, name, quote }: DuckCardProps) => {};
```

- We'll still need to type each `duck` in `DuckPond`, but we'll circle back to that after typing state

## Typing state

- Again, `useState` is a function, and since it is a generic function, we can type it with generics

### Typing state article

- Walk through examples locally

## Typing our Duckpond state

- We don't have a lot of props, but we do have a decent amount of state in
  - AuthProvider.tsx, DuckProvider.tsx, DuckForm.tsx, SignIn.tsx, DuckPage.tsx

### AuthProvider

- `signedIn` and `checkSession` are both simple boolean values, and React can infer that from their default values
- `user` has no default value, so we need to make a type that reflects what we get back from our API

```ts
type User = {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	createdAt: string;
	__v: number;
};

const [user, setUser] = useState<User | null>(null);
```

#### Organizing shared types

- Now we'll look at organizing those redundant types. Since this is exactly the same as our `User` type used in `auth.ts`, to keep things DRY we can moved those shared types together and export them
- Types used in just 1 file can be co-located (declared in that file), but shared types will go in `src/types/index.ts`

```ts
type DBEntry = {
	_id: string;
	createdAt: string;
	__v: number;
};

export type User = DBEntry & {
	firstName: string;
	lastName: string;
	email: string;
};
```

- Then we can import it in `auth.ts`, and `AuthProvider.tsx`

```ts
import { type User } from '../types';
```

### DuckProvider

- Since our default state is an empty array, we need to tell TS what type of array this should be. It should be an array of `ducks`, so let's share this type and move it into our `types` folder
  - we'll also need to share our `DuckInput` type later, so let's already move that one as well

```ts
export type DuckInput = {
	name: string;
	imgUrl: string;
	quote: string;
};

export type Duck = DBEntry & DuckInput;
```

- Then import into `ducks.ts`

```ts
import type { DuckInput, Duck } from '../types';
```

- And `DuckProvider.tsx`

```ts
import type { Duck } from '../types';

const [ducks, setDucks] = useState<Duck[]>([]);
```

### DuckForm.tsx

- Since we have an initial state for our form, we don't strictly need to pass a type, but to explicitly state that this is our `DuckInput` type, we can add it here

```ts
import type { DuckInput } from '../../types';

const [form, setForm] = useState<DuckInput>({
	name: '',
	imgUrl: '',
	quote: ''
});
```

### DuckPage.tsx

- We can also use ou `Duck` type for the `currDuck`

```ts
import type { Duck } from '../types';
const [currDuck, setCurrDuck] = useState<Duck | null>(null);
```

- This reveals that our destructuring actually isn't so safe, so we can add a little check

```ts
if (!currDuck) return <div>Loading...</div>;
const { name, imgUrl, quote } = currDuck;
```

### SignIn.tsx

- Same principle for our sign in form
- We move `SignInInput` to `types`, and share it

```ts
import type { SignInInput } from '../types';
const [{ email, password }, setForm] = useState<SignInInput>({
	email: '',
	password: ''
});
```

## Controlled Components & DOM Events

- Walk through articles locally
- Highlight that you can either type the function, or the argument
- Uses React types, and DOM types for element

### SignIn

- We can either type the whole function, or type the event parameter. Let's type the parameter this time, and the function for our duck form

```ts
import { useActionState, useState, type ChangeEvent } from 'react';

const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
	setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
```

### DuckForm

```ts
import { useActionState, useState, type ChangeEventHandler } from 'react';

const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
	setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
```

## Typing hooks

- We haven't gone deep into some of these other hooks, like `useRef`, but you can use this as a reference if you'd like to use those hooks
- With the React Compiler on it's way towards a stable release, `useMemo` and `useCallback` will become redundant

## Context

### AuthContext

- If we go into `context/index.ts` we see we're getting TS errors when we call `createContext`
- We need to pass an initial value, and let TS know what properties it might hold later (what gets passed as a value prop)
- Since we'll also need this in `AuthProvider` we'll already declare it in `types`

```ts
export type AuthContextType = {
	signedIn: boolean;
	user: User | null;
	handleSignIn: (token: string) => void;
	handleSignOut: () => void;
};
```

- Import it, and use it to type `createContext`. Since we have no default value to set, we use `null`

```ts
const AuthContext = createContext<AuthContextType | null>(null);
```

- `useAuth` now correctly infers the type, but for the sake of being thorough we can explicitly type it

```ts
const useAuth = () => {
	const context = use(AuthContext);
	if (!context)
		throw new Error('useAuth must be used within an AuthContextProvider');
	return context;
};
```

- Then we can import the type into `AuthProvider`, and use it to type our `value`

```ts
import type { User, AuthContextType } from '../types';

const value: AuthContextType = {
	signedIn,
	user,
	handleSignIn,
	handleSignOut
};
return <AuthContext value={value}>{children}</AuthContext>;
```

- And now TS is happy when we destructure it in `SignIn`

### DuckContext

- We can do the same with our `DuckContext`
- First make the type
- Typing a setter function is a little funky, it's a nested generic. But we can see the syntax if we hover over it

```ts
export type DuckContextType = {
	ducks: Duck[];
	setDucks: Dispatch<SetStateAction<Duck[]>>;
};
```

- Type our context and custom hook

```ts
const DuckContext = createContext<DuckContextType | undefined>(undefined);

const useDucks = (): DuckContextType => {
	const context = use(DuckContext);
	if (!context) throw new Error('useDucks must be used within a DuckContext');
	return context;
};
```

- And type the `value`

```ts
const value: DuckContextType = { ducks, setDucks };
return <DuckContext value={value}>{children}</DuckContext>;
```

## Actions and useActionState

- As we continue typing our application, we also need to look at our actions and `useActionState`

### DuckForm

- For our `submitAction` we have 2 parameters
  1.  `prevState` - which we'll need to figure out the type of
  2.  `formData` - which will be a `FormData` object
- We can start with `unknown` for now, and type cast our input values

```ts
async (prevState: unknown, formData: FormData): Promise<unknown> => {
	const name = formData.get('name') as string;
	const imgUrl = formData.get('imgUrl') as string;
	const quote = formData.get('quote') as string;
};
```

- Since we don't work with `prevState`, a common convention to let TS (and other developers) know that we won't be using this parameter is to name it `_`

```ts
async (_: unknown, formData: FormData): Promise<unknown> => {};
```

- While we're here, let's also clean up the error message in the catch block

```ts
const msg = error instanceof Error ? error.message : 'Something went wrong!';
toast.error(msg);
```

#### typing the return

- Since our action returns the action state, we'll need to use that to type both the return and the `state`

```ts
type ActionResult = {
	error: null | Partial<DuckInput>;
	success: boolean;
};

const submitAction = async (
	_: ActionResult,
	formData: FormData
): Promise<ActionResult> => {};
```

- From experimentation, there seems to be a bug when using generic syntax with `useActionState`, so we can set the initial state with type casting

```ts
const [state, formAction, isPending] = useActionState(submitAction, {
	error: null,
	success: false
} as ActionResult);
```

### SignIn

- We can do the same process now in `SignIn`

````ts
const signinAction = async (_: ActionResult, formData: FormData): Promise<ActionResult> => {
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const validationErrors = validateSignIn({ email, password });
		if (Object.keys(validationErrors).length !== 0) {
			return { error: validationErrors, success: false };
		}
		try {
			toast.success('Welcome back');

			const signInRes = await signIn({ email, password });

			console.log(signInRes);
			handleSignIn(signInRes.token);

			return { error: null, success: true };
		} catch (error) {
			const msg = error instanceof Error ? error.message : 'Something went wrong!';
			toast.error(msg);
			return { error: null, success: false };
		}
	};
	const [state, formAction, isPending] = useActionState(signinAction, { error: null, success: false } as ActionResult);
	```
````

### making a generic ActionResult

- You may have noticed that our `ActionResult` for both actions as almost exactly the same. Let's make it generic and share it from `types`

```ts
export type DuckErrors = Partial<DuckInput>;

export type SignInErrors = Partial<SignInInput>;

export type ActionResult<T> = {
	error: null | T;
	success: boolean;
};

export type DuckActionResult = ActionResult<DuckErrors>;

export type SignInActionResult = ActionResult<SignInErrors>;
```

- Then we import into `DuckForm.tsx` and `SignIn.tsx` to use them
- `DuckForm`

```ts
import type { DuckInput, DuckActionResult } from '../../types';

const submitAction = async (
	_: DuckActionResult,
	formData: FormData
): Promise<DuckActionResult> => {};

const [state, formAction, isPending] = useActionState(submitAction, {
	error: null,
	success: false
} as DuckActionResult);
```

- `SignIn`

```ts
import type { SignInInput, SignInActionResult } from '../types';

const signinAction = async (
	_: SignInActionResult,
	formData: FormData
): Promise<SignInActionResult> => {};

const [state, formAction, isPending] = useActionState(signinAction, {
	error: null,
	success: false
} as SignInActionResult);
```

## Final Cleanup

- If we run `npm run build` we see there's still a few errors we need to clean up

`Navbar.tsx`

```ts
const showActive = ({ isActive }: { isActive: boolean }) =>
	isActive ? 'menu-active' : '';
```

`DuckProvider.tsx`

- We need to confirm that it's an instance of the `Error` class

```ts
  catch (error) {
				if (error instanceof Error && error.name === 'AbortError') {
					console.info('Fetch aborted');
				} else {
					console.error(error);
				}
			}
```

`DuckPage.tsx`

- `duckId` can be `undefined` so we pass an empty string in that case
- We also need to check our error here too

```ts
(async () => {
	try {
		const duckData = await getDuckById(duckId ?? '', abortController);

		setCurrDuck(duckData);
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			console.info('Fetch aborted');
		} else {
			console.error(error);
		}
	}
})();
```

- Now we can build without problem!

#### Since React is just a JS library, all we're doing is applying the TS principles we learned last week to work with it. But we're still just typing function parameters via props in our functional components, or using generic syntax/type assertion for typing state
