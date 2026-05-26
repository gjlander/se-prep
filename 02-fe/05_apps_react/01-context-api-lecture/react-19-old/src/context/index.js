import { createContext, use } from 'react';
import DuckProvider from './DuckProvider';
const DuckContext = createContext();

const useDucks = () => {
  const context = use(DuckContext);
  if (!context) throw new Error('useDucks must be used within a DuckContext');
  return context;
};

export { DuckContext, useDucks, DuckProvider };
