# Runtime Checks & Classes

## Refactor exercises

- dom api
- js objects ii
- web storage api

## Topics to cover

- Type narrowing
  - truthiness check
  - `typeof`
  - comparison
  - `instanceof`
  - `in`
  - discriminated unions
- `unknown` type
- Return types `is`
- Type assertions
  - assert not null
- Enums
- Briefly go over classes

## Enums

- Walk through **Direction** example from LMS

### `erasableSyntaxOnly` error

- Using the Vite default settings, you'll see I get an error on direction, but syntactically everything looks good
- Thus far, all of the TS we've used is "erasable" - meaning when it gets transpiled to JS, all that happens is the type annotations get deleted in a process known as type stripping.
- Enums actually get transpiled into JS code, so to get rid of this error, we can comment out the `erasableSyntaxOnly` rule in our config file

### Enums in JS

- To see what we actually get back, let's compile it by running `tsc src/main.ts`
  - We're using `tsc` instead of the build command to just see the JS output, without all of the other bundling and things that Vite would do
- But inside our JS file we see the enum gets turned into a function, and that the default values are as listed in the LMS (0, 1, 2, 3, 4)

### Back to Enums in TS

- Enums solve a very similar problem to Literal Unions, and for that reason, unless you specifically have need for an enum, most developers (myself included) prefer to use Union Literals
  - Though this is the general consensus, you will meet developers who passionately disagree
- We could refactor our `turnWithEnum` function to use Literal Unions instead
  - We can get autocomplete suggestions before typing by using `Ctrl/Cmd + space`

## Type Narrowing

- TS helps us write cleaner code, but it does nothing for us during runtime. But TS can help us to write the proper runtimes checks based on the types we give it

### Truthiness narrowing

- Something we've already been doing in our JS is checking for truthiness
- We can do this with an `if` statement, logical AND, or ternary operator
- TS will complain if we don't pass an argument

```ts
const alertMe = (msg: string): void => {
  if (msg) {
    alert(msg);
  } else {
    alert('Did you forget why you wanted to be alerted?');
  }
};

alertMe();
```

- But an empty string is falsy, so TS won't complain, but there's still not really a message

```ts
alertMe('');
```

- Of course, making this optional highlights even more why this check can be useful

### Equality narrowing

- We can compare equality if there is crossover in our union types

```ts
function compare(x: string | number, y: string | boolean) {
  if (x === y) {
    // TypeScript knows both x and y must be strings
    console.log(x.toUpperCase());
  }
}

compare(4, '4');
compare(4, true);
compare('3', '3');
```

### Type guards with `typeof`

- Most of these runtime checks are done with JS features. An especially useful one for working with primitive types is `typeof`
- It will return a string value of the primitive type

```js
console.log(typeof false);
console.log(typeof 'I am a string!');
console.log(typeof 34);
```

- This is a JS feature that we can use to validate our input
- If we hover over our `value` parameter inside the `if` statement, we see TS recognizes the narrowed type

```ts
function printValue(value: string | number): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

printValue(4);
printValue('test');
```

## Type guarding Objects

- You start to see the limitations of `typeof` when you introduce objects and arrays

```ts
console.log(typeof {});
console.log(typeof []);
```

- See? I told you arrays are objects ;P
- Luckily, JS has a method to help us check if an object is also an array

```ts
console.log(Array.isArray({}));
console.log(Array.isArray([]));
```

### Checking class with `instanceof`

- For any object you are making with a constructor (using the `new` keyword), you can use `instanceof`
- Such as `Date`

```ts
function logDateOrString(val: Date | string) {
  if (val instanceof Date) {
    console.log(
      val.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    );
  } else {
    console.log(val.trim());
  }
}

logDateOrString('1989-12-24');
logDateOrString(new Date('1989-12-24'));
```

- Or another very common case is with errors. Since you can technically throw anything, it's good to check if your error is an `instanceof` the Error class

```ts
const throwSomething = (throwError: boolean) => {
  try {
    if (throwError) {
      throw new Error('This will be the message property');
    } else {
      throw "This wouldn't have a message property, and would cause a runtime error";
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Default error message');
    }
  }
};

throwSomething(true);
throwSomething(false);
```

