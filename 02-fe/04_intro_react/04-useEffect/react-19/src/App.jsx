import { useState, useEffect } from 'react';
import { getAllDucks } from './data/ducks';
import Navbar from './components/Navbar';
import Header from './components/Header';
import DuckPond from './components/DuckPond';
import DuckForm from './components/DuckForm';
import Footer from './components/Footer';
const sleep = ms => new Promise(res => setTimeout(res, ms));

function App() {
	const [ducks, setDucks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();
		(async () => {
			setLoading(true);
			setError(null);
			try {
				await sleep(2000);
				const allDucks = await getAllDucks(abortController);

				setDucks(allDucks);
			} catch (error) {
				if (error.name === 'AbortError') {
					console.info('Fetch aborted');
				} else {
					console.error(error);
					setError('Error bringing ducks to the pond');
				}
			} finally {
				setLoading(false);
			}
		})();

		return () => {
			abortController.abort();
		};
	}, []);
	return (
		<div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
			<Navbar />
			<Header />
			<main className='flex-grow flex flex-col justify-between py-4'>
				<DuckPond error={error} loading={loading} ducks={ducks} />
				<DuckForm setDucks={setDucks} />
			</main>
			<Footer />
		</div>
	);
}

export default App;
