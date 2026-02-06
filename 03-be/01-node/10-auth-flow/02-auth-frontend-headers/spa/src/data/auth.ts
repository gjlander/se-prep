import { authServiceURL } from '@/utils';

// const AUTH_URL: string | undefined = import.meta.env
// 	.VITE_APP_AUTH_SERVER_URL as string | undefined;
// if (!AUTH_URL)
// 	throw new Error('API URL is required, are you missing a .env file?');
// const authServiceURL: string = `${AUTH_URL}`;

type LoginInput = { email: string; password: string };

type SuccessRes = { message: string };

type TokenRes = SuccessRes & { accessToken: string; refreshToken: string };

const login = async (formData: LoginInput): Promise<TokenRes> => {
	const res = await fetch(`${authServiceURL}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as TokenRes;
	// console.log(data);

	return data;
};

const me = async (): Promise<User> => {
	const accessToken = localStorage.getItem('accessToken');

	const res = await fetch(`${authServiceURL}/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const { user } = (await res.json()) as SuccessRes & { user: User };
	// console.log(data);

	return user;
};

const logout = async (): Promise<TokenRes> => {
	const accessToken = localStorage.getItem('accessToken');
	const res = await fetch(`${authServiceURL}/logout`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: localStorage.getItem('refreshToken')
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as TokenRes;
	// console.log(data);

	return data;
};

const register = async (formData: RegisterFormState): Promise<TokenRes> => {
	const accessToken = localStorage.getItem('accessToken');
	const res = await fetch(`${authServiceURL}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as TokenRes;
	// console.log(data);

	return data;
};

export { login, me, logout, register };
