const BASE_URL = 'https://duckpond-89zn.onrender.com/auth';

const signIn = async formData => {
	const res = await fetch(`${BASE_URL}/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = await res.json();
	// console.log(data);

	return data;
};

const me = async () => {
	const token = localStorage.getItem('token');

	const res = await fetch(`${BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = await res.json();
	// console.log(data);

	return data;
};

export { signIn, me };
