import type { Dispatch, SetStateAction } from 'react';
declare global {
	type Post = {
		id: string;
		title: string;
		userId: string;
		image: string;
		content: string;
	};

	type User = {
		id: string;
		email: string;
		name: string;
	};

	type LoginData = { email: string; password: string };

	type RegisterFormState = {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		confirmPassword: string;
	};

	type AuthContextType = {
		signedIn: boolean;
		user: User | null;
		handleSignIn: ({ email, password }: LoginData) => Promise<void>;
		handleSignOut: () => Promise<void>;
		handleRegister: (formState: RegisterFormState) => Promise<void>;
	};

	type SetPosts = Dispatch<SetStateAction<Post[]>>;
}
