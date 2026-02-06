const API_URL: string | undefined = import.meta.env
	.VITE_APP_TRAVEL_JOURNAL_API_URL as string | undefined;
if (!API_URL)
	throw new Error('API URL is required, are you missing a .env file?');
const baseURL: string = `${API_URL}/auth`;

type LoginInput = { email: string; password: string };

type SuccessRes = { message: string };

type TokenRes = SuccessRes & { token: string };

const login = async (formData: LoginInput): Promise<TokenRes> => {
	const res = await fetch(`${baseURL}/login`, {
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

	const res = await fetch(`${baseURL}/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as User;
	// console.log(data);

	return data;
};

const logout = async (): Promise<TokenRes> => {
	const accessToken = localStorage.getItem('accessToken');
	const res = await fetch(`${baseURL}/logout`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as TokenRes;
	// console.log(data);

	return data;
};

const register = async (formData: RegisterFormState): Promise<void> => {
	const accessToken = localStorage.getItem('accessToken');
	const res = await fetch(`${baseURL}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
};

export { login, me, logout, register };
