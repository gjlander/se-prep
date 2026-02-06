import type { User, SignInInput } from '../types';
const BASE_URL = 'https://duckpond-89zn.onrender.com/auth';

type SignInRes = {
	token: string;
	user: {
		userId: string;
	};
};

const signIn = async (formData: SignInInput): Promise<SignInRes> => {
	const res = await fetch(`${BASE_URL}/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as SignInRes;
	// console.log(data);

	return data;
};

const me = async (): Promise<User> => {
	const token = localStorage.getItem('token');

	const res = await fetch(`${BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as User;
	// console.log(data);

	return data;
};

export { signIn, me };
