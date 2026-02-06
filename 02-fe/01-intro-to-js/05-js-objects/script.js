//////JS OBJECTS/////////////

const dndChar = {
    name: 'Kaladan',
    dndClass: 'paladin',
    level: 12,
    spellsList: ['divine smite', 'bless', "crusader's mantle"],
    yellCatchPhrase() {
        return 'To smite is right!';
    },
    introduce() {
        return `My name is ${this.name} the ${this.class}!`;
    },
};

// console.log(dndChar.name);
// console.log(dndChar['spells-list']);
const propIWant = 'dndClass';

// console.log(dndChar[propIWant]);

// dndChar.level = 13;
// console.log(dndChar);

// console.log(dndChar.yellCatchPhrase());

// console.log(dndChar.introduce());

//Destructuring
const myName = dndChar.name;

console.log(myName);

// const { name, dndClass, myDndClass } = dndChar;
// console.log(name, dndClass, myDndClass);

// console.log(console);
