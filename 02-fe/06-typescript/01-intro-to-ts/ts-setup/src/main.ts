import './style.css';

// let num = 6;

// num = 'Not anymore!';

// num.forEach(element => {
//   console.log(element);
// });

// let myString: string = 'This is a string';
// let num: number = 6;
// let bool: boolean = false;
// let nullVar: null = null;
// let undef: undefined;
// let anything: any = 'This can be reassigned';

// anything = 42;

let myString = 'This is a string';
let num = 6;
let bool = false;
let nullVar = null;
let undef;

const constString = 'I cannot be changed';

// function shout(spoken: string): string {
//   return spoken.toUpperCase();
// }
const shout = (spoken: string): string => {
  return spoken.toUpperCase();
};

const print = (content: any): void => {
  console.log(content);
};

print(shout('hey, how are you?'));
// console.log(shout(42));

const isOldEnough = (age: number): string => {
  if (age >= 18) {
    return 'You are old enough.';
  } else {
    return 'You are not old enough';
  }
};

const logMessage = (message: string, userId?: number): void => {
  console.log(`${message} ${userId ? `From user ${userId}` : ''}`);
};

logMessage('Hello there!');
logMessage('Something', 4);

const greetUser = (name: string = 'guest'): string => {
  return `Welcome, ${name}!`;
};

console.log(greetUser()); // Welcome, guest!
console.log(greetUser('Ada')); // Welcome, Ada!
