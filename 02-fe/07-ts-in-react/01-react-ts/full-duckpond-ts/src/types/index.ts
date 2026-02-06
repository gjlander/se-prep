import type { Dispatch, SetStateAction } from 'react';
type DBEntry = {
	_id: string;
	createdAt: string;
	__v: number;
};

export type DuckInput = {
	name: string;
	imgUrl: string;
	quote: string;
};

export type SignInInput = {
	email: string;
	password: string;
};

export type Duck = DBEntry & DuckInput;

export type User = DBEntry & {
	firstName: string;
	lastName: string;
	email: string;
};

export type AuthContextType = {
	signedIn: boolean;
	user: User | null;
	handleSignIn: (token: string) => void;
	handleSignOut: () => void;
};

export type DuckContextType = {
	ducks: Duck[];
	setDucks: Dispatch<SetStateAction<Duck[]>>;
};

export type DuckErrors = Partial<DuckInput>;

export type SignInErrors = Partial<SignInInput>;

export type ActionResult<T> = {
	error: null | T;
	success: boolean;
};

export type DuckActionResult = ActionResult<DuckErrors>;

export type SignInActionResult = ActionResult<SignInErrors>;
