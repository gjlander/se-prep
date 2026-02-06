# Higher-order functions

-   JS has "first-class" functions. This means they can be treated like any other variable
-   Higher-order functions either take a function as an argument, or return a function
-   Today we'll focus on the function as an argument part

## A couple normal functions

-   We'll make a simple function to console.log() something

```js
const print = (content) => console.log(content);
```

-   And let's make a function that will loop over an array, and print each item

```js
const printArray = (array) => {
    for (let i = 0; i < array.length; i++) {
        print(array[i]);
    }
};
```

-   Let's make an array objects, and call our printArray function

```js
const avatarChars = [
    { name: 'Aang', nation: 'Air Nation', isBender: true },
    { name: 'Katara', nation: 'Water Tribe', isBender: true },
    { name: 'Sokka', nation: 'Water Tribe', isBender: false },
];

printArray(avatarChars);
```

## A couple more normal functions

-   Make say hello, and a function to sayHello over an array

```js
const sayHello = (char) => {
    console.log(`Hi, I'm ${char.name} and I'm from the ${char.nation}`);
};

const sayHelloLoop = (array) => {
    for (let i = 0; i < array.length; i++) {
        sayHello(array[i]);
    }
};

sayHelloLoop(avatarChars);
```

-   We repeated most of our logic in both of these, but we don't have a lot of flexibility
-   Remember DRY, let's refactor this with a...

## Higher-order function

-   We can make a function that still iterates over an array, but then we also pass it a function that tells it what to do to each item
-   Remember, parameter names can be whatever we want, they're just a placeholder

```js
const higherOrderArrayFunc = (arr, callbackFunc) => {
    for (let i = 0; i < arr.length; i++) {
        callbackFunc(arr[i]);
    }
};
```

-   Then we call it and pass the functions we want (known as callback functions)
-   Note we don't have the parenthesis - we want to pass the function, not the return

```js
higherOrderArrayFunc(avatarChars, print);

higherOrderArrayFunc(avatarChars, sayHello);
```

-   We could also pass an anonymous function

```js
higherOrderArrayFunc(avatarChars, (obj) =>
    obj.isBender
        ? console.log("I'm a bender!")
        : console.log("I can't bend an element, but I've got my wits!")
);
```

## Higher Order array methods

-   What are methods again?
-   If higher order functions are functions that take a callback function as an argument, what are higher order array methods?
-   Methods where you've got to pass it a callback function!
-   Here's a little secret, we kind of just recreated our own

### .forEach()

-   Loops over an array, and does whatever you tell it in the function
-   Passed as an anonymous function
-   Can keep going layers deep...

```js
avatarChars.forEach((obj) =>
    obj.isBender
        ? console.log("I'm a bender!")
        : console.log("I can't bend an element, but I've got my wits!")
);

avatarChars.forEach((c) => print(c));
avatarChars.forEach((char) => sayHello(char));
```

-   Or refactor it, since we have to pass that anonymous callback anyway

```js
avatarChars.forEach((content) => console.log(content));

avatarChars.forEach((char) => {
    console.log(`Hi, I'm ${char.name} and I'm from the ${char.nation}`);
});
```

### To wrap it up, go to [playground](https://playground.wbscod.in/static/javascript-arrays-ii/1)

-   Briefly go over the examples, refer to MDN for more info
-   Treat reduce as optional. It's a tough one, and I still struggle with it
