import { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Header from './components/Header';
import DuckPond from './components/DuckPond';
import DuckForm from './components/DuckForm';
import Footer from './components/Footer';
import { getAllDucks } from './data/ducks';

function App() {
    const [ducks, setDucks] = useState([]);
    useEffect(() => {
        let ignore = false;
        // const getAndSetDucks = async () => {
        //     const allDucks = await getAllDucks();
        //     if (!ignore) {
        //         setDucks(allDucks);
        //     }
        // };
        // getAndSetDucks();

        (async () => {
            try {
                const allDucks = await getAllDucks();

                if (!ignore) {
                    setDucks(allDucks);
                }
            } catch (error) {
                console.error(error);
            }
        })();

        return () => {
            ignore = true;
        };
    }, []);
    return (
        <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
            <Navbar />
            <Header />
            <main className='flex-grow flex flex-col justify-between py-4'>
                <DuckPond ducks={ducks} />
                <DuckForm setDucks={setDucks} />
            </main>
            <Footer />
        </div>
    );
}

export default App;
