# Intro to JavaScript

## Key points for Exercises

### Variables

- Declaration with var, let, and const
- Reassigning values
- Printing variables

### Arithmetic

- Addition, subtraction, multiplication and division with numbers and mixed types
- Modulus operator, increment, shorthand

### Comparisons

- Simple and strict equality
- Greater/less than

### Conditionals

- if/else
- if/else if
- switch

### Functions

- Three ways of writing a function
- Calling a function
- Parameters

## Scope

- Global and block scope
- var is weird

# Lesson Plan

- start with empty JS file

## Getting started

- Write a comment, ask and discuss

```js
//What's happening here?
```

- Write addition, ask and discuss

```js
20 + 5;
```

### How do I display the results?

- Show console.log(), where did it go?

```js
console.log(20 + 5);
```

- Can run in Node.js, but was built for the browser - so let's connect it
- Make an HTML file and connect the JS with a script tag
- Open in browser - how do I find the log? Dev tools!
- Mention the playground has done some extra work to simply display it - we'll circle back to that at the end

## Variables

- store addition in a variable, and log it

### JavaScript is dynamically typed, and synchronous

- This means don't have to declare a data type, and can reassign to a different one

### What are the other data types? Go to playground (slide 5)

- Reassign number to a string, show logs before and after reassignment
- What are the other methods of declaring a variable? Discuss differences
- Show what happens if you try to reassign const

## Arithmetic - Go to LMS (slide 6)

- Make note of incrementor and += syntax

## Comparisons - Go to LMS (slide 8)

- Make note of difference between strict equality and simple equality

### Operators

- Go to [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#assignment_operators)
- Talk about logical &&, ||, !

## Conditionals

### If Statements

- Write an if statement with true, reassign a variable - ask what will happen before running it
- Do the same with false
- Show other if conditions

#### Talk about scope here

- Assign a variable inside the if statement and log it
- try to log it outside the scope
- Do the same for a variable with the same name as a global

### If/else Statements

- And an else example

#### Ternary operator

- Functions almost exactly the same as if/else, explain the syntax

### If/else if

- For when there's several conditions to meet
- Show examples

### Switch statements

- Long chains of else if gets hard to read, then use switch
- Show example with DnD classes logging a catch phrase

```js
let characterClass = 'wizard';

switch (characterClass) {
  // (characterClass === 'fighter')
  case 'fighter':
    console.log("I'm very strategic!");
    break;
  case 'monk':
    console.log('Who needs weapons, when I have my fists!');
    break;
  case 'wizard':
    console.log('I get my magic from books.');
  case 'sorcerer':
  case 'warlock':
    console.log('I can do powerful magic!');
    break;
  default:
    console.log('I love DnD!');
}
```

- Note breaks and fall through

## Functions

- Functions are a set of instructions (do what's inside here)

### Function Declarations

- Write a function

```js
function sayHelloWorld() {
  console.log('Hello World!');
}
```

- Why did nothing happen? Have to call function
- Talk about return keyword, and how you can store it in a variable
- Without return, returns undefined
- Call the function before it's declared, ask and discuss

### Function Expressions

- Write something fun, but here's the syntax

```js
const goodByeWorld = function () {
  console.log('Goodbye, cruel world!');
};
goodByeWorld();
```

- Are not hoisted

### Arrow functions - Introduced in ES6 in 2015 (along with lots of stuff)

- Look similar to function expressions, preferred syntax nowadays
- Go over arguments
- Mention default parameters, let them know it's ok if rest parameters don't make sense yet

## Final Thoughts

- This is everything you need to finish the exercises (except Loops and Variables and Scope 4)
- Go to LMS and demo downloading an exercise after completing
- Fix logo, mention errors don't show in the UI
