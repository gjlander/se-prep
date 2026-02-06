# Command-line word games

## A note on process.argv

-   Earlier we only had an output, but users couldn't input anything. For the project this week, users need to be able to input something. This was addressed in the article, but I'd like to take a moment to clarify it as well.
-   process.argv is an array of the arguments (or inputs) when the process runs

### First two args are always the path to node in your computer, and the path to the file that's running the script

-   Example with no additional inputs

```js
console.log(process.argv);
```

### Each additional input, separated by spaces, is an additional argument (this principle is also how other CLI commands work)

-   Example with several args

### Wrapping in double quotes allows for spaces in a single argument

-   Example with quotes

### Using .slice() to get rid of first two, and only have user input

```js
const args = process.argv.slice(2);
console.log(args);
```

## Talk through example in article

-   You can use the length property to check for number of inputs
-   This input is always a string, there are several ways of coercing a string into a number, parseFloat() is one
-   isNaN() returns a boolean that determines if the arguments is not a number
-   These are all validation checks - validation meaning to check, or validate, that the user is giving the expected type of input, and stopping to program if it's the wrong kind
-   Once validation is done, you have your app logic, and in our case, always console.log() the final message.

```js
// sum.js
// Get two numbers from the command line
const args = process.argv.slice(2);
// Check if the user provided exactly two numbers
if (args.length !== 2) {
    console.error('Please provide exactly two numbers');
    return;
}
// Parse the arguments into numbers
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
const num1 = parseFloat(args[0]);
const num2 = parseFloat(args[1]);
// Check if the user provided two numbers
if (isNaN(num1) || isNaN(num2)) {
    console.error('Both arguments must be numbers');
    return;
}

const sum = num1 + num2;
console.log(`The sum of ${num1} and ${num2} is ${sum}`);
return;
```

## The games!

-   Pick one, make a basic working version, then add layers of validation, and handle edge cases. Once you have a good working version of one, if you have time, start a second
-   Rock, Paper, Scissors is the simplest, start here if you're new to programming.
-   string methods will be your friend
-   could be helpful to put the alphabet into an array of individual letters
