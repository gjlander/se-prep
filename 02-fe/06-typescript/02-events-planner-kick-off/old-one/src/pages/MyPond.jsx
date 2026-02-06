import { useState } from 'react';
//since the data passed via the outlet, we import the useOutletContext hook from react-router
import { useOutletContext, Navigate } from 'react-router';
import DuckPond from '../components/DuckPond';
import DuckForm from '../components/DuckForm';

const MyPond = () => {
    const [myDucks, setMyDucks] = useState(
        JSON.parse(localStorage.getItem('myDucks')) || []
    );
    // to access the state (or any data), we simply deconstruct it
    const { signedIn } = useOutletContext();

    if (!signedIn) return <Navigate to='/signin' />;
    return (
        <>
            <DuckForm setDucks={setMyDucks} />
            <DuckPond ducks={myDucks} />
        </>
    );
};

export default MyPond;
