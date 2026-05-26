import { createContext } from 'react';
import './index.css';
import ParentComponent from './components/ParentComponent';
import NoContextParent from './components/NoContextParent';

/* eslint-disable react-refresh/only-export-components */
export const UserContext = createContext();

const App = () => {
  const user = { name: 'John Doe', age: 30 };

  return (
    <>
      <NoContextParent user={user} />
      <br />
      <UserContext value={user}>
        <ParentComponent />
      </UserContext>
    </>
  );
};

export default App;
