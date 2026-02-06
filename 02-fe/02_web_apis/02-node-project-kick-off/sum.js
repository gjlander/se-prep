// sum.js
// Get two numbers from the command line
const args = process.argv.slice(2);
console.log(args);

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
