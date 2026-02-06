import type { DuckInput, Duck, DuckArray } from '../types';
import { z } from 'zod/v4';

import { DuckSchema, DuckSchemaArray } from '../schemas';

const getAllDucks = async (abortCont: AbortController): Promise<DuckArray> => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks', {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const dataRes = await res.json();
	const { success, data, error } = DuckSchemaArray.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));
	// console.log(data);

	return data;
};

const getDuckById = async (id: string, abortCont: AbortController): Promise<Duck> => {
	const res = await fetch(`https://duckpond-89zn.onrender.com/wild-ducks/${id}`, {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const dataRes = await res.json();
	const { success, data, error } = DuckSchema.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));
	// console.log(data);

	return data;
};

const createDuck = async (newDuck: DuckInput): Promise<Duck> => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-duckss', {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(newDuck)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const dataRes = await res.json();
	const { success, data, error } = DuckSchema.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));
	// console.log(data);

	return data;
};

export { getAllDucks, getDuckById, createDuck };
