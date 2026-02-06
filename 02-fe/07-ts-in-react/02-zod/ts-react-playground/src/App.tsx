import { useEffect, useState } from 'react';
import { z } from 'zod/v4';

const TodoSchema = z.object({
	userId: z.number(),
	id: z.number(),
	title: z.string(),
	completed: z.boolean()
});

const TodoArraySchema = z.array(TodoSchema);
// type Todo = {
// 	userId: number;
// 	id: number;
// 	title: string;
// 	completed: boolean;
// };

// type Todo = z.infer<typeof TodoSchema>;
type TodoArray = z.infer<typeof TodoArraySchema>;

const App = () => {
	// const [todo, setTodo] = useState<Todo | null>(null);
	const [todo, setTodo] = useState<TodoArray>([]);
	useEffect(() => {
		const getTodo = async () => {
			try {
				const res = await fetch('https://jsonplaceholder.typicode.com/todos/');
				if (!res.ok) throw new Error('Something went wrong!');
				const dataRes = await res.json();
				console.log(dataRes);
				const { success, data, error } = TodoArraySchema.safeParse(dataRes);
				if (!success) {
					throw new Error(z.prettifyError(error));
				}
				setTodo(data);
			} catch (error) {
				console.error(error);
			}
		};
		getTodo();
	}, []);
	return (
		<div>
			<h1>Runtime Validation with Zod</h1>
			<ul>
				{todo.map(todo => (
					<li key={todo.id} className={todo.completed ? 'line-through' : ''}>
						{todo.title}
					</li>
				))}
			</ul>
		</div>
	);
};

export default App;
