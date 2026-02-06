//LOOPS/////////////////

//for loop
// for (let i = 0; i <= 5; i++) {
//     console.log("It's party time!");
// }
// for (let i = 0; i <= 5; i++) {
//     console.log(`The current index is: ${i}`);
// }

//while loop
// while (true) {
//     console.log('Infinite money glitch!');
// }

// let percentLoaded = 0;
// while (percentLoaded < 100) {
//     console.log('Loading....');

//     percentLoaded += 10;
// }
let stillLoading = true;
// while (stillLoading) {
//     console.log('Loading....');

//     stillLoading = false;
// }

//do... while
// while (false) {
//     console.log('Will I print?');
// }

// do {
//     console.log('What about me?');
// } while (false);

//ARRAYS//////////////////
const wizard = 'wizard';
const rogue = 'rogue';
const bard = 'bard';
const paladin = 'paladin';

const dndClasses = ['wizard', 'rogue', 'bard', 'paladin'];
// console.log(dndClasses);
// console.log('dndClasses length: ', dndClasses.length);

//bracket notation
// console.log(dndClasses[0]);
// console.log(dndClasses[1]);
// console.log(dndClasses[2]);
// console.log(dndClasses[3]);

dndClasses[3] = 'monk';
// console.log(dndClasses[3]);

//for loop
// for (let i = 0; i < dndClasses.length; i++) {
//     console.log(dndClasses[i]);
// }

// for... of loop
// for (const dndClass of dndClasses) {
//     console.log(dndClass);
// }

//ARRAY METHODS/////////

// console.log(dndClasses);

//.push()
dndClasses.push('fighter');
// console.log(dndClasses);

//.pop()
// dndClasses.pop();
// console.log(dndClasses);

//.shift()
// dndClasses.shift();
// console.log(dndClasses);

//.unshift
dndClasses.unshift('warlock');
// console.log(dndClasses);

// .reverse() and toReversed()
// console.log(dndClasses);
// // dndClasses.reverse();
// const reversedClasses = dndClasses.toReversed();
// console.log(dndClasses);
// console.log(reversedClasses);

//.splice() and .toSpliced()

// dndClasses.splice(1, 3);
// console.log(dndClasses);

// dndClasses.splice(2, 1, 'sorcerer');
// console.log(dndClasses);

//.slice()
console.log(dndClasses.slice(0, 3));

//.join()
console.log(dndClasses.join());
