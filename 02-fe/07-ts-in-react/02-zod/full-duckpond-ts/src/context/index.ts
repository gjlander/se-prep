import type { AuthContextType, DuckContextType } from '../types';
import { createContext, use } from 'react';
import DuckProvider from './DuckProvider';
import AuthProvider from './AuthProvider';

const DuckContext = createContext<DuckContextType | undefined>(undefined);

const useDucks = (): DuckContextType => {
	const context = use(DuckContext);
	if (!context) throw new Error('useDucks must be used within a DuckContext');
	return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
	const context = use(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthContextProvider');
	return context;
};

export { DuckContext, useDucks, DuckProvider, AuthContext, useAuth, AuthProvider };
