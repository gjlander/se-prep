# Intro to TypeScript

## Refactor Exercises

- js basics

## Topics to cover

- What is TS and why bother?
- Primitive types
  - type annotations
  - inferred types
- Typing functions
  - Not null assertion
- A modern TS setup
- Refactoring old exercises

## What is TS?

- Walk through article until **Why does Typescript matter?**

### A basic example

- I have a basic vanilla HTML/js setup here (remember those days?)
- Because js is dynamically typed, it doesn't care if I reassign a variable to a new type

```js
let num = 6;

num = 'Not anymore!';
```

- As mentioned, not all programming languages are like this, in fact many aren't. They require you do declare what type the variable is when you declare it, and will throw an error if you try to reassign it. This (along with some other features) is what TS adds to js ad shown in the [docs](https://www.typescriptlang.org/)

- This makes TS a superset of js, it doesn't remove anything from js, only adds. And in fact, gets compiled (or technically transpiled) into js

### Why

- TS is designed to help us write cleaner code to catch potential bugs as we write our code. It throws errors during development, so we don't get runtime errors (errors that don't appear in our code, but will cause our app to crash)
- If we try to use an array method on our `num` variable, js won't say anything is wrong, but during runtime we see this code in fact doesn't work. This will give us an `Uncaught TypeError`

```js
num.forEach(element => {
  console.log(element);
});
```

## A modern TS setup

- Frankly, the most complicated part of working with TypeScript is setting up your local environment. Luckily, nowadays there are pretty powerful tools that take care of that for us (at least in the frontend)

- Just as we used Vite to handle our React setup, we can also use it for a Vanilla js setup (or Vanilla js and React js for that matter)

### Setup with Vite

- It's the same command `npm create vite@latest` (though you can also add the flags to bypass selecting the options, as shown in the LMS)
  - `Vanilla`
  - `TypeScript`
- Just like React, the vanilla setup comes with a lot of boilerplate that we'll clear out
  - public/
  - src/typescript.svg
  - src/counter.ts
  - remove icon in HTML file
  - clean out `main.ts`
- We'll only use the vanilla setup this week for learning TS, next week we'll transition back to React (but with TS!)

### Directory structure

- Our directory structure looks very similar to our React setup but I want to highlight 2 things
  - `jsconfig.json` - this tells TS how we want it to behave in our application. Getting this file right is one of the hardest parjs of the setup, so thankfully it's taken care of for us. We'll dive deeper into it later
  - `package.json` - In the build command, `tsc` had been added before `vite build` This is what will cause our TS to compile into js for deployment.

### Fixing js errors in a modern IDE

- If we copy/paste our js into `main.ts`, VS Code will complain for us, and if we hover over the red squigglies we see our errors, but our code will still run, and we can see the runtime error
- Older setups you would have your TS, run `tsc` to compile it, and your app would crash if there were errors. If dev, this can be annoying, so now our app will continue to run with the errors, and VS Code (or any modern IDE) will highlight the errors for us

## js Primitives in TS

- TS has all of the primitive js types (remember js does HAVE types). You can explicitly type a variable when you declare it. What are the TS types?
- Annotating a type can be as simple as adding a `:` and the type name, and we can see it when we hover over a variable (you may have already noticed this TS feature while working in js)
- string

```js
let myString: string = 'This is a string';
```

- number

```js
let num: number = 6;
```

- boolean

```js
let bool: boolean = false;
```

- null

```js
let nullVar: null = null;
```

- undefined

```js
let undef: undefined;
```

- js also has an `any` type, which basically brings it back to being dynamically typed like in js

```js
let anything: any = 'This can be reassigned';

anything = 42;
```

- js also has `bigint` and `symbol` but we'll continue to not really work with those
- We'll cover Array and Object type annotations next time

### Implicit vs Explicit typing

- The nice thing is that TS is actually pretty smart about figuring out what type a variable should be. So best practice is to let TS figure it out, and only explicitly type as needed
- And VS Code offers help as well, when we hover

```js
let myString = 'This is a string';
let num = 6;
let bool = false;
let nullVar = null;
```

- But sometimes TS gets it wrong, for `undef` it will see it implicitly as `any`, because it has no idea what type you'll give it later. So if we want it to be `undefined` we have to state it explicitly

```js
let undef;
```

- Similarly with `anything`, it will implicitly type it to a string, so if we want it to be `any` we have to be explicit

  - We would normally want to avoid `any`, since we lose all of our js benefijs

### Literal types with `const`

- You may have noticed that I've been using `let` this whole time. Since primitives are immutable (unlike Objects and Arrays), if I assign a primitive with `const` TS recognizes that it cannot be changed, and infers a literal type
- This means it's not just of type `string` but specifically that string
  - same for `number or boolean`

```js
const constString = 'I cannot be changed';
```

## Basic Function Annotation

- We can also annotate function parameters and returns
- Say we have a function to capitalize all the letters of a string

```js
function shout(spoken) {
  return spoken.toUpperCase();
}

console.log(shout('hey, how are you?'));
```

- TS is already yelling at us to say we have an implicit `any`, this means TS can't help us out, since we'll get a runtime error if we try to pass a number, or anything other than a string (or any object with a `toUpperCase` method)

```js
console.log(shout(42));
```

- To fix this, we annotate that `spoken` should be a string

```js
function shout(spoken: string) {
  return spoken.toUpperCase();
}
```

- Now TS will complain if we try to pass a number
- This can also help us with autocomplete suggestions and avoid typos

```js
function shout(spoken: string) {
  return spoken.toUppercase();
}
```

### Annotating return types

- TS can also infer the return type (hover to show), but for clarity, we can also explicitly type it by writing it after the ()

```js
function shout(spoken: string): string {
  return spoken.toUpperCase();
}
```

- It works the same with arrow functions

```js
const shout = (spoken: string): string => {
  return spoken.toUpperCase();
};
```

- If a function doesn't return anything at all, we know it returns `undefined`, but TS gives us `void` which let's us more explicitly say this function has no return, or if it does return something, ignore it completely

```js
const print = (content: any): void => {
  console.log(content);
};

print(shout('hey, how are you?'));
```

- It can also help us catch potential bugs in large functions with branching paths
- Bringing in the example from the LMS as an arrow function

```js
const isOldEnough = (age: number): string => {
  if (age >= 18) {
    return 'You are old enough.';
  }
};
```

- TS will complain and tells us that what we've annotated for `isOldEnough` doesn't match the reality. In our short examples that's easy to see, but by now you've seen not all functions are that straightforward
- We fix it and the error goes away

```js
const isOldEnough = (age: number): string => {
  if (age >= 18) {
    return 'You are old enough.';
  } else {
    return 'You are not old enough';
  }
};
```

- You can make a parameter optional by adding a `?`

```ts
const logMessage = (message: string, userId?: number): void => {
  console.log(`${message} ${userId ? `From user ${userId}` : ''}`);
};

logMessage('Hello there!');
logMessage('Something', 4);
```

- Just as with Vanilla JS, you can also set a default value (this will also automatically make it optional)
  - important to note that optional/default parameters need to go after required parameters

```ts
const greetUser = (name: string = 'guest'): string => {
  return `Welcome, ${name}!`;
};

console.log(greetUser()); // Welcome, guest!
console.log(greetUser('Ada')); // Welcome, Ada!
```

#### We'll spend the rest of the module diving deeper into TS. For today work through the tutorials, and refactor the js-basics exercises from Module 1 into TS - you'll find that you don't need to add much!
