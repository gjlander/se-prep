import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../context';
const AuthLayout = () => {
	const { signedIn } = useAuth();
	if (signedIn) {
		return <Outlet />;
	} else {
		return <Navigate to='/signin' />;
	}
};

export default AuthLayout;