### `unknown` type

- Which gives us a great opportunity to talk about the `unknown` type
- You'll notice in the `catch` block, the `error` is of type `unknown`. This is similar to any, except TS will force us to type narrow. This can be a really great replacement for `any` if you're unsure of what types will be passed
- If we remove our type checking, TS will complain with `unknown` type

```ts
catch (error) {
    console.log(error);
    // if (error instanceof Error) {
    console.log(error.message);
    // } else {
    // console.log('Default error message');
    // }
  }
```

- If we change `error`'s type to `any` TS will let us do whatever want

```ts
catch (error: any) {
    console.log(error);
    // if (error instanceof Error) {
    console.log(error.message);
    // } else {
    // console.log('Default error message');
    // }
  }
```

- So for the flexibility of `any`, but keeping type safety, use `unknown`

### Checking for a property with `in`

- Another JS feature that can help us out is the `in` keyword. It will let us check if a property exists on an object
- Go over LMS example

#### Custom Type Predicates

- We can also extract this logic into a utility function

```ts
const isDog = (pet: Pet) => {
  return 'bark' in pet;
};
```

- If we hover over, the return type of this function isn't `boolean` as we might expect, but `Pet is Dog`. This is known as a type predicate, this is essentially a more explicit way to let TS know you're not only returning a boolean, but using this for type narrowing

### Discriminated Unions

- If we have a union type of 2 objects (as our Pet type is), we can add a property that each object will share, and use that to discriminate between which type we're using
- So we add a `kind` property to each of our pet types

```ts
type Dog = { kind: 'dog'; bark: () => void };
type Cat = { kind: 'cat'; meow: () => void };
```

- Now we can use that type for our type narrowing instead

```ts
function speak(pet: Pet) {
  if (pet.kind === 'dog') {
    pet.bark();
  } else {
    pet.meow();
  }
}

const dog: Dog = {
  kind: 'dog',
  bark: () => console.log('Woof!')
};

const cat: Cat = {
  kind: 'cat',
  meow: () => console.log('Meow!')
};
```

## Type Assertion

- Going back to our DOM example, TS doesn't scan our HTML, so it has no way of knowing if the element is there our not, so it's always `HTMLElement | null`
- But we wrote the HTML, we know it's there, so we can essentially tell TS, _"Hey, trust me bro"_ with a type assertion

### Not null assertion

- We could use a `!` to tell TS this isn't `null` when trying to access properties, but then we have to do it over and over and over

```ts
btn!.textContent = 'CLICK!!!!';
```

- We can also assert it as `not null` when we declare it

```ts
const btn = document.querySelector('#btn')!;

btn.textContent = 'CLICK!!!!';
btn.classList.add('something');
```

### Type assertion with `as` or `<>`

- TS also doesn't recognize which type of element it is, so it gets mad if we try to access a `value` property

```ts
const btn = document.querySelector('#btn')!;
const input = document.querySelector('#text-input')!;

btn.textContent = 'CLICK!!!!';
btn.classList.add('something');
console.log(input.value);
```

- To give the additional context to TS, since WE know that it's an input element, we can say _"Hey, trust me bro"_ by saying `as`

```ts
const btn = document.querySelector('#btn')!;
const input = document.querySelector('#text-input') as HTMLInputElement;

btn.textContent = 'CLICK!!!!';
btn.classList.add('something');
console.log(input.value);
```

- You can also use this funky syntax with `<>`, but we'll generally prefer `as` since it's a little more readable
  - and necessary when working with JSX
  - we also need to assert not null again too

```ts
const input = document.querySelector<HTMLInputElement>('#text-input')!;
```

#### Untrusted sources

- Go to LMS example on APIs
- Note that this doesn't actually check if this is true, since TS only works during development. Later we'll introduce a really nice library to get runtime validation to verify your _"Hey, trust me bro"_

## A brief overview of classes

- TS adds some additional feature to creating classes. Since we won't be working much with classes, file it in the back of your head, and come back to it if you do need it
- Many of these advanced class features wouldn't be used in making an app, but rather if you were making a library. `Abstract Classes` in particular are something you won't need to worry about in your day-to-day
