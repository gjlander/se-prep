import { useEffect, useState } from 'react';

type UserType = {
	name: string;
	age: number;
	email?: string;
};

const Profile = () => {
	const [user, setUser] = useState<UserType>({ name: 'Ada', age: 36 });

	useEffect(() => {
		const id = setTimeout(
			() =>
				setUser({
					name: 'Ada Lovelace',
					age: 37,
					email: 'test@mail.com'
				}),
			1000
		);

		return () => clearTimeout(id);
	}, []);

	return (
		<p>
			{user.name} is {user.age} years old
		</p>
	);
};

export default Profile;
