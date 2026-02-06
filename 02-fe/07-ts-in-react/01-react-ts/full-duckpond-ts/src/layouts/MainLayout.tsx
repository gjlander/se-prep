import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { DuckProvider, AuthProvider } from '../context';
import { Navbar, Footer } from '../components';

const MainLayout = () => {
	return (
		<AuthProvider>
			<div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
				<Navbar />
				<DuckProvider>
					<main className='flex-grow flex flex-col justify-between py-4'>
						<Outlet />
					</main>
				</DuckProvider>
				<Footer />
				<ToastContainer />
			</div>
		</AuthProvider>
	);
};

export default MainLayout;
