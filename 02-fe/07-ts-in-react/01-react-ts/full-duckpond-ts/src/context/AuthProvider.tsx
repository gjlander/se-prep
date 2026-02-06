import type { User, AuthContextType } from '../types';
import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from '.';
import { me } from '../data';

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [signedIn, setSignedIn] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [checkSession, setCheckSession] = useState(true);

	useEffect(() => {
		const getUser = async () => {
			try {
				const data = await me();

				setUser(data);
				setSignedIn(true);
			} catch (error) {
				console.error(error);
			} finally {
				setCheckSession(false);
			}
		};

		if (checkSession) getUser();
	}, [checkSession]);

	const handleSignIn = (token: string) => {
		localStorage.setItem('token', token);
		setSignedIn(true);
		setCheckSession(true);
	};

	const handleSignOut = () => {
		localStorage.removeItem('token');
		setSignedIn(false);
		setUser(null);
	};
	const value: AuthContextType = {
		signedIn,
		user,
		handleSignIn,
		handleSignOut
	};
	return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;
