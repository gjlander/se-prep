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

export { isValidUrl, validateDuckForm };
