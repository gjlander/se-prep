const sleep = ms => new Promise(res => setTimeout(res, ms));

const isValidUrl = testUrl => {
	try {
		new URL(testUrl);
		return true;
		// eslint-disable-next-line no-unused-vars
	} catch (error) {
		return false;
	}
};

const validateDuckForm = ({ name, imgUrl, quote }) => {
	const newErrors = {};
	if (!name.trim()) {
		newErrors.name = 'Name is required';
	}
	if (!imgUrl.trim()) {
		newErrors.imgUrl = 'Image URL is required';
	} else if (!isValidUrl(imgUrl)) {
		newErrors.imgUrl = 'Image must be a valid URL';
	}
	if (!quote.trim()) {
		newErrors.quote = 'Quote is required';
	}
	return newErrors;
};

const validateSignIn = ({ email, password }) => {
	const newErrors = {};

	if (!email.trim()) {
		newErrors.email = 'Email is required';
	}
	if (!password.trim()) {
		newErrors.password = 'Password is required';
	}

	return newErrors;
};

export { isValidUrl, validateDuckForm, sleep, validateSignIn };
