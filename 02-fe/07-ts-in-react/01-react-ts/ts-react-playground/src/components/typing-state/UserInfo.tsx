import { useEffect, useState } from 'react';

const UserInfo = () => {
	const [user, setUser] = useState<string | null>(null);

	useEffect(() => {
		const id = setTimeout(() => setUser('John Doe'), 1000);

		return () => clearTimeout(id);
	}, []);

	return <p>{user ? `Welcome, ${user}` : 'Loading...'}</p>;
};

export default UserInfo;
