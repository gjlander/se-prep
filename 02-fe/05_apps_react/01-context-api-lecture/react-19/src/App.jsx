import { useState, useEffect } from 'react';
import { getAllDucks } from './data/ducks';
import { DuckContext } from './context/duckContext';
import DuckProvider from './context/DuckProvider';

import Navbar from './components/Navbar';
import Header from './components/Header';
import DuckPond from './components/DuckPond';
import DuckForm from './components/DuckForm';
import Footer from './components/Footer';

function App() {
	return (
		<DuckProvider>
			<div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
				<Navbar />
				<Header />
				<main className='flex-grow flex flex-col justify-between py-4'>
					<DuckPond />
					<DuckForm />
				</main>
				<Footer />
			</div>
		</DuckProvider>
	);
}

export default App;
