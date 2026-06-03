import { useState } from 'react';
import { Link, NavLink } from 'react-router';
const Navbar = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const handleClick = () => setIsSignedIn((prev) => !prev);

	const showActive = ({ isActive }) => (isActive ? 'menu-active' : '');
	return (
		<div className='navbar bg-slate-800'>
			<nav className='navbar-start'>
				<Link className='font-bold' to='/'>
					The Duck Pond
				</Link>
			</nav>
			<nav className='navbar-end'>
				<ul className='menu menu-horizontal items-baseline gap-2'>
					<li>
						<NavLink className={showActive} to='/'>
							Home
						</NavLink>
					</li>
					<li>
						<NavLink className={showActive} to='/add-to-pond'>
							Add to Pond
						</NavLink>
					</li>
					<li>
						{isSignedIn ? (
							<button className='btn btn-primary' onClick={handleClick}>
								Sign Out
							</button>
						) : (
							<button className='btn btn-primary' onClick={handleClick}>
								Sign In
							</button>
						)}
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
