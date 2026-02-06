# Generics and Utilities

## Refactor exercises

- fetch api
- setTimeout & setInterval

## Topics to cover

- Generics
  - built-in generics
    - Array
    - Promise
  - generic functions
  - more than one generic parameter
  - constraints
    - `object` vs `{}`
    - `keyof`
  - defaults
- Utilities
  - Partial
  - Required
  - Readonly
  - Pick
  - Omit
  - Record
  - Exclude
  - Extract
  - NonNullable

## Generics

- In order to allow us to create reusable functions, components, and generally code, TS gives us use of generics

### Built-in generics

- You've actually already seen some built-in generics, the alternate syntax for arrays is a generic type

```ts
const stringArray: Array<string> = ['1', '2', '3'];
```

- So `Array` is a type, but it needs a second type to be complete. So to say this `Array` is an array of `string`s, we pass that type with these angle brackets
- The same is true of the `Promise` type. A promise is an object in JS,but it resolves to something. So an async function will return a promise, and you can type what the promise should resolve to
- We can see that if we hover over the signature of `fetch('https://duckpond-89zn.onrender.com/wild-ducks');`
  - It returns a Promise that resolves to a response object

## Generic functions

- We can make a general use (or generic) `fetchData` function that will fetch and call `res.json()`. A nice utility function that can be used in many different places

```ts
const fetchData = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error('Fetch failed');
	return res.json();
};
```

- If we hover over the function, we see that TS knows this returns a promise (since all async functions return a Promise), but has it resolve to `any`
- We can make this function generic, by adding `<T>` before the `()`. This `T` acts as a placeholder. By convention, this is called `T` for type, but just as with function parameters, you can name this whatever you want
- Then, for the return type, we type it as a promise that instead of resolving to `any` resolves to our `T` placeholder

```ts
const fetchData = async <T>(url: string): Promise<T> => {
	const res = await fetch(url);
	if (!res.ok) throw new Error('Fetch failed');
	return res.json();
};
```

- Then, when we call it, in addition to passing arguments, we must also pass the type we want this to return

```ts
const ducks = fetchData<Duck[]>(
	'https://duckpond-89zn.onrender.com/wild-ducks'
);
```

- And if we await it, TS knows this is no longer a promise, but our ducks array
  - note that this is still a case of _"Hey, trust me bro"_ we have to make sure our type matches what the API actually gives us

```ts
const ducks = await fetchData<Duck[]>(
	'https://duckpond-89zn.onrender.com/wild-ducks'
);
```

## Generic Types & Type Aliases

- We can also make our own generic type aliases
- Say we're working with a different API that includes meta, like TMDB
- We need to add an optional options parameter to our `fetchData` function

```ts
const fetchData = async <T>(url: string, options?: RequestInit): Promise<T> => {
	const res = await fetch(url, options && options);
	if (!res.ok) throw new Error('Fetch failed');
	return res.json();
};
```

- Then we can call it

```ts
const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization:
			'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWI1OTkzY2VjYTIwOTkwOWI5NWI0ODJmODVjNDlmMCIsIm5iZiI6MTcyNzcwNTE3Mi42NDA2NDMsInN1YiI6IjY2ZmFhZjAyM2EwZjVhMDhjOGYxOGYzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JILLUNBjQwItAiLtLcP4FdjW4st_bKAdMsGxw253X-0'
	}
};

const tmdbResponse = await fetchData(
	'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
	options
);
console.log(tmdbResponse);
```

- So if we were to type this response it might look like this

```ts
type ApiResponse = {
	page: number;
	results: any[];
	total_pages: number;
	total_results: number;
};
```

- We could replace `any` with a `Movie` type (we'll just take a few properties we care about)

```ts
type Movie = {
	original_title: string;
	poster_path: string;
	id: number;
};
```

- And we can assign the type to the variable or using generic syntax

```ts
const tmdbResponse: ApiResponse = await fetchData(
	'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
	options
);
```

- But imagine we're working with a series of APIs or endpoints that we know all follow this structure, just the results would be different, perfect use case for generics

```ts
type ApiResponse<T> = {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
};

const tmdbResponse: ApiResponse<Movie> = await fetchData(
	'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
	options
);
```

## Constraining generics

- We can also limit what types our generic accepts with constraints

### `extends` keyword

- We can specify that certain properties must exist, by using the `extends` keyword
  - this will work inline, or with type aliases and interfaces

```ts
type LengthWise = {
	length: number;
};

const logLength = <T extends LengthWise>(value: T) => {
	console.log(value.length);
};

// logLength(4);
logLength('45');
logLength([1, 2, 3, 4]);
logLength({ name: 'Sally', length: 3 });
```

### Default Types

- Go over LMS example

### Using several types in a generic

- Just as with function parameters, generics can accept multiple types
- We can have a `makeTuple` function that will accept 2 types, and turn it into a tuple

```ts
const makeTuple = <T, U>(item1: T, item2: U): [T, U] => [item1, item2];

const myTuple = makeTuple(3, 'Jimmy');
```

## Some additional TS types you might find useful

### `{}` vs `object`

- Thus far when typing objects, we've use mainly type aliases, and a touch of interfaces. But what if you want to make a generic, and constrain it to be an object, any object?

```ts
const makeTupleArray = <T>(obj: T) => Object.entries(obj);
```

- Your might try to just extend an empty object, since we want an object, but don't care about any properties. Let's try it out

```ts
const makeTupleArray = <T extends {}>(obj: T) => Object.entries(obj);

const object = {
	a: 'some string',
	b: 42
};

console.log(makeTupleArray(object));
console.log(makeTupleArray(42));
```

- Seems to work fine at first, but it let's us use primitives. This is technically allowed by `Object.entries()`, but not what we want
- Will it at least prevent `null` or `undefined`?

```ts
console.log(makeTupleArray(null));
console.log(makeTupleArray(undefined));
```

- Yes, because that is exactly what the `{}` represents, any non-nullish value. This can be a way to limit `unknown` just a little bit, since `unknown` will allow nullish values
- What we actually want is the `object` (with lowercase `o`) type. Now if we try to pass a primitive, it gets mad at us

```ts
const makeTupleArray = <T extends object>(obj: T) => Object.entries(obj);

const object = {
	a: 'some string',
	b: 42
};

console.log(makeTupleArray(object));
console.log(makeTupleArray(42));
```

### `keyof`

- A useful TS feature to help us derive types from other types is `keyof`. It will create a type that is restricted to keys of an object type

```ts
type SomeObject = {
	a: string;
	b: number;
};

type SomeObjectKeys = keyof SomeObject;

const someKey: SomeObjectKeys = 2;
```

- We can also see our options with autocomplete using `Ctrl/Cmd + space`
- This can also be used in generics, but that will be up to you in the exercise

## Built-in utilities

- Go over LMS article, ask for questions
