const stringArray: Array<string> = ['1', '2', '3'];
// fetch('https://duckpond-89zn.onrender.com/wild-ducks');

const fetchData = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options && options);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
};

type Duck = {
  _id: string;
  name: string;
  imgUrl: string;
  quote: string;
  createdAt: string;
  updatedAt: string;
  __v: string;
};

const ducks = await fetchData<Duck[]>('https://duckpond-89zn.onrender.com/wild-ducks');

console.log(ducks);

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWI1OTkzY2VjYTIwOTkwOWI5NWI0ODJmODVjNDlmMCIsIm5iZiI6MTcyNzcwNTE3Mi42NDA2NDMsInN1YiI6IjY2ZmFhZjAyM2EwZjVhMDhjOGYxOGYzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JILLUNBjQwItAiLtLcP4FdjW4st_bKAdMsGxw253X-0'
  }
};

type Movie = {
  original_title: string;
  poster_path: string;
  id: number;
};

type ApiResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

const tmdbResponse: ApiResponse<Movie> = await fetchData(
  'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
  options
);
console.log(tmdbResponse);

// type DBEntry<T = string | number> = {
//   id: T;
//   createdAt: string;
// };

type LengthWise = {
  length: number;
};

const logLength = <T extends LengthWise>(value: T) => {
  console.log(value.length);
};

// logLength(4);
logLength('45');
logLength([1, 2, 3, 4]);
logLength({ name: 'Sally', length: 3 });

const makeTuple = <T, U>(item1: T, item2: U): [T, U] => [item1, item2];

const myTuple = makeTuple(3, 'Jimmy');

const makeTupleArray = <T extends object>(obj: T) => Object.entries(obj);

const object = {
  a: 'some string',
  b: 42
};

console.log(makeTupleArray(object));
// console.log(makeTupleArray(42));
// console.log(makeTupleArray(null));
// console.log(makeTupleArray(undefined));

type SomeObject = {
  a: string;
  b: number;
};

type SomeObjectKeys = keyof SomeObject;

const someKey: SomeObjectKeys = 'a';
