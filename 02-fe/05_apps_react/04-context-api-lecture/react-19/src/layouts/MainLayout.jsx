import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { DuckProvider } from '../context';
import { Navbar, Footer } from '../components';

const MainLayout = () => {
  return (
    <DuckProvider>
      <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex-grow flex flex-col justify-between py-4'>
          <Outlet />
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </DuckProvider>
  );
};

export default MainLayout;
