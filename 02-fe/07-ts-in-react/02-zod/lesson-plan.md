# Runtime Validation with Zod

## Topics to cover

- Type assertion doesn't check anything
- Assertion/runtime mismatch
- Validation with Zod
  - creating a schema
  - transforming with a schema
  - type inference from schema
- Zod in the duckpond
- Input validation with Zod?

## The Trust Gap: Limitations of Type Assertion

- When working with API calls, thus far we've been using type assertion to let TS know what type we're working with
- A basic app with JSON placeholder, we might fetch in `useEffect`, and see what our response looks like`

```ts
import { useEffect } from 'react';

const App = () => {
	useEffect(() => {
		const getTodo = async () => {
			try {
				const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
				if (!res.ok) throw new Error('Something went wrong!');
				const data = await res.json();

				console.log(data);
			} catch (error) {
				console.error(error);
			}
		};
		getTodo();
	}, []);
	return (
		<div>
			<h1>Runtime Validation with Zod</h1>
		</div>
	);
};

export default App;
```

- From here, we see we get an array of objects, and based on the shape of the objects, we can declare our type alias, and use type assertion

```ts
type Todo = {
	userId: number;
	id: number;
	title: string;
	completed: false;
};

const data = (await res.json()) as Todo;
```

- We can use this to type our state, and get autocomplete, etc

```ts
const [todo, setTodo] = useState<Todo | null>(null);

<ul>{todo && <li className={todo.completed ? 'line-through' : ''}>{todo.title}</li>}</ul>;
```

- The problem with this, is that at runtime, when the code is actually executing, TS has now way of knowing if our code is valid. The API might update, or we might have a typo in our type that messes everything up
- If we change `title` to `name`, TS will complain, but the mistake is ours. There's a mismatch between the type, and the actual response, but TS can only access the type we tell it

```ts
type Todo = {
	userId: number;
	id: number;
	name: string;
	completed: boolean;
};
```

## Runtime validation with Zod

- A super TS friendly library to get that runtime validation is [Zod](https://zod.dev/)

### Zod docs - Basic Usage

- With Zod, you define a schema that describes the shape your data should have. Zod's types track 1:1 with TS

- So, we can make a `TodoSchema`

```ts
const TodoSchema = z.object({
	userId: z.number(),
	id: z.number(),
	title: z.string(),
	completed: z.boolean()
});
```

- Then we can call `safeParse` on it during the fetch call to validate that our incoming data matches the Schema
  - if all of the validation checks pass, `safeParse` will return a deep clone of our data, and we can be confidant that it matches our schema that's on the `data` property
  - there is also a `success` boolean we cna use to check
  - if validation failed, we get an `error` property

```ts
const getTodo = async () => {
	try {
		const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
		if (!res.ok) throw new Error('Something went wrong!');
		const data = (await res.json()) as Todo;
		console.log(data);
		const parsedData = TodoSchema.safeParse(data);
		console.log(parsedData);
		// setTodo(parsedData);
	} catch (error) {
		console.error(error);
	}
};
```

- If we change `id` to a `string`...
- We get a Zod error
- We can destructure those properties right away
- Zod has a helper to turn there error message into a readable string
- If `success` is false, we throw an error with that formatted error message
- If validation passes, we get update our state confidently

```ts
const getTodo = async () => {
	try {
		const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
		if (!res.ok) throw new Error('Something went wrong!');
		const dataRes = (await res.json()) as Todo;
		console.log(dataRes);
		const { success, data, error } = TodoSchema.safeParse(dataRes);
		if (!success) {
			throw new Error(z.prettifyError(error));
		}
		setTodo(data);
	} catch (error) {
		console.error(error);
	}
};
```

### Inferring Types with Zod

- Now we have our schema, and it should match our type exactly, but if we change our schema, we also then have to go and change our type, and TS will help us figure out our mistakes if we have them, but Zod makes it even easier for us
- We can get the type directly from our schema rather than creating a separate one

```ts
type Todo = z.infer<typeof TodoSchema>;
```

- This way we have a "single source of truth", and we can now have runtime validation, and our TS type coming from Zod

- Since Zod also supports arrays, we could use this for the `todos` endpoint

```ts
const TodoSchema = z.object({
	userId: z.number(),
	id: z.number(),
	title: z.string(),
	completed: z.boolean()
});

const TodoArraySchema = z.array(TodoSchema);
// type Todo = {
// 	userId: number;
// 	id: number;
// 	title: string;
// 	completed: boolean;
// };

// type Todo = z.infer<typeof TodoSchema>;
type TodoArray = z.infer<typeof TodoArraySchema>;

