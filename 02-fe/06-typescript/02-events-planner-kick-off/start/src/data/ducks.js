const getAllDucks = async abortCont => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks', {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const data = await res.json();
	// console.log(data);

	return data;
};

const getDuckById = async (id, abortCont) => {
	const res = await fetch(`https://duckpond-89zn.onrender.com/wild-ducks/${id}`, {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = await res.json();

	return data;
};

const createDuck = async newDuck => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-duckss', {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(newDuck)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const data = await res.json();
	return data;
};

export { getAllDucks, getDuckById, createDuck };
