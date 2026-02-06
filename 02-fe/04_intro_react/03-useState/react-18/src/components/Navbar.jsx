import { useState } from 'react';
const Navbar = () => {
    // const isSignedIn = false;
    const [isSignedIn, setIsSignedIn] = useState(false);
    const handleClick = () => setIsSignedIn((prev) => !prev);
    return (
        <nav className='flex justify-end bg-slate-800 py-2 px-8 text-2xl mb-6'>
            <ul className='flex gap-6'>
                <li className='p-2 rounded-lg hover:bg-slate-600'>
                    <a href='index.html'>Home</a>
                </li>
                <li className='p-2 rounded-lg hover:bg-slate-600'>
                    <a href='src/myPond.html'>My Pond</a>
                </li>
                <li className='p-2 rounded-lg hover:bg-slate-600'>
                    {isSignedIn ? (
                        <button onClick={handleClick}>Sign Out</button>
                    ) : (
                        <button onClick={handleClick}>Sign In</button>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