const App = () => {
	// const [todo, setTodo] = useState<Todo | null>(null);
	const [todo, setTodo] = useState<TodoArray>([]);
	useEffect(() => {
		const getTodo = async () => {
			try {
				const res = await fetch('https://jsonplaceholder.typicode.com/todos/');
				if (!res.ok) throw new Error('Something went wrong!');
				const dataRes = await res.json();
				console.log(dataRes);
				const { success, data, error } = TodoArraySchema.safeParse(dataRes);
				if (!success) {
					throw new Error(z.prettifyError(error));
				}
				setTodo(data);
			} catch (error) {
				console.error(error);
			}
		};
		getTodo();
	}, []);
	return (
		<div>
			<h1>Runtime Validation with Zod</h1>
			<ul>
				{todo.map(todo => (
					<li key={todo.id} className={todo.completed ? 'line-through' : ''}>
						{todo.title}
					</li>
				))}
			</ul>
		</div>
	);
```

## Adding Zod to the Duckpond

- We can use those same principles to add runtime validation to our DuckPond
- Since we're in a bigger project, let's organize our schemas in a new `schemas` folder

### Making a Duck Schema

- Let's create schemas to mirror our types, so a `DBEntrySchema`, a `DuckInputSchema`, and a `DuckSchema` that combines them
  -Zod has an `extend` method, but they recommend using the spread operator to combine schemas

```ts
import { z } from 'zod/v4';

export const DBEntrySchema = z.object({
	_id: z.string(),
	createdAt: z.string(),
	updatedAt: z.string().optional(),
	__v: z.number()
});

export const DuckInputSchema = z.object({
	name: z.string(),
	imgUrl: z.string(),
	quote: z.string()
});

export const DuckSchema = z.object({
	...DBEntrySchema.shape,
	...DuckInputSchema.shape
});

export const DuckSchemaArray = z.array(DuckSchema);
```

- We can then import the schemas using the `type` prefix to tell TS that we don't need any actual JS to come from this, and extract our types

```ts
// export type DuckInput = {
// 	name: string;
// 	imgUrl: string;
// 	quote: string;
// };

export type DuckInput = z.infer<typeof DuckInputSchema>;

// export type Duck = DBEntry & DuckInput;
export type Duck = z.infer<typeof DuckSchema>;

export type DuckArray = z.infer<typeof DuckSchemaArray>;
```

- Back in `ducks.ts`, let's get rid of our type assertions, and instead do some real runtime validation

```ts
import type { DuckInput, Duck, DuckArray } from '../types';
import { z } from 'zod/v4';

import { DuckSchema, DuckSchemaArray } from '../schemas';

const getAllDucks = async (abortCont: AbortController) => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks', {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const dataRes = await res.json();
	const { success, data, error } = DuckSchemaArray.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));
	// console.log(data);

	return data;
};
```

- Now even if we remove the return type annotation, TS can infer it. And we get a runtime validation check, so even once TS is gone, and this is transpiled to JS our code is still safe

```ts
const getDuckById = async (
	id: string,
	abortCont: AbortController
): Promise<Duck> => {
	const res = await fetch(
		`https://duckpond-89zn.onrender.com/wild-ducks/${id}`,
		{
			signal: abortCont.signal
		}
	);
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const dataRes = await res.json();
	const { success, data, error } = DuckSchema.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));
	// console.log(data);

	return data;
};

const createDuck = async (newDuck: DuckInput): Promise<Duck> => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-duckss', {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(newDuck)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const dataRes = await res.json();
	const { success, data, error } = DuckSchema.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));
	// console.log(data);

	return data;
};
```

### Auth schemas

- We can do the same for the responses for auth endpoints
- Define our schemas

```ts
export const SignInResSchema = z.object({
	token: z.string(),
	user: z.object({
		userId: z.string()
	})
});

export const UserSchema = z.object({
	...DBEntrySchema.shape,
	firstName: z.string(),
	lastName: z.string(),
	email: z.email()
});
```

- Infer types from them

```ts
import type {
	DuckInputSchema,
	DuckSchema,
	DuckSchemaArray,
	SignInResSchema,
	UserSchema
} from '../schemas';

export type SignInRes = z.infer<typeof SignInResSchema>;

export type User = z.infer<typeof UserSchema>;

// export type User = DBEntry & {
// 	firstName: string;
// 	lastName: string;
// 	email: string;
// };
```

- Add runtime validation to our functions

```ts
import type { User, SignInInput, SignInRes } from '../types';
import { z } from 'zod/v4';
import { SignInResSchema, UserSchema } from '../schemas';
const BASE_URL = 'https://duckpond-89zn.onrender.com/auth';

const signIn = async (formData: SignInInput): Promise<SignInRes> => {
	const res = await fetch(`${BASE_URL}/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const dataRes = await res.json();
	const { success, data, error } = SignInResSchema.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));

	return data;
};

const me = async (): Promise<User> => {
	const token = localStorage.getItem('token');

	const res = await fetch(`${BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const dataRes = await res.json();
	const { success, data, error } = UserSchema.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));

	return data;
};

export { signIn, me };
```

#### Zod can be used anytime a validation check needs to happen at runtime, including input validation! That's outside of the scope of our lecture today, but take a look at the React 19 forms lesson repo, or the debugging TS repo for some examples of how to use Zod to validate input. It's a really powerful library, and really nice to work with
