//Higher-order functions

const print = (content) => console.log(content);

// const printArray = (array) => {
//     for (let i = 0; i < array.length; i++) {
//         print(array[i]);
//     }
// };

const avatarChars = [
    { name: 'Aang', nation: 'Air Nation', isBender: true },
    { name: 'Katara', nation: 'Water Tribe', isBender: true },
    { name: 'Sokka', nation: 'Water Tribe', isBender: false },
];

// printArray(avatarChars);

const sayHello = (char) => {
    console.log(`Hi, I'm ${char.name} and I'm from the ${char.nation}`);
};

// const sayHelloLoop = (array) => {
//     for (let i = 0; i < array.length; i++) {
//         sayHello(array[i]);
//     }
// };

// sayHelloLoop(avatarChars);

const higherOrderArrayFunc = (arr, callbackFunc) => {
    for (let i = 0; i < arr.length; i++) {
        callbackFunc(arr[i]);
    }
};

// higherOrderArrayFunc(avatarChars, print);

// higherOrderArrayFunc(avatarChars, sayHello);

// higherOrderArrayFunc(avatarChars, (obj) =>
//     obj.isBender
//         ? console.log("I'm a bender!")
//         : console.log("I can't bend an element, but I've got my wits!")
// );

//Higher Order Array Methods

// avatarChars.forEach((obj) =>
//     obj.isBender
//         ? console.log("I'm a bender!")
//         : console.log("I can't bend an element, but I've got my wits!")
// );
// avatarChars.forEach((c) => print(c));
// avatarChars.forEach((char) => sayHello(char));

avatarChars.forEach((content) => console.log(content));

// avatarChars.forEach((char) => {
//     console.log(`Hi, I'm ${char.name} and I'm from the ${char.nation}`);
// });
