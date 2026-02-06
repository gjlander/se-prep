# JS Objects

## Key points for exercises

-   Declaring an object literal
-   Dot and bracket notation
-   Making method, brief intro to this keyword
-   Destructuring

## Object Literals

-   declare with curly brackets
-   Key/value pairs - what does this look like?
-   Key only needs quote with -, otherwise no quotes
-   Value can be any data type

```js
const dndChar = {
    name: 'Kaladan',
    dndClass: 'paladin',
    level: 12,
    'spells-list': ['divine smite', 'bless', "crusader's mantle"],
};

console.log(dndChar);
```

### Accessing properties

#### Dot notation

-   How would I only print his name?

```js
console.log(dndChar.name);
```

#### Bracket notation

-   For when dot notation won't work
-   Main use case is if we have a variable, or quotes around key

```js
console.log(dndChar['spells-list']);
const propIWant = 'dndClass';

console.log(dndChar[propIWant]);
```

-   Can use hyphen, but by convention we use camelCase

```js
const dndChar = {
    name: 'Kaladan',
    dndClass: 'paladin',
    level: 12,
    spellsList: ['divine smite', 'bless', "crusader's mantle"],
};
```

#### Updating with dot notation

-   This is why we always declare with const - it is mutable (we can update it)

```js
dndChar.level = 13;
console.log(dndChar);
```

### Methods

-   Remember, a method is a function that belongs to an object
-   We have access to all of the methods from the prototype (as with arrays), but can also make our own

```js
const dndChar = {
    name: 'Kaladan',
    dndClass: 'paladin',
    level: 12,
    spellsList: ['divine smite', 'bless', "crusader's mantle"],
    yellCatchPhrase() {
        return 'To smite is right!';
    },
};
```

-   And we can access them the same way - with dot notation (remember parenthesis )

### this

-   this could be it's own lecture, for today, suffice to say it allows a method in an object to reference itself

```js
const dndChar = {
    name: 'Kaladan',
    dndClass: 'paladin',
    level: 12,
    spellsList: ['divine smite', 'bless', "crusader's mantle"],
    yellCatchPhrase() {
        return 'To smite is right!';
    },
    introduce() {
        return `My name is ${this.name} the ${this.dndClass}!`;
    },
};

console.log(dndChar.introduce());
```

### Destructuring

-   We can store a property in a variable

```js
const myName = dndChar.name;

console.log(myName);
```

-   If we use the exact key, we can destructure a value
-   If that property doesn't exist, we jut get undefined

```js
const { name, dndClass, myDndClass } = dndChar;
console.log(name, dndClass, myDndClass);
```

### Go to slide for more detail [here](https://playground.wbscod.in/static/javascript-objects-i/3)

-   Can nest destructuring
-   Can also destructure arrays using [] brackets

## Built in objects

-   JS has some objects available to use
-   One is already quite familiar, what have we been using to print things?

```js
console.log(console);
```

### Math and Date [go to slide](https://playground.wbscod.in/static/javascript-objects-i/2)

-   Can use new keyword with a constructor, outside of the scope of today but can use it for Date
