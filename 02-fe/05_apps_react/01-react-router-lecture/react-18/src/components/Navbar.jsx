import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
const Navbar = () => {
    const [signedIn, setSignedIn] = useState(false);
    const navigate = useNavigate();
    const handleSignIn = () => {
        setSignedIn((prev) => !prev);
        setTimeout(() => {
            navigate('/mypond');
        }, 1000);
    };
    return (
        <div className='navbar bg-slate-800 '>
            <div className='navbar-start'>
                <Link className='font-bold' to='/'>
                    The Duck Pond
                </Link>
            </div>

            <div className='navbar-end'>
                <ul className='menu menu-horizontal items-baseline gap-2'>
                    <li>
                        <NavLink to='/'>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to='/mypond'>My Pond</NavLink>
                    </li>
                    <li>
                        {signedIn ? (
                            <button
                                className='btn btn-primary'
                                onClick={handleSignIn}
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button
                                className='btn btn-primary'
                                onClick={handleSignIn}
                            >
                                Sign In
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
