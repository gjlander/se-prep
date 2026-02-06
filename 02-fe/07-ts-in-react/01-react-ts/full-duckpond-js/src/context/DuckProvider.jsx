import { useState, useEffect } from 'react';

import { getAllDucks } from '../data';
import { DuckContext } from '../context';

const DuckProvider = ({ children }) => {
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
  return <DuckContext value={{ ducks, setDucks }}>{children}</DuckContext>;
};

export default DuckProvider;
