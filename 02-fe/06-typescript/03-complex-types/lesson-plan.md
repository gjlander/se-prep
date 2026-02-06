# Complex TS Types

## Refactor exercises

- js arrays i
- js objects i
- js arrays ii
- baby array cardio
- array cardio

## Topics to cover

- Arrays
- Tuples
- Union types
- Objects
  - optional chaining
  - nullish coalescing vs logical OR
- Type aliases vs interfaces
  - intersections
- Function types

## Typing Arrays

- JS allows for mixed arrays, but most of the time, we want every item in an array to be of the same type
- TS can also infer array types, if we hover over, we can see how we'd annotate them

```js
const strings = ['hi', 'bye', 'what?'];
const nums = [1, 3, 5, 6, 7];
```

- It's as simple as adding [] after the type we want

```js
const strings: string[] = ['hi', 'bye', 'what?'];
const nums: number[] = [1, 3, 5, 6, 7];
```

- Then TS will complain if we try to add something not of that type

```js
nums.push('4');
```

- We can also use generic syntax with `Array<>`, but this isn't common practice (we'll also go deeper into what that syntax is later this week)

```js
const bools: Array<boolean> = [true, false, false, true];
```

## Tuples

- TS adds another data type found in other languages, but not in JS - the tuple
- A tuple is a fixed length array, where each index is of a fixed type. This can be useful if you have a fixed pattern you want to enforce, such as longitude/latitude coordinates, or the return value of useState
- You do this by opening the straight brackets and defining the type for each index

```js
const graphCoordinates: [number, number] = [23, -3];
```

- It is also possible to add an optional item by following the type with a question mark (like maybe we have `x`, `y`, and sometimes `z` coordinates)

```js
const graphCoordinates: [number, number, number?] = [23, -3];
```

## Object Types

- TS can also infer object types

```js
const person = {
	name: 'Steve',
	age: 72
};

person.name = 54;
```

- But if we want to enforce a type, we can annotate. The syntax looks just like an object, but replace the commas with semi-colons

```ts
const person: { name: string; age: number } = {
	name: 'Steve',
	age: 72
};
```

### Optional properties

- Just as with tuples, we can make properties optional with a `?`

```ts
const person: { name: string; age: number; city?: string } = {
	name: 'Steve',
	age: 72
};

// person.name = 54;
// person.city = 'Berlin;
```

- If we try to use a string method on this optional property, we'll get a TS error and a runtime error

```js
console.log(person.city.toUpperCase());
```

#### Optional chaining

- Something we've used already in JS is optional chaining, just add a question mark in the dot notation. This way we get `undefined` instead of an error on nested chains or with methods

```js
console.log(person.city?.toUpperCase());
```

#### Logical OR and Nullish Coalescing

- We've also used the logical OR, where if something is falsy, we give a default value

```ts
console.log(person.city || 'Unknown');
```

- Similar to the logical OR, is Nullish coalescing

```ts
console.log(person.city ?? 'Unknown');
```

