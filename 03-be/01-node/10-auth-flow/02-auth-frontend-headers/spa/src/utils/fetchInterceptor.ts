const originalFetch = window.fetch;
const authServiceURL = import.meta.env.VITE_APP_AUTH_SERVER_URL;
if (!authServiceURL) {
	console.error('No Auth service set');
}

window.fetch = async (url, options, ...rest) => {
	let res = await originalFetch(
		url,
		{ ...options /*credentials: 'include'*/ },
		...rest
	);
	const authHeader = res.headers.get('www-authenticate');
	if (authHeader?.includes('token_expired')) {
		console.log('ATTEMPT REFRESH');
		const refreshRes = await originalFetch(`${authServiceURL}/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: localStorage.getItem('refreshToken')
		});
		if (!refreshRes.ok) throw new Error('Login required');

		const { accessToken, refreshToken } = await res.json();
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
		res = await originalFetch(
			url,
			{
				...options,
				headers: {
					...options?.headers,
					Authorization: `Bearer ${accessToken}`
				}
			},
			...rest
		);
	}
	return res;
};

export { authServiceURL };
