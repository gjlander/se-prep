import {
	useState,
	type ChangeEventHandler,
	type FormEventHandler
} from 'react';
import { toast } from 'react-toastify';
import type { Message, SetMessages, SetChatId } from '../types';
import { createChat, fetchChat } from '../data/ai';

type FormProps = {
	setMessages: SetMessages;
	chatId: string | null;
	setChatId: SetChatId;
};

const Form = ({ setMessages, chatId, setChatId }: FormProps) => {
	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);
	const [isStream, setIsStream] = useState(false);

	const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
		setPrompt(e.target.value);

	const toggleChecked = () => setIsStream((prev) => !prev);

	const handleSubmit: FormEventHandler = async (e) => {
		try {
			e.preventDefault();
			// If the prompt value is empty, alert the user
			if (!prompt) throw new Error('Please enter a prompt');

			// Disable the submit button
			setLoading(true);

			const userMsg: Message = {
				role: 'user',
				content: prompt,
				_id: crypto.randomUUID()
			};
			setMessages((prev) => [...prev, userMsg]);
			const asstMsg: Message = {
				_id: crypto.randomUUID(),
				content: '',
				role: 'assistant'
			};

			if (isStream) {
				const res = await fetchChat({ prompt, stream: isStream, chatId });
				// console.log(res);

				const reader = res.body!.getReader();
				const decoder = new TextDecoder();
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					// console.log('done, value ', done, value);
					const chunk = decoder.decode(value, { stream: true });
					// console.log(chunk);
					const lines = chunk.split('\n');
					// console.log('lines: ', lines);

					// filter for lines that start with data indicating a new chunk
					const dataLines = lines.filter((line) => line.startsWith('data:'));

					dataLines.forEach((line) => {
						// Get the JSON string without the data: prefix
						const jsonStr = line.replace('data:', '');
						const data = JSON.parse(jsonStr);
						console.log(data);
					});
				}
			} else {
				const response = await createChat({ prompt, chatId, stream: isStream });
				asstMsg.content = response.completion;
				setPrompt('');
				setMessages((prev) => [...prev, asstMsg]);
				localStorage.setItem('chatId', response.chatId);
				setChatId(chatId);
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Failed to send message');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='h-1/3 w-full p-8 bg-slate-600 rounded-lg shadow-md'>
			<form onSubmit={handleSubmit}>
				<label className='flex gap-2 items-center my-2'>
					<input
						id='stream'
						type='checkbox'
						className='checkbox checkbox-primary'
						checked={isStream}
						onChange={toggleChecked}
						disabled={loading}
					/>
					<span>Stream response?</span>
				</label>
				<textarea
					value={prompt}
					onChange={handleChange}
					id='prompt'
					rows={5}
					placeholder='Ask me anything...'
					className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
				></textarea>
				<button
					id='submit'
					type='submit'
					className='mt-4 w-full btn btn-primary'
					disabled={loading}
				>
					Submit✨
				</button>
			</form>
		</div>
	);
};

export default Form;
