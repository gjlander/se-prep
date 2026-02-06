const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL;
if (!AI_SERVER_URL)
	throw new Error('AI_SERVER_URL is required, are you missing a .env file?');
const baseURL = `${AI_SERVER_URL}/ai`;

type ChatBody = {
	prompt: string;
	chatId?: string | null;
	stream: boolean;
};

type ChatRes = {
	completion: string;
	chatId: string;
};

const fetchChat = async (body: ChatBody): Promise<Response> => {
	const response = await fetch(`${baseURL}/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	if (!response.ok) {
		// If the response is not ok, throw an error by parsing the JSON response
		const { message } = await response.json();
		throw new Error(message || 'Something went wrong');
	}

	return response;
};

const createChat = async (body: ChatBody): Promise<ChatRes> => {
	const response = await fetchChat(body);

	const data = (await response.json()) as ChatRes;

	return data;
};

const getChatHistory = async (chatId: string) => {
	const response = await fetch(`${baseURL}/history/${chatId}`);
	if (!response.ok) {
		// If the response is not ok, throw an error by parsing the JSON response
		const { message } = await response.json();
		throw new Error(message || 'Something went wrong');
	}

	const data = await response.json();

	return data;
};

export { createChat, getChatHistory, fetchChat };