- The key difference can be seen in the [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
  - Logical OR will use the default for any falsy value
  - Nullish coalescing will only use the default explicitly with `null` or `undefined`

```ts
console.log(0 || 'Default');
console.log(0 ?? 'Default');
console.log('' || 'Default');
console.log('' ?? 'Default');
console.log(null || 'Default');
console.log(null ?? 'Default');
```

#### Checking for value first

- Or we can check for the value before doing anything with it
- via an if statement

```ts
if (person.city) {
	console.log(person.city.toUpperCase());
}
```

- Or logical AND or ternary for an else

### Read only

- We can make properties `readonly` to prevent reassignment

```ts
const person: { readonly name: string; age: number; city?: string } = {
	name: 'Steve',
	age: 72
};

// person.name = 54;
person.name = 'Alex';
```

### Union Types

- If we want to say something can be one or another type, we can use a Union Type. This is like the logical OR, but with just 1 line

```ts
const person: { id: number | string; readonly name: string; age: number; city?: string } = {
	//   id: 3,
	id: '485ghf-394',
	name: 'Steve',
	age: 72
};
```

### Arrays of objects

- We can similarly just add the [] after to make an array of objects

```ts
const users: { name: string; age: number }[] = [
	{ name: 'Ada', age: 36 },
	{ name: 'Grace', age: 30 }
];

console.log(users);

// users.push({ name: 'Linus' });

users.forEach(user => {
	console.log(`${user.name} is ${user.age} years old`);
});
```

## Type Aliases and Interfaces

### Type Aliases

- Declaring object types inline like this can get a bit clunky, and it's not very reusable. So we can extract the type with a type alias

```ts
type Person = { id: number | string; readonly name: string; age: number; city?: string };
```

- Then use it for each object we want to fit these requirements

```ts
const person: Person = {
	//   id: 3,
	id: '485ghf-394',
	name: 'Steve',
	age: 72
};

const person2: Person = {
	id: 4,
	name: 'Reed',
	age: 43
};
```

- Or have an array of people

```ts
const people: Person[] = [];

people.push(person);
people.push(person2);

people.push({ name: 'Susan' });
```

- Type aliases are also quite flexible, and can be used to make your own custom types outside of just objects

```ts
type StringOrNumber = string | number;

type Person = { id: StringOrNumber; readonly name: string; age: number; city?: string };
```

### Interfaces

- A second option for objects is to use interfaces, it looks similar just no `=` and interface instead of type

```ts
interface User {
	name: string;
	age: number;
}

const users: User[] = [
	{ name: 'Ada', age: 36 },
	{ name: 'Grace', age: 30 }
];
```

#### Go to when to use interface in [LMS article](https://learn.wbscodingschool.com/courses/software-engineering/lessons/advanced-types-and-functions/topic/%f0%9f%93%9a-type-aliases-and-interfaces/)

### Type intersections and Interface Extensions

- Sometimes you have some base properties that you want to include in other objects as well
- Say for example you're working with items from your database, and everything will have an `_id` and `createdAt` property
- You can declare your type

```ts
type DBEntry = {
	_id: string;
	createdAt: string;
};
```

- Then use type intersections to reuse it

```ts
type DBUser = DBEntry & {
	name: string;
	email: string;
	password: string;
};
```

- Then TS will enforce a user with both types and complain if something from either is missing

```ts
const user: DBUser = {
	_id: '123fhgksaw',
	name: 'Steve Rogers',
	email: 'captain@america.com',
	createdAt: '2025-08-01',
	password: 'stevepass'
};
```

- We can use the same principle with interfaces by using `extends`

```ts
interface DBEntryInterface {
	_id: string;
	createdAt: string;
}

interface DBUserInterface extends DBEntryInterface {
	name: string;
	email: string;
	password: string;
}

const user2: DBUserInterface = {
	_id: '123fhgksaw',
	name: 'Steve Rogers',
	email: 'captain@america.com',
	createdAt: '2025-08-01',
	password: 'stevepass'
};
```

- As noted in the LMS, `extends` is can be compiled faster, but that shouldn't be a major concern for us, so we'll still default to type aliases and type intersection

## Mapped Object - go to LMS example

## Literal Unions

- In addition to more general type unions, we can also use literal unions. This is really nice when you know there are a limited set of options to choose from
- Go over LMS example

## Function types

- You can also create a type alias for the shape of a function. If you have a set of functions that all need to fit a certain requirement (for example, a React functional component always has to return JSX)
- The syntax looks like an arrow function one-liner
  - you type the parameters, and the return
- If want want to have a class of calculator functions, we could define the shape

```ts
type Calculation = (num1: number, num2: number) => number;

const add: Calculation = (a, b) => a + b;

const subtract: Calculation = (a, b) => a - b;

add('4', 4);
```

- Go to chart in the LMS about use cases

#### In addition to the Function Cardio exercise, you now have the tools needed to refactor the rest of the exercises from Module 1 into TS

- There is an @ rule for ts to expect an error on the next line, that is used in the exercise to test if your types are in place correctly to cause an error with improper usage

- js arrays i
- js objects i
- js arrays ii
  bonus
- baby array cardio
- array cardio
