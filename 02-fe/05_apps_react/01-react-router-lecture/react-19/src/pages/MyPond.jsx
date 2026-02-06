import { useState } from 'react';
import { DuckPond, DuckForm } from '../components';

const MyPond = () => {
  const [myDucks, setMyDucks] = useState(JSON.parse(localStorage.getItem('myDucks')) || []);

  return (
    <>
      <DuckPond ducks={myDucks} />
      <DuckForm setDucks={setMyDucks} />
    </>
  );
};

export default MyPond;
