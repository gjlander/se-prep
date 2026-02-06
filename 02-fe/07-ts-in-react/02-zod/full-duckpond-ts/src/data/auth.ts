import type { User, SignInInput, SignInRes } from '../types';
import { z } from 'zod/v4';
import { SignInResSchema, UserSchema } from '../schemas';
const BASE_URL = 'https://duckpond-89zn.onrender.com/auth';

const signIn = async (formData: SignInInput): Promise<SignInRes> => {
	const res = await fetch(`${BASE_URL}/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const dataRes = await res.json();
	const { success, data, error } = SignInResSchema.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));

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

	const dataRes = await res.json();
	const { success, data, error } = UserSchema.safeParse(dataRes);
	if (!success) throw new Error(z.prettifyError(error));

	return data;
};

export { signIn, me };
