import type { DuckInput, Duck } from '../types';

const getAllDucks = async (abortCont: AbortController): Promise<Duck[]> => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks', {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const data = (await res.json()) as Duck[];
	// console.log(data);

	return data;
};

const getDuckById = async (id: string, abortCont: AbortController): Promise<Duck> => {
	const res = await fetch(`https://duckpond-89zn.onrender.com/wild-ducks/${id}`, {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as Duck;

	return data;
};

const createDuck = async (newDuck: DuckInput): Promise<Duck> => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-duckss', {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(newDuck)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const data = (await res.json()) as Duck;
	return data;
};

export { getAllDucks, getDuckById, createDuck };
