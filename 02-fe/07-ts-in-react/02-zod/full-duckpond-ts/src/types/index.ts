import type { z } from 'zod/v4';
import type { Dispatch, SetStateAction } from 'react';
import type { DuckInputSchema, DuckSchema, DuckSchemaArray, SignInResSchema, UserSchema } from '../schemas';

// export type DuckInput = {
// 	name: string;
// 	imgUrl: string;
// 	quote: string;
// };

export type DuckInput = z.infer<typeof DuckInputSchema>;

export type SignInInput = {
	email: string;
	password: string;
};

// export type Duck = DBEntry & DuckInput;
export type Duck = z.infer<typeof DuckSchema>;

export type DuckArray = z.infer<typeof DuckSchemaArray>;

export type SignInRes = z.infer<typeof SignInResSchema>;

export type User = z.infer<typeof UserSchema>;

// export type User = DBEntry & {
// 	firstName: string;
// 	lastName: string;
// 	email: string;
// };

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
