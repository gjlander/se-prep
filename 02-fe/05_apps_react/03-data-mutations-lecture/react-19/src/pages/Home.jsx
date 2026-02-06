import { useState, useEffect } from 'react';
import { getAllDucks } from '../data';
import { Header, DuckPond } from '../components';

const Home = () => {
  const [ducks, setDucks] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        const allDucks = await getAllDucks(abortController);

        setDucks(allDucks);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.info('Fetch aborted');
        } else {
          console.error(error);
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, []);
  return (
    <>
      <Header />
      <DuckPond ducks={ducks} />
    </>
  );
};

export default Home;
