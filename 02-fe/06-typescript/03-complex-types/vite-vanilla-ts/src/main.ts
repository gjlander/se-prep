const strings: string[] = ['hi', 'bye', 'what?'];
const nums: number[] = [1, 3, 5, 6, 7];

// nums.push('4');

// const bools: Array<boolean> = [true, false, false, true];

const graphCoordinates: [number, number, number?] = [23, -3];
type StringOrNumber = string | number;

type Person = { id: StringOrNumber; readonly name: string; age: number; city?: string };

const person: Person = {
  //   id: 3,
  id: '485ghf-394',
  name: 'Steve',
  age: 72
};

// person.name = 54;
// person.name = 'Alex';
// person.city = 'Berlin;
console.log(person.city?.toUpperCase());
console.log(person.city || 'Unknown');
console.log(person.city ?? 'Unknown');

const person2: Person = {
  id: 4,
  name: 'Reed',
  age: 43
};

const people: Person[] = [];

people.push(person);
people.push(person2);

// people.push({ name: 'Susan' });

// console.log(0 || 'Default');
// console.log(0 ?? 'Default');
// console.log('' || 'Default');
// console.log('' ?? 'Default');
// console.log(null || 'Default');
// console.log(null ?? 'Default');

if (person.city) {
  console.log(person.city.toUpperCase());
}

person.city && console.log(person.city.toUpperCase());

interface User {
  name: string;
  age: number;
}

const users: User[] = [
  { name: 'Ada', age: 36 },
  { name: 'Grace', age: 30 }
];

console.log(users);

// users.push({ name: 'Linus' });

users.forEach(user => {
  console.log(`${user.name} is ${user.age} years old`);
});

type DBEntry = {
  _id: string;
  createdAt: string;
};

type DBUser = DBEntry & {
  name: string;
  email: string;
  password: string;
};

const user: DBUser = {
  _id: '123fhgksaw',
  name: 'Steve Rogers',
  email: 'captain@america.com',
  createdAt: '2025-08-01',
  password: 'stevepass'
};

interface DBEntryInterface {
  _id: string;
  createdAt: string;
}

interface DBUserInterface extends DBEntryInterface {
  name: string;
  email: string;
  password: string;
}

const user2: DBUserInterface = {
  _id: '123fhgksaw',
  name: 'Steve Rogers',
  email: 'captain@america.com',
  createdAt: '2025-08-01',
  password: 'stevepass'
};

type Calculation = (num1: number, num2: number) => number;

const add: Calculation = (a, b) => a + b;

const subtract: Calculation = (a, b) => a - b;

// add('4', 4);
