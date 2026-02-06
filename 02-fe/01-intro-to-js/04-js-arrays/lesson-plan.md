# JS Loops and Arrays

# Loops

- Used to do the same thing over and over until a condition is met.
- Say we want to log something 5 times, I can copy/paste it, but if you have more sophisticated things you want to do, this get impractical (like if I want to do it 100, or 100,000 times)
- If I want the same thing to happen over and over, I can use a loop. There are several kinds of loops

### for loop

- go to [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for)
- We use it when we know how many times we want it to run
- 3 parts (don't need to memorize terms, syntax will come with time)
- - Initialization: usually your counter, declare with let, use i by convention
- - Condition: the loop will stop when this condition is true
- - Afterthought: happens at the end of the loop, usually your incrementor

```js
for (let i = 0; i <= 5; i++) {
  console.log("It's party time!");
}
```

- Why did it print 6 times?

#### We can read the current value of our counter

```js
for (let i = 0; i <= 5; i++) {
  console.log(`The current index is: ${i}`);
}
```

- Solutions? (let i = 1, no, i < 5, yes)
- Consider the for loop your go-to loop option

### while loop

- Like a for loop with only the middle part (the condition)
- Show with true - crashes the page

```js
while (true) {
  console.log('Infinite money glitch!');
}
```

- Want to make sure the condition will be false eventually
- Logic to change to condition would go at the bottom
- Can use number comparisons...

```js
let percentLoaded = 0;
while (percentLoaded < 100) {
  console.log('Loading....');

  percentLoaded += 10;
}
```

- Or anything that evaluates to false

```js
let stillLoading = true;
while (stillLoading) {
  console.log('Loading....');

  stillLoading = false;
}
```

### do... while

- Same as while, but will always run at least once

```js
while (false) {
  console.log('Will I print?');
}

do {
  console.log('What about me?');
} while (false);
```

# Arrays

## Key concepts for exercises

- Initialize an array
- Access array elements
- Change value based on index
- Array methods
- Loops in arrays

## Array basics

- Say we have several values to keep track of, we could make a variable for each

```js
const wizard = 'wizard';
const rogue = 'rogue';
const bard = 'bard';
const paladin = 'paladin';
```

- But this is inefficient, and JS has no way of knowing these are related

### In come arrays

- Initialize with [] brackets, separate items with a comma
- We can print them, just like our any other variable
- But the console shows us some extra stuff, like the length, and the index of each item

- What do you notice that's strange?
- We start counting with 0 - arrays are 0-indexed
- But the length is still 4, we can check this property using dot notation

```js
console.log('dndClasses length: ', dndClasses.length);
```

### Bracket notation to access items in array

```js
console.log(dndClasses[0]);
console.log(dndClasses[1]);
console.log(dndClasses[2]);
console.log(dndClasses[3]);
```

- Can also update an item with this technique

```js
dndClasses[3] = 'monk';
console.log(dndClasses[3]);
```

- This worked because we have 4 items, imagine we have 100, or 1,000. Or don't know the length of the array. What can we use to do something over and over again?

## Loop over an array

### welcome back the for loop!

- The condition is now the length of the array
- This is why we start at 0, to math the array indexing (or at least one reason)

```js
for (let i = 0; i < dndClasses.length; i++) {
  console.log(dndClasses[i]);
}
```

### for... of Looks nicer, but does the same thing

- We have one final loop to show you today: for of...
- Unlike the other loops, for... of needs someTHING to loop over (i.e a string or an array)

```js
for (const dndClass of dndClasses) {
  console.log(dndClass);
}
```

- When looping over an array, they do the same thing, so pick your favorite. The for loop is more flexible, can use it for other things too.

### Could also use a while loop in theory, but we'll prefer for or for... of

## Array methods

- What is a method? A method is a function, but it's a special function. It's a function that belongs to an object (and arrays, since arrays are objects)

- Bring up the console.log of the array again. In the dropdown we can see the "Prototype". Basically, this is an array, and ALL arrays follow this "prototype", meaning it has access to a whole bunch of methods
- If we go down further, we can see that it is also a prototype of an object (more on those tomorrow)
- These methods (functions), give us a lot of cool ways to manipulate arrays.
- We can find all of the methods in the [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)

#### Don't feel like you have to memorize these all at once! The documentation is there as a reminder. I still have to go back and look up the syntax for some of these that I don't use as often, or to double check details. I did it to prepare for this lecture

### .push() and .pop()

- Add item to end of array
- Mutates (changes) original array

```js
dndClasses.push('fighter');
console.log(dndClasses);
```

- Remove from end of array
- Mutates original array

```js
dndClasses.pop();
console.log(dndClasses);
```

### .unshift() and .shift()

- Do the same but at the beginning

```js
//.shift()
dndClasses.shift();
console.log(dndClasses);

//.unshift
dndClasses.unshift('warlock');
console.log(dndClasses);
```

### .reverse() and .toReversed()

- reverse mutates the original array toReversed makes a new one

```js
console.log(dndClasses);
// dndClasses.reverse();
const reversedClasses = dndClasses.toReversed();
console.log(dndClasses);
console.log(reversedClasses);
```

### .splice() and .toSpliced()

- splice mutates, toSpliced makes new
- Allows you to remove and possibly add in items with more control
- A little more complex, so to the [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- Arguments:
- - Index to start removing at
- - Delete count: if not there will remove all elements after start
- - Add items: 1 or more items you'd like to add at the start

- How will the array look if I do this?

```js
dndClasses.splice(1, 3);
```

- And now?

```js
dndClasses.splice(2, 1, 'sorcerer');
console.log(dndClasses);
```

### .slice()

- Makes a new shallow array, does not effect original array
- Starting index, end (not inclusive) index

```js
console.log(dndClasses.slice(0, 3));
```

### .join()

- Concatenates array of strings into single string
- Show wth different separators

```js
console.log(dndClasses.join());
```

### Arrays are foundational to web development. We'll continue to dive deeper, but practice array manipulation over and over.
