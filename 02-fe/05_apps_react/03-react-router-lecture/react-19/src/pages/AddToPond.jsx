import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { getAllDucks } from '../data/ducks';
import { DuckContext } from '../context/duckContext';
import DuckProvider from '../context/DuckProvider';

import Navbar from '../components/Navbar';
import Header from '../components/Header';
import DuckForm from '../components/DuckForm';
import Footer from '../components/Footer';

const AddToPond = () => {
	return (
		<DuckProvider>
			<div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
				<Navbar />
				<main className='flex-grow flex flex-col justify-start py-4'>
					<Header />
					<DuckForm />
				</main>
				<Footer />
			</div>
			<ToastContainer />
		</DuckProvider>
	);
};

export default AddToPond;
