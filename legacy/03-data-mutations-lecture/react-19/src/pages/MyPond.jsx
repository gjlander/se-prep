import { useState } from 'react';
import { DuckPond, DuckForm, Actions, UseActionState } from '../components';

const MyPond = () => {
  const [myDucks, setMyDucks] = useState(JSON.parse(localStorage.getItem('myDucks')) || []);

  return (
    <>
      <DuckPond ducks={myDucks} />
      {/* <DuckForm setDucks={setMyDucks} /> */}
      {/* <Actions setDucks={setMyDucks} /> */}
      <UseActionState setDucks={setMyDucks} />
    </>
  );
};

export default MyPond;
